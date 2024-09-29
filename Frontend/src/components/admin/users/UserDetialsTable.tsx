import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { adminApiClient } from "@/apis/apiClient";
import { GetUserDataForAdminDashboard } from "@/types/admin/user";
import toast from "react-hot-toast";

const UserDetialsTable = () => {
  const [users, setUsers] = useState<GetUserDataForAdminDashboard[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchVal, setSearchVal] = useState("");
  const [totalUser, setTotalUser] = useState(0);
  const isDisabled = page === totalPages;

  const fetchUsers = async (page: number) => {
    try {
      const response = await adminApiClient.get(`/users/get-data`, {
        params: {
          page,
          search: searchVal,
        },
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setTotalUser(response.data.totalUser);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers(page);
    return () => {};
  }, [page, searchVal]);

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
          `User ${username} has been ${
            status === "unblock" ? "unblocked" : "blocked"
          }`
        );
        fetchUsers(page)
      } else {
        toast.success(response.data);
      }
      return;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <>
      <div className="p-10 pb-1 flex justify-between items-center">
        <div className="w-full max-w-md">
          <div className="relative">
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-transparent p-3 border rounded-md shadow-sm focus:outline-none"
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
      <div className="overflow-x-auto p-10">
        {users.length > 0 ? (
          <table className="min-w-full">
            <thead className="border rounded-md">
              <tr>
                <th className="py-3 px-4 text-left">Profile</th>
                <th className="py-3 px-4 text-left">Fullname</th>
                <th className="py-3 px-4 text-left">Username</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Number</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            {users.map((user) => (
              <tbody key={user._id} className="border">
                <tr className="">
                  <td className="py-2 px-4">
                    <img
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
                    className={`py-2 px-4 ${
                      user.isBlock ? "text-red-600" : "text-green-600"
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
            {!(totalUser !== 0 && page === 1 && isDisabled) && (
              <tfoot className="border">
                <tr>
                  <td className="py-2 px-4 font-bold" colSpan={2}>
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
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        ) : totalUser === 0 ? (
          <h1>User Not found in Database</h1>
        ) : (
          <h1>No search result</h1>
        )}
      </div>
    </>
  );
};

export default UserDetialsTable;
