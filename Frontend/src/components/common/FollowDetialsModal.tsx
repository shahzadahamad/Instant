import { followUser, getFollowDetials, removeUser, unfollowUser } from "@/apis/api/userApi";
import { GetUserDataForPost } from "@/types/profile/profile";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import VerificationIcon from "./svg/VerificationIcon";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";

const FollowDetialsModal: React.FC<{ action: string, handleCloseModal: () => void, userId: string }> = ({ action, handleCloseModal, userId }) => {

  const navigate = useNavigate();
  const [data, setData] = useState<GetUserDataForPost[]>([]);
  const [isOtherUser, setIsOtherUser] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchFriendsData = async () => {
      try {
        if (userId) {
          setIsOtherUser(true);
        }
        const data = await getFollowDetials(userId);
        if (action === 'Following') {
          setData(data.followings);
        } else if (action === 'Followers') {
          setData(data.followers);
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
    fetchFriendsData();
  }, [action, userId])

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).id === "modal-background") {
      handleCloseModal();
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      await unfollowUser(userId);
      setData((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isFollowed: false, isRequest: false } : user
        )
      );
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error.response.data?.error || "An error occurred");
        toast.error(error.response.data?.error || "An error occurred");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  }

  const handleFollow = async (username: string, userId: string, isPrivate: boolean) => {
    try {
      await followUser(username);
      setData((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isFollowed: isPrivate ? false : true, isRequest: isPrivate } : user
        )
      );
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error.response.data?.error || "An error occurred");
        toast.error(error.response.data?.error || "An error occurred");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleFollow1 = async (username: string, userId: string) => {
    try {
      await followUser(username);
      setData((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isFollowed: true, isRequest: true } : user
        )
      );
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error.response.data?.error || "An error occurred");
        toast.error(error.response.data?.error || "An error occurred");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleRemoveFollowedUsers = async (userId: string) => {
    try {
      await removeUser(userId);
      setData((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isRemove: true } : user
        )
      );
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error.response.data?.error || "An error occurred");
        toast.error(error.response.data?.error || "An error occurred");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  }

  return (
    <div onClick={handleBackgroundClick} id='modal-background' className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="dark:bg-[#18181b] bg-[#ffffff] rounded-3xl shadow-lg w-1/3">
        <div className="flex items-center justify-center p-3 border-b">
          <h2 className="text-lg text-center font-semibold">{action}</h2>
        </div>
        <div className={`min-h-96 max-h-96 ${data.length <= 0 && 'flex items-center justify-center'} overflow-auto`}>
          {
            data.length > 0 ?
              data.map((item) => (
                <div
                  key={item._id}
                  className="w-full rounded-lg flex items-center justify-between px-4 py-2 dark:hover:bg-[#191919] hover:bg-[#f0f0f0] transition-colors"
                >
                  <div onClick={() => {
                    navigate(`/user/${item.username}`)
                    handleCloseModal()
                  }} className="flex items-center gap-3 cursor-pointer">
                    <img
                      src={item.profilePicture.toString()}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex justify-center flex-col">
                      <div className="flex items-center gap-1">
                        <span className="text-[14px] font-semibold">{item.username}</span>
                        {
                          !item.isVerified.status && (
                            <VerificationIcon size={'14'} />
                          )
                        }
                        {
                          action === 'Followers' && !isOtherUser && !item.isFollowed && !item.isRequest && (
                            <h1 onClick={(e) => {
                              e.stopPropagation()
                              handleFollow1(item.username, item._id);
                            }} className="text-xs text-[#0095f6]">{item.isPrivateAccount ? "Request" : "Follow"}</h1>
                          )
                        }
                      </div>
                      <span className="text-[12px] text-[#a9a6a4]">
                        {item.fullname}
                      </span>
                    </div>
                  </div>
                  {
                    currentUser?._id.toString() !== item._id.toString() && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (action === 'Following') {
                            if (item.isFollowed) {
                              handleUnfollow(item._id);
                            } else {
                              handleFollow(item.username, item._id, item.isPrivateAccount);
                            }
                          } else if (action === 'Followers') {
                            if (isOtherUser) {
                              if (item.isFollowed || item.isRequest) {
                                handleUnfollow(item._id);
                              } else {
                                handleFollow(item.username, item._id, item.isPrivateAccount);
                              }
                            } else {
                              handleRemoveFollowedUsers(item._id);
                            }
                          }
                        }}
                        disabled={item.isRemove}
                        className={`cursor-pointer w-20 font-bold ${item.isFollowed || (action === 'Followers' && !isOtherUser) || item.isRequest ? "dark:bg-[#363636] bg-[#efefef]" : "bg-[#0095f6]"} ${item.isRemove && "opacity-50 cursor-not-allowed"} hover:bg-opacity-70 border text-sm px-1 py-1.5 rounded-lg transition-colors text-center`}>
                        {action === "Following"
                          ? item.isFollowed
                            ? "Following"
                            : item.isRequest
                              ? "Requested" :
                              item.isPrivateAccount ?
                                "Request" : "Follow"
                          : isOtherUser
                            ? item.isFollowed
                              ? "Following"
                              : item.isRequest
                                ? "Requested" :
                                item.isPrivateAccount ?
                                  "Request" : "Follow"
                            : "Remove"}
                      </button>
                    )
                  }
                </div>
              )) : <div className="text-center">No {action} yet.</div>
          }
        </div>
      </div>
    </div>
  )
}

export default FollowDetialsModal
