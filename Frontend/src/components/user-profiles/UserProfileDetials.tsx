import { getUserProfileDates } from "@/apis/api/userApi";
import { GetUserDataPostDetials } from "@/types/profile/profile";
import { AxiosError } from "axios";
import { useLayoutEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const UserProfileDetials = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState<GetUserDataPostDetials | null>(null);
  const [count, setCount] = useState(0);

  const fetchUserData = async (username: string) => {
    try {
      const res = await getUserProfileDates(username);
      if (res.userData) {
        setUserData({ ...res.userData });
      } else {
        setUserData(null);
      }
      setCount(res.postCount);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.log(error);
        const errorMsg = error.response.data?.error || "An error occurred";
        console.error(errorMsg);
        toast.error("Page not found.");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  };
  useLayoutEffect(() => {
    if (username) {
      fetchUserData(username);
    }
  }, [username]);

  return (
    <>
      {userData ? (
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
                <h1 className="text-3xl font-extrabold">
                  {userData?.username}
                </h1>
                <button className="cursor-pointer w-28 font-bold bg-[#0095f6] text-white border text-sm p-2 rounded-md transition-colors text-center">
                  Follow
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
      ) : (
        // {/* <ProfilePostSection fetchPostDetialData={fetchUserData} /> */}
        <h1>sorry page not found</h1>
      )}
    </>
  );
};

export default UserProfileDetials;
