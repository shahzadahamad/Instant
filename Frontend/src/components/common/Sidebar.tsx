import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faClapperboard,
  faHouse,
  faPlus,
  faCompass as faCompas,
  faHeart as faHearts,
  faComment as faComments,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import {
  faComment,
  faCompass,
  faHeart,
} from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Image, LogOut, Moon, Settings, Sun, VideoIcon } from "lucide-react";
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
import apiClient from "../../apis/apiClient";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { logout } from "@/redux/slice/userSlice";
import { useTheme } from "../ui/theme-provider";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";

const Sidebar: React.FC<{ page: string }> = ({ page }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.post("/auth/logout");
      localStorage.removeItem("token");
      setTimeout(() => {
        dispatch(logout());
        navigate("/");
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
    <div className="w-[155px] h-full flex flex-col items-center border-r-[1px] border-[#333232]">
      <h1
        className="font-bold text-3xl pt-6 mx-auto text-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        Instant
      </h1>
      <div className="flex flex-col items-center gap-8 mt-9 text-[#787878] text-3xl transition-colors">
        <div className="relative group flex items-center justify-center">
          <FontAwesomeIcon
            icon={faHouse}
            onClick={() => navigate("/")}
            className={`${
              page === "home" && "dark:text-white text-black"
            } dark:hover:text-white hover:text-black cursor-pointer text-2xl`}
          />
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Home
          </div>
        </div>
        <div className="relative group flex items-center justify-center">
          <FontAwesomeIcon
            icon={faSearch}
            className={`${
              page === "search" && "dark:text-white text-black"
            } dark:hover:text-white hover:text-black cursor-pointer text-2xl`}
          />
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Search
          </div>
        </div>
        <div className="relative group flex items-center justify-center">
          <FontAwesomeIcon
            icon={faClapperboard}
            className={`${
              page === "reel" && "dark:text-white text-black"
            } dark:hover:text-white hover:text-black cursor-pointer text-2xl`}
          />
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Reel
          </div>
        </div>
        <div className="relative group flex items-center justify-center">
          <FontAwesomeIcon
            icon={page === "chat" ? faComments : faComment}
            onClick={() => navigate("/chats")}
            className={`${
              page === "chat" && "dark:text-white text-black"
            } dark:hover:text-white hover:text-black cursor-pointer text-2xl`}
          />
          <div
            onClick={() => navigate("/chats")}
            className="cursor-pointer absolute top-0.5 right-0.5 transform translate-x-1/2 -translate-y-1/2 bg-[#ff3040] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full"
          >
            1
          </div>
          <div
            onClick={() => navigate("/chats")}
            className="cursor-pointer absolute bottom-6 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          >
            Message
          </div>
        </div>
        <div className="relative group flex items-center justify-center">
          <FontAwesomeIcon
            icon={page === "explore" ? faCompas : faCompass}
            className={`${
              page === "explore" && "dark:text-white text-black"
            } dark:hover:text-white hover:text-black cursor-pointer text-2xl`}
          />
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Explore
          </div>
        </div>
        <div className="relative group flex items-center justify-center">
          <FontAwesomeIcon
            icon={page === "notification" ? faHearts : faHeart}
            className={`${
              page === "notification" && "dark:text-white text-black"
            } dark:hover:text-white hover:text-black cursor-pointer text-2xl`}
          />
          <div className="cursor-pointer absolute top-0.5 right-0 transform translate-x-1/2 -translate-y-1/2 bg-[#ff3040] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
            1
          </div>
          <div className="cursor-pointer absolute bottom-6 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Notification
          </div>
        </div>
        <div
          className="relative group flex items-center justify-center text-2xl"
          onClick={onOpen}
        >
          <FontAwesomeIcon
            icon={faPlus}
            className={`border-[2.5px] rounded ${
              page === "create-post" &&
              "dark:text-white text-black dark:border-white border-black"
            } dark:hover:text-white hover:text-black cursor-pointer dark:hover:border-white hover:border-black border-[#787878] text-[9px] py-1 px-[6.5px]`}
          />
          <Modal isOpen={isOpen} size="md" onOpenChange={onOpenChange}>
            <ModalContent>
              {() => (
                <>
                  <ModalHeader className="flex flex-col gap-1 text-center border-1">
                    Create new post
                  </ModalHeader>
                  <ModalBody className="!p-0 border-1 w-full h-full">
                    <div className="text-center p-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-center">
                      <div
                        onClick={() => navigate("/create-post/image")}
                        className="border rounded-md p-5 flex flex-col items-center hover:bg-[#888484] cursor-pointer"
                      >
                        <Image className="w-10 h-10 mb-2" />
                        <span className="text-base font-semibold">Image</span>
                      </div>
                      <div
                        onClick={() => navigate("/create-post/video")}
                        className="border rounded-md p-5 flex flex-col items-center hover:bg-[#888484] cursor-pointer"
                      >
                        <VideoIcon className="w-10 h-10 mb-2" />
                        <span className="text-base font-semibold">Video</span>
                      </div>
                    </div>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Create
          </div>
        </div>
        <div className="relative group flex items-center justify-center">
          <img
            src={currentUser?.profilePicture}
            alt="avatar"
            className={`w-[27px] h-[27px] rounded-full transition-all ${
              page === "profile" && "border-2 dark:border-white border-black"
            } hover:border-2 dark:hover:border-white hover:border-black object-cover cursor-pointer`}
            onClick={() => navigate("/profile")}
          />
          <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Profile
          </div>
        </div>
        <Menubar className="cursor-pointer p-0">
          <MenubarMenu>
            <MenubarTrigger className="p-[10px]">
              <FontAwesomeIcon
                icon={faBars}
                className="dark:hover:text-white hover:text-black cursor-pointer dark:text-white text-black text-lg"
              />
            </MenubarTrigger>
            <MenubarContent>
              <div
                className="cursor-pointer p-[6px] hover:bg-[#27272a] hover rounded text-sm px-2 flex items-center"
                onClick={() => navigate("/edit-profile")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </div>
              <MenubarSeparator />
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
                      className={`bg-[#09090b] transition-colors w-24 text-white border ${
                        loading
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
