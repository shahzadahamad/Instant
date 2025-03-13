import { useNavigate } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import apiClient from "@/apis/apiClient";
import { GetUserDataPostDetials } from "@/types/profile/profile";
import ProfilePostSection from "./ProfilePostSection";
import VerificationIcon from "../common/svg/VerificationIcon";
import FollowDetialsModal from "../common/FollowDetialsModal";

const ProfileDetials = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<GetUserDataPostDetials | null>(null);
  const [count, setCount] = useState(0);
  const [followDetials, setFollowDetials] = useState({ followings: 0, followers: 0 });
  const [openFollowDetialsModal, setOpenFollowDetialsModal] = useState(false);
  const [followAction, setFollowAction] = useState("");

  const fetchUserData = async () => {
    const res = await apiClient.get(`/user/get-user-data`);
    setUserData({ ...res.data });
    const res1 = await apiClient.get("/user/post/post-count");
    setCount(res1.data.postCount);
    setFollowDetials({ followings: res1.data.followings, followers: res1.data.followers })
  };
  useLayoutEffect(() => {
    fetchUserData();
  }, []);

  const handleCloseModal = () => {
    setOpenFollowDetialsModal(false)
  }

  return (
    <>
      {
        openFollowDetialsModal && (
          <FollowDetialsModal action={followAction} handleCloseModal={handleCloseModal} userId={""} />
        )
      }
      <div className="flex flex-col h-1/2 border-b border-[#363636]">
        <div className="flex items-center gap-8 pt-10 pb-8 px-28">
          <img
            src={
              userData?.profilePicture
                ? typeof userData.profilePicture === "string"
                  ? userData.profilePicture
                  : URL.createObjectURL(userData.profilePicture)
                : ""
            }
            alt="avatar"
            className="w-28 h-28 rounded-full object-cover"
          />
          <div className="flex flex-col gap-3 ">
            <div className="flex gap-5">
              <h1 className="text-3xl font-extrabold">{userData?.username}</h1>
              <button
                onClick={() => navigate("/edit-profile")}
                className="cursor-pointer font-bold bg-transparent border text-sm px-3 py-1.5 rounded-md dark:hover:bg-[#191919] hover:bg-[#f0f0f0] transition-colors text-center"
              >
                Edit Profile
              </button>
            </div>
            <div className="flex gap-5 cursor-pointer">
              <p>{count} posts</p>
              <p onClick={() => {
                setFollowAction('Followers');
                setOpenFollowDetialsModal(true)
              }}>{followDetials.followers} followers</p>
              <p onClick={() => {
                setFollowAction('Following');
                setOpenFollowDetialsModal(true)
              }}>{followDetials.followings} following</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 ps-[115px]">
          <div className={`flex items-center ${userData?.isVerified.status ? "gap-2" : "gap-4"}`}>
            <h1 className="font-bold">{userData?.fullname}</h1>
            {
              userData?.isVerified.status ?
                <VerificationIcon size={'20'} /> : <div onClick={() => navigate('/verification')} className="flex gap-2 items-center border px-3 py-1 rounded-2xl cursor-pointer">
                  <VerificationIcon size={"18"} />
                  <h1 className="font-bold text-sm">Get verified</h1>
                </div>
            }
          </div>
          <p
            dangerouslySetInnerHTML={{
              __html: (userData?.bio ?? "").replace(/\n/g, "<br />"),
            }}
          />
        </div>
      </div>
      <ProfilePostSection fetchPostDetialData={fetchUserData} />
    </>
  );
};

export default ProfileDetials;
