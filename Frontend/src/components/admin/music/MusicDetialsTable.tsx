import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import AddMusicForm from "./AddMusicForm";

const MusicDetialsTable = () => {
  const [searchVal, setSearchVal] = useState("");

  return (
    <>
      {/* {openModal && (
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
    )} */}
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
        <h1 className="text-lg font-semibold">Total Music : sdaf</h1>
      </div>
      <div className="overflow-x-auto p-10">
        <AddMusicForm />
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
          <tbody className="border">
            <tr className="">
              <td className="py-2 px-4">
                <img
                  src={"/ney.jpg"}
                  alt="upload"
                  className="w-[35px] h-[35px] rounded-full object-cover cursor-pointer"
                />
              </td>
              <td className="py-2 px-4">asjdf;lasjdkf</td>
              <td className="py-2 px-4">sjlkdfjls</td>
              <td className="py-2 px-4">=asdfjlsda</td>
              <td className="py-2 px-4">ajsdlfjlaksdfj;</td>
              <td className={`py-2 px-4`}>ajsdfjlkasdf</td>
              <td className="py-2 px-4">
                asjdfjkalsdf;
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Action</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>View More</DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) =>
                        handleAction(e, user._id, user.isBlock, user.username)
                      }
                    >
                      {user.isBlock ? "Unblock" : "Block"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MusicDetialsTable;
