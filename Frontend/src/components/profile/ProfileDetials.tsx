import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store/store";

const ProfileDetials = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <div className="flex flex-col h-1/2 border-b border-[#363636]">
      <div className="flex items-center gap-8 pt-10 pb-8 px-28">
        <img
          src={currentUser?.profilePicture}
          alt="avatar"
          className="w-28 h-28 rounded-full object-cover"
        />
        <div className="flex flex-col gap-3 ">
          <div className="flex gap-5">
            <h1 className="text-3xl font-extrabold">{currentUser?.username}</h1>
            <button
              onClick={() => navigate("/edit-profile")}
              className="cursor-pointer font-bold bg-transparent border text-sm p-2 rounded-md hover:bg-white hover:text-black transition-colors text-center"
            >
              Edit Profile
            </button>
          </div>
          <div className="flex gap-5 cursor-pointer">
            <p>4 posts</p>
            <p>392 followers</p>
            <p>401 following</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1 ps-[115px]">
        <h1 className="font-bold">{currentUser?.fullname}</h1>
        <p>&gt; Software Developer (MERN)</p>
      </div>
    </div>
  );
};

export default ProfileDetials;
