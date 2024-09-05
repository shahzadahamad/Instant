import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faClapperboard,
  faHouse,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { LogOut, Moon, Settings } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <div className="w-[155px] h-full flex flex-col items-center border-r-[1px] border-[#333232]">
      <h1
        className="text-white font-bold text-3xl pt-6 mx-auto text-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        Instant
      </h1>
      <div className="flex flex-col items-center gap-8 mt-9 text-[#787878] text-3xl">
        <div className="relative group flex items-center justify-center">
          <FontAwesomeIcon
            icon={faHouse}
            onClick={() => navigate("/")}
            className="text-white hover:text-white cursor-pointer"
          />
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Home
          </div>
        </div>
        <div className="relative group flex items-center justify-center">
          <FontAwesomeIcon
            icon={faSearch}
            className="hover:text-white cursor-pointer"
          />
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Search
          </div>
        </div>
        <div className="relative group flex items-center justify-center">
          <FontAwesomeIcon
            icon={faClapperboard}
            className="hover:text-white cursor-pointer"
          />
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Reel
          </div>
        </div>
        <div className="relative group flex items-center justify-center">
          <FontAwesomeIcon
            icon={faComment}
            className="hover:text-white cursor-pointer"
          />
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Message
          </div>
        </div>
        <div className="relative group flex items-center justify-center">
          <FontAwesomeIcon
            icon={faHeart}
            className="hover:text-white cursor-pointer"
          />
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Notification
          </div>
        </div>
        <div className="relative group flex items-center justify-center">
          <FontAwesomeIcon
            icon={faPlus}
            className="border-[2.5px] rounded hover:text-white cursor-pointer hover:border-white border-[#787878] text-[15px] py-1 px-[6.5px]"
          />
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Create
          </div>
        </div>
        <div className="relative group flex items-center justify-center">
          <img
            src={currentUser?.profilePicture}
            alt="avatar"
            className="w-[35px] h-[35px] rounded-full object-cover cursor-pointer"
            onClick={() => navigate("/profile")}
          />
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Profile
          </div>
        </div>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>
              <FontAwesomeIcon
                icon={faBars}
                className="hover:text-white cursor-pointer"
              />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <Moon className="mr-2 h-4 w-4" />
                {/* <Sun className="mr-2 h-4 w-4" /> */}
                Dark mode
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  );
};

export default Sidebar;
