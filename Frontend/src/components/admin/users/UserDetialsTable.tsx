import * as React from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState, useMemo } from "react";
import { adminApiClient } from "@/apis/apiClient";
import { GetUserDataForAdminDashboard } from "@/types/admin/user";
import toast from "react-hot-toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";
import { debounce } from 'lodash';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserDetialsTable = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [users, setUsers] = useState<GetUserDataForAdminDashboard[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchVal, setSearchVal] = useState("");
  const [totalUser, setTotalUser] = useState(0);
  const [viewProfile, setViewProfile] = useState<string | File>("");
  const isDisabled = page === totalPages;
  const [dataLimit, setDataLimit] = useState<number>(10);
  const limit = [5, 10, 25, 50, 100];
  const [sort, setSort] = useState('');

  useEffect(() => {
    if (!sort) return;

    const sortedUsers = [...users].sort((a, b) => {
      const field = sort.replace("-", "") as keyof GetUserDataForAdminDashboard;;
      const order = sort.startsWith("-") ? -1 : 1;

      if (typeof a[field] === "boolean") {
        return (a[field] === b[field] ? 0 : a[field] ? 1 : -1) * order;
      }

      return (a[field] > b[field] ? 1 : -1) * order;
    });

    setUsers(sortedUsers);
  }, [sort, users]);


  const debouncedFetchUsers = useMemo(
    () =>
      debounce(async (page, search, dataLimit) => {
        try {
          const response = await adminApiClient.get(`/users/get-data`, {
            params: { page, search, limit: dataLimit },
          });
          setUsers(response.data.users);
          setTotalPages(response.data.totalPages);
          setTotalUser(response.data.totalUser);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      }, 500),
    []
  );

  useEffect(() => {
    debouncedFetchUsers(page, searchVal, dataLimit);
    return () => debouncedFetchUsers.cancel();
  }, [page, searchVal, debouncedFetchUsers, dataLimit]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    setPage(1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleAction = async (
    e: React.MouseEvent<HTMLDivElement>,
    userId: string,
    isBlock: boolean,
    username: string
  ) => {
    e.preventDefault();
    const status = isBlock ? "unblock" : "block";
    try {
      const response = await adminApiClient.patch(
        `/users/block-or-unblock/${userId}/${status}`
      );
      if (response.data === "action successfull") {
        toast.success(
          `User ${username} has been ${status === "unblock" ? "unblocked" : "blocked"
          }`
        );
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isBlock: !isBlock } : user
          )
        );
      } else {
        toast.success(response.data);
      }
      return;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleModal = (profileUrl: string | File) => {
    setViewProfile(profileUrl);
    onOpen();
  };

  const handleSort = (field: string) => {
    setSort((prevSort) => (prevSort === field ? `-${field}` : field));
  };

  return (
    <>
      <Modal isOpen={isOpen} size="md" onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center border-1">
                View Profile
              </ModalHeader>
              <ModalBody className="p-10 border-1 w-full h-full flex justify-center items-center">
                <div className="w-[200px] h-[200px] rounded-full border overflow-hidden">
                  <img
                    src={typeof viewProfile === "string" ? viewProfile : ""}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="h-[88vh] overflow-y-auto scrollbar-hidden">
        <div className="flex flex-col gap-4">
          <div className="p-10 pb-1 flex justify-between items-center">
            <div className="w-full max-w-md">
              <div className="relative">
                <input
                  type="text"
                  value={searchVal}
                  onChange={handleSearchChange}
                  className="w-full bg-transparent p-3 pr-10 border rounded-md shadow-sm focus:outline-none"
                  name="search"
                  placeholder="Search"
                />
                <button className="absolute right-2 top-1 p-2 transition-colors hover:text-blue-500 focus:outline-none">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
              </div>
            </div>
            <h1 className="text-lg font-semibold">Total Users: {totalUser}</h1>
          </div>
          <div className="px-10">
            <Select
              value={dataLimit.toString()}
              onValueChange={(value) => {
                setDataLimit(parseInt(value))
                setPage(1);
              }}
            >
              <SelectTrigger
                value={'username'}
                className="w-full max-w-[100px] no-outline py-6 shadow text-sm rounded-md"
              >
                <SelectValue placeholder="Select a gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {
                    limit.map((limit) => (
                      <SelectItem value={limit.toString()}>{limit}</SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto p-10 py-5">
          {users.length > 0 ? (
            <table className="min-w-full">
              <thead className="border rounded-md">
                <tr>
                  <th className="py-3 px-4 text-left">Profile</th>
                  <th onClick={() => handleSort('fullname')} className="py-3 px-4 text-left cursor-pointer">Fullname</th>
                  <th onClick={() => handleSort('username')} className="py-3 px-4 text-left cursor-pointer">Username</th>
                  <th onClick={() => handleSort('email')} className="py-3 px-4 text-left cursor-pointer">Email</th>
                  <th className="py-3 px-4 text-left">Number</th>
                  <th onClick={() => handleSort('isBlock')} className="py-3 px-4 text-left cursor-pointer">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              {users.map((user) => (
                <tbody key={user._id} className="border">
                  <tr className="">
                    <td className="py-2 px-4">
                      <img
                        onClick={() => handleModal(user.profilePicture)}
                        src={
                          typeof user.profilePicture === "string"
                            ? user.profilePicture
                            : ""
                        }
                        alt="upload"
                        className="w-[35px] h-[35px] rounded-full object-cover cursor-pointer"
                      />
                    </td>
                    <td className="py-2 px-4">{user.fullname}</td>
                    <td className="py-2 px-4">{user.username}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">
                      {user.phoneNumber || "-------------"}
                    </td>
                    <td
                      className={`py-2 px-4 ${user.isBlock ? "text-red-600" : "text-green-600"
                        }`}
                    >
                      {user.isBlock ? "Blocked" : "Active"}
                    </td>
                    <td className="py-2 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">Action</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>View More</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) =>
                              handleAction(
                                e,
                                user._id,
                                user.isBlock,
                                user.username
                              )
                            }
                          >
                            {user.isBlock ? "Unblock" : "Block"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                </tbody>
              ))}
              <tfoot className="border">
                <tr>
                  <td className="py-2 px-4 font-bold" colSpan={7}>
                    <div className={`flex items-center ${!(totalUser !== 0 && page === 1 && isDisabled) ? "justify-between" : "justify-end"}`}>
                      {!(totalUser !== 0 && page === 1 && isDisabled) && (
                        <div className="flex gap-4">
                          <Button
                            disabled={page === 1}
                            onClick={handlePrevPage}
                            variant="outline"
                          >
                            &lt;&lt;
                          </Button>
                          <Button
                            disabled={isDisabled}
                            onClick={handleNextPage}
                            variant="outline"
                          >
                            &gt;&gt;
                          </Button>
                        </div>
                      )}
                      <h1 className="p-2">Total Users: {users.length}</h1>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          ) : totalUser === 0 ? (
            <h1>User Not found in Database</h1>
          ) : (
            <h1>No search result</h1>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDetialsTable;
