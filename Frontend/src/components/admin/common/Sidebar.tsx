import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCircleCheck,
  faHouse,
  faImage,
  faMusic,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { LogOut, Moon, Sun } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { adminApiClient } from "@/apis/apiClient";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { useTheme } from "../../ui/theme-provider";
import { adminLogout } from "@/redux/slice/admin/adminSlice";

const Sidebar: React.FC<{ page: string }> = ({ page }) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const { currentAdmin } = useSelector((state: RootState) => state.admin);
  const [loading, setLoading] = useState(false);

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await adminApiClient.post("/auth/logout");
      localStorage.removeItem("adminToken");
      setTimeout(() => {
        dispatch(adminLogout());
        navigate("/admin/sign-in");
        toast.success(response.data.message);
        setLoading(false);
      }, 1000);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.log(error);
        const errorMsg = error.response.data?.error || "An error occurred";
        toast.error(errorMsg);
        setLoading(false);
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-[155px] h-full flex flex-col items-center border-r-[1px] border-[#333232] overflow-auto scrollbar-hidden">
      <h1
        className="font-bold text-3xl pt-6 mx-auto text-center cursor-pointer"
        onClick={() => navigate("/admin/dashboard")}
      >
        Instant
      </h1>
      <div className="flex flex-col items-center gap-12 mt-9 text-[#787878] text-3xl">
        <div className="relative group flex items-center justify-center">
          <FontAwesomeIcon
            icon={faHouse}
            onClick={() => navigate("/admin/dashboard")}
            className={`${page === "dashboard" && "dark:text-white text-black"
              } dark:hover:text-white hover:text-black cursor-pointer text-2xl`}
          />
          <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 px-2 py-1 dark:text-white text-black text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Dashboard
          </div>
        </div>
        <div className="relative group flex items-center justify-center">
          <FontAwesomeIcon
            icon={faUsers}
            onClick={() => navigate("/admin/users")}
            className={`${page === "users" && "dark:text-white text-black"
              } dark:hover:text-white hover:text-black cursor-pointer text-2xl`}
          />
          <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 px-2 py-1 dark:text-white text-black text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Users
          </div>
        </div>
        <div className="relative group flex items-center justify-center">
          <FontAwesomeIcon
            icon={faImage}
            onClick={() => navigate("/admin/post")}
            className={`${page === "post" && "dark:text-white text-black"
              } dark:hover:text-white hover:text-black cursor-pointer text-2xl`}
          />
          <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 px-2 py-1 dark:text-white text-black text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Post
          </div>
        </div>
        <div className="relative group flex items-center justify-center">
          <FontAwesomeIcon
            icon={faMusic}
            onClick={() => navigate("/admin/music")}
            className={`${page === "music" && "dark:text-white text-black"
              } dark:hover:text-white hover:text-black cursor-pointer text-2xl`}
          />
          <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 px-2 py-1 dark:text-white text-black text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Music
          </div>
        </div>
        <div className="relative group flex items-center justify-center">
          <FontAwesomeIcon
            icon={faCircleCheck}
            onClick={() => navigate("/admin/subscription")}
            className={`${page === "subscription" && "dark:text-white text-black"
              } dark:hover:text-white hover:text-black cursor-pointer text-2xl`}
          />
          <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 px-2 py-1 dark:text-white text-black text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Subscription
          </div>
        </div>
        <div className="relative group flex items-center justify-center">
          <img
            src={currentAdmin?.profilePicture}
            alt="avatar"
            className={`w-[27px] h-[27px] rounded-full transition-all ${page === "profile" && "border-2 dark:border-white border-black"
              } hover:border-2 dark:hover:border-white hover:border-black object-cover cursor-pointer`}
            onClick={() => navigate("/admin/profile")}
          />
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 dark:text-white text-black text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Profile
          </div>
        </div>
        <Menubar className="cursor-pointer p-0">
          <MenubarMenu>
            <MenubarTrigger className="p-[10px] ">
              <FontAwesomeIcon
                icon={faBars}
                className="hover:text-white cursor-pointer text-lg"
              />
            </MenubarTrigger>
            <MenubarContent>
              <div
                className="cursor-pointer p-[6px] hover:bg-[#27272a] hover rounded text-sm px-2 flex items-center"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "light" ? (
                  <Moon className="mr-2 h-4 w-4" />
                ) : (
                  <Sun className="mr-2 h-4 w-4" />
                )}
                {theme === "light" ? "Dark mode" : "Light mode"}
              </div>
              <MenubarSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild className="w-full">
                  <div className="cursor-pointer p-[6px] hover:bg-[#27272a] hover rounded text-sm px-2 flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to logout ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Logging out will end your current session. You will need
                      to log in again to access your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="w-24">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleLogout}
                      className={`bg-[#09090b] transition-colors w-24 text-white border ${loading
                        ? "opacity-60 cursor-not-allowed"
                        : "opacity-100 cursor-pointer hover:bg-[#B22222]"
                        }`}
                    >
                      {loading ? <div className="spinner "></div> : "Logout"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  );
};

export default Sidebar;
