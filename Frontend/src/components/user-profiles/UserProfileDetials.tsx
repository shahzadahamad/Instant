import { createNewChat, followData, followUser, getUserProfileDates } from "@/apis/api/userApi";
import { GetUserDataPostDetials } from "@/types/profile/profile";
import { AxiosError } from "axios";
import { useLayoutEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ErrorPage from "../common/ErrorPage";
import UserProfilePostSection from "./UserProfilePostSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { setFollowDetials } from "@/redux/slice/userSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import UnfollowModal from "../common/UnfollowModal";

const UserProfileDetials = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState<GetUserDataPostDetials | null>(null);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { followDetials } = useSelector((state: RootState) => state.user);
  const [openUnfollowModal, setOpenUnfollowModal] = useState(false);

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

    const fetchFollowData = async () => {
      if (username) {
        const res = await followData(username);
        dispatch(setFollowDetials(res));
      }
    }

    fetchFollowData();
    return () => {
    };
  }, [username, dispatch])

  useLayoutEffect(() => {
    if (username) {
      fetchUserData(username);
    }
  }, [username]);

  const handleFollowUser = async () => {
    try {
      if (username) {
        const res = await followUser(username);
        dispatch(setFollowDetials(res));
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.log(error);
        const errorMsg = error.response.data?.error || "An error occurred";
        toast.error(errorMsg);
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  }


  const handleUnfollowModal = (status: boolean) => {
    if (status) {
      setOpenUnfollowModal(!openUnfollowModal);
    } else {
      setOpenUnfollowModal(!openUnfollowModal);
    }
  }

  const handleMessageBtn = async () => {
    try {
      if (userData) {
        const formData = new FormData();
        formData.append("userIds", JSON.stringify([userData._id]));
        const chatId = await createNewChat(formData);

        if (chatId) {
          navigate(`/chats/${chatId}`);
        }

      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.log(error);
        const errorMsg = error.response.data?.error || "An error occurred";
        toast.error(errorMsg);
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  }

  return (
    <>
      {userData ? (
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
              <div className="flex flex-col gap-3">
                <div className="flex gap-5">
                  <h1 className="text-3xl font-extrabold">
                    {userData.username}
                  </h1>
                  {
                    openUnfollowModal && (
                      <UnfollowModal openUnfollowModal={openUnfollowModal} handleUnfollowModal={handleUnfollowModal} userData={userData} />
                    )
                  }
                  <div className="flex gap-3">
                    {
                      followDetials?.follow ? (
                        <button onClick={() => handleUnfollowModal(false)} className="cursor-pointer w-28 font-bold dark:bg-[#363636] bg-[#efefef] dark:hover:bg-opacity-70 hover:bg-opacity-70 border text-sm px-3 py-1.5 rounded-lg transition-colors text-center">
                          Following
                        </button>
                      ) : followDetials?.request ? (
                        <button onClick={() => handleUnfollowModal(false)} className="cursor-pointer w-28 font-bold dark:bg-[#363636] bg-[#efefef] dark:hover:bg-opacity-70 hover:bg-opacity-70 border text-sm px-3 py-1.5 rounded-lg transition-colors text-center">
                          Requested
                        </button>
                      ) : (
                        <button onClick={handleFollowUser} className="cursor-pointer w-28 font-bold bg-[#0095f6] hover:bg-opacity-70 text-white border text-sm px-3 py-1.5 rounded-lg transition-colors text-center">
                          {userData.isPrivateAccount ? "Request" : "Follow"}
                        </button>
                      )
                    }
                    {
                      (followDetials?.follow || !userData.isPrivateAccount) && (
                        <button onClick={handleMessageBtn} className="cursor-pointer w-28 font-bold dark:bg-[#363636] bg-[#efefef] dark:hover:bg-opacity-70 hover:bg-opacity-70 border text-sm px-3 py-1.5 rounded-lg transition-colors text-center">
                          Message
                        </button>
                      )
                    }
                    <FontAwesomeIcon icon={faEllipsis} className="text-xl cursor-pointer self-center" />
                  </div>
                </div>
                <div className="flex gap-5 cursor-pointer">
                  <p>{count} posts</p>
                  <p>0 followers</p>
                  <p>0 following</p>
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
          <UserProfilePostSection isPrivate={userData.isPrivateAccount} />
        </>
      ) : (
        <ErrorPage />
      )
      }
    </>
  );
};

export default UserProfileDetials;
