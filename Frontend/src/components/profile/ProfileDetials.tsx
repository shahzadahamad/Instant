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
              <p>0 followers</p>
              <p>0 following</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 ps-[115px]">
          <div className="flex gap-4 items-center">
            <h1 className="font-bold">{userData?.fullname}</h1>
            <div onClick={() => navigate('/verification')} className="flex gap-2 items-center border px-3 py-1 rounded-2xl cursor-pointer">
              <svg viewBox="0 0 16 16" width="18" height="18" aria-label="Verified account" role="img" data-testid="icon-verified" fill="#2e9bf0">
                <g>
                  <path d="M14.87 8c-.014-.472-.157-.931-.417-1.326-.26-.395-.626-.711-1.056-.911.164-.444.198-.924.103-1.387-.096-.464-.32-.892-.646-1.236-.344-.326-.772-.55-1.236-.646-.464-.096-.943-.062-1.387.103-.2-.429-.515-.793-.91-1.05C8.933 1.157 8.472 1.015 8 1c-.472.015-.931.157-1.325.417-.395.257-.71.621-.911 1.05-.445-.165-.924-.198-1.389-.103-.465.096-.892.32-1.237.646-.326.344-.55.772-.645 1.236-.097.463-.06.943.105 1.387-.429.2-.792.516-1.052.91-.259.395-.404.854-.418 1.326.014.472.159.931.418 1.326.26.394.623.71 1.052.91-.164.444-.201.924-.105 1.387.095.465.319.892.645 1.237.345.325.772.548 1.237.645.465.096.944.061 1.389-.1.201.428.516.792.911 1.049.394.26.853.403 1.325.417.472-.014.932-.156 1.327-.417.394-.257.71-.621.91-1.049.443.176.926.217 1.394.12.466-.097.892-.327 1.23-.665.338-.338.568-.764.665-1.23s.055-.947-.12-1.394c.428-.2.792-.516 1.048-.91.257-.395.402-.854.417-1.326zM7.026 10.773L4.585 8.332l.947-.954 1.52 1.52 3.227-3.515 1.006.93z"></path>
                </g>
              </svg>
              <h1 className="font-bold text-sm">Get verified</h1>
            </div>
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
