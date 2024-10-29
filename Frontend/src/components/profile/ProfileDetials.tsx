import { useNavigate } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import apiClient from "@/apis/apiClient";
import { GetUserDataPostDetials } from "@/types/profile/profile";
import ProfilePostSection from "./ProfilePostSection";

const ProfileDetials = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<GetUserDataPostDetials | null>(null);
  const [count, setCount] = useState(0);

  const fetchUserData = async () => {
    const res = await apiClient.get(`/user/get-user-data`);
    setUserData({ ...res.data });
    const res1 = await apiClient.get("/user/post/post-count");
    setCount(res1.data);
  };
  useLayoutEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
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
              <p>{userData?.followers.length} followers</p>
              <p>{userData?.followings.length} following</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 ps-[115px]">
          <h1 className="font-bold">{userData?.fullname}</h1>
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
