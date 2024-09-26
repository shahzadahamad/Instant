import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserDetialsTable = () => {
  return (
    <>
      <div className="p-10 pb-1 flex justify-between items-center">
        <div className="w-full max-w-md">
          <div className="relative">
            <input
              type="text"
              className="w-full bg-transparent p-3 border rounded-md shadow-sm focus:outline-none"
              name="search"
              placeholder="Search"
            />
            <button className="absolute right-2 top-1 p-2 transition-colors hover:text-blue-500 focus:outline-none">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
        </div>
        <h1 className="text-lg font-semibold">Total Users: 19</h1>
      </div>
      <div className="overflow-x-auto p-10">
        <table className="min-w-full">
          <thead className="border rounded-md">
            <tr>
              <th className="py-3 px-4 text-left">Profile</th>
              <th className="py-3 px-4 text-left">Fullname</th>
              <th className="py-3 px-4 text-left">Username</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Number</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="border">
            <tr className="">
              <td className="py-2 px-4">la;sdjfkl</td>
              <td className="py-2 px-4">laksdfksl;adjf</td>
              <td className="py-2 px-4">kasdjfkl;sad</td>
              <td className="py-2 px-4">ldfjksalfj</td>
              <td className="py-2 px-4">ldfjksalfj</td>
              <td className="py-2 px-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Action</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>View More</DropdownMenuItem>
                    <DropdownMenuItem>Block</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          </tbody>
          <tfoot className="border">
            <tr>
              <td className="py-2 px-4 font-bold" colSpan={2}>
                <div className="flex gap-4">
                  <Button variant="outline">&lt;&lt;</Button>
                  <Button variant="outline">&gt;&gt;</Button>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};

export default UserDetialsTable;
