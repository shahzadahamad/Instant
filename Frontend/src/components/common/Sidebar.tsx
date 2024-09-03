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
        <FontAwesomeIcon
          icon={faHouse}
          onClick={() => navigate("/")}
          className="text-white hover:text-white cursor-pointer"
        />
        <FontAwesomeIcon
          icon={faSearch}
          className="hover:text-white cursor-pointer"
        />
        <FontAwesomeIcon
          icon={faClapperboard}
          className="hover:text-white cursor-pointer"
        />
        <FontAwesomeIcon
          icon={faComment}
          className="hover:text-white cursor-pointer"
        />
        <FontAwesomeIcon
          icon={faHeart}
          className="hover:text-white cursor-pointer"
        />
        <FontAwesomeIcon
          icon={faPlus}
          className="border-[2.5px] rounded hover:text-white cursor-pointer hover:border-white border-[#787878] text-[15px] py-1 px-[6.5px]"
        />
        <img
          src={currentUser?.profilePicture}
          alt="image"
          className="w-[30px] rounded-full h-auto cursor-pointer"
          onClick={() => navigate("/profile")}
        />
        <FontAwesomeIcon
          icon={faBars}
          className="hover:text-white cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Sidebar;
