import { useLayoutEffect, useState } from "react";
import FriendSuggetion from "../common/FriendSuggetion";
import { AxiosError } from "axios";
import {
  acceptRequest,
  deleteRequest,
  followUser,
  getNotificationData,
} from "@/apis/api/userApi";
import toast from "react-hot-toast";
import { NotificationType } from "@/types/notification/notification";
import { timeSince } from "@/helperFuntions/dateFormat";
import { socket } from "@/socket/socket";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import UnfollowModal from "../common/UnfollowModal";
import FriendRequestModal from "./FriendRequestModal";
import { GetUserDataForPost } from "@/types/profile/profile";
import VerificationIcon from "../common/svg/VerificationIcon";
import { IPostWithUserData } from "@/types/create-post/create-post";
import PostModal from "../common/PostViewModal/PostModal";

const NotificationDetials = () => {
  const [groupedNotifications, setGroupedNotifications] = useState({
    today: [] as NotificationType[],
    yesterday: [] as NotificationType[],
    thisWeek: [] as NotificationType[],
    thisMonth: [] as NotificationType[],
  });
  const [request, setRequest] = useState<GetUserDataForPost[] | null>(null);
  const navigate = useNavigate();
  const [openUnfollowModal, setOpenUnfollowModal] = useState(false);
  const [openFriendRequestModal, setOpenFriendRequestModal] = useState(false);
  const [unfollowId, setUnFollowId] = useState<GetUserDataForPost | null>(null);
  const [selectedPost, setSelectedPost] = useState<IPostWithUserData | null>(null);

  const fetchNotificationData = async () => {
    try {
      const notificationData = await getNotificationData();

      const today = moment().startOf("day");
      const yesterday = moment().subtract(1, "days").startOf("day");
      const startOfWeek = moment().startOf("week");
      const startOfMonth = moment().startOf("month");

      const grouped = {
        today: [] as NotificationType[],
        yesterday: [] as NotificationType[],
        thisWeek: [] as NotificationType[],
        thisMonth: [] as NotificationType[],
      };

      notificationData.notification.forEach(
        (notification: NotificationType) => {
          const createdAt = moment(notification.createdAt);

          if (createdAt.isSameOrAfter(today)) {
            grouped.today.push(notification);
          } else if (createdAt.isSameOrAfter(yesterday)) {
            grouped.yesterday.push(notification);
          } else if (createdAt.isSameOrAfter(startOfWeek)) {
            grouped.thisWeek.push(notification);
          } else if (createdAt.isSameOrAfter(startOfMonth)) {
            grouped.thisMonth.push(notification);
          }
        }
      );

      setGroupedNotifications(grouped);
      setRequest(notificationData.friendRequest);
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

  useLayoutEffect(() => {
    fetchNotificationData();

    socket.on("newNotification", () => {
      fetchNotificationData();
    });

    socket.on("clearNotification", () => {
      fetchNotificationData();
    });

    return () => {
      socket.off("newNotification");
      socket.off("clearNotification");
    };
  }, []);

  const handleUnfollowModal = (status: boolean) => {
    if (status) {
      setOpenUnfollowModal(!openUnfollowModal);
      fetchNotificationData();
    } else {
      setOpenUnfollowModal(!openUnfollowModal);
    }
  };

  const handleFriendRequest = (status: boolean) => {
    if (status) {
      setOpenFriendRequestModal(!openFriendRequestModal);
    } else {
      fetchNotificationData();
    }
  };

  const handleFollow = async (username: string, type: string) => {
    try {
      if (type === "followBack") {
        await followUser(username);
      } else if (type === "acceptRequest") {
        await acceptRequest(username);
      } else if (type === "delete") {
        await deleteRequest(username);
      }
      fetchNotificationData();
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

  const closeModal = (status: boolean = false) => {
    setSelectedPost(null);
    if (status) {
      navigate(`/notification`);
    } else {
      navigate(`/notification`);
    }
  };

  const closeWhileTouchOutsideModal = () => {
    setSelectedPost(null);
    navigate(`/notification`);
  }

  const renderNotifications = (
    category: string,
    notifications: NotificationType[]
  ) => (
    <>
      {notifications.length > 0 && (
        <>
          <div className="w-full text-left font-semibold text-lg py-2">
            {category}
          </div>
          {(selectedPost) && (
            <PostModal
              post={[selectedPost]}
              imageIndex={0}
              close={closeModal}
              closeWhileTouchOutsideModal={closeWhileTouchOutsideModal}
            />
          )}
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="w-full rounded-lg flex items-center justify-between p-4 dark:hover:bg-[#191919] hover:bg-[#f0f0f0] transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <img
                  onClick={() =>
                    navigate(`/user/${notification.fromId.username}`)
                  }
                  src={
                    notification.fromId.profilePicture
                      ? typeof notification.fromId.profilePicture === "string"
                        ? notification.fromId.profilePicture
                        : URL.createObjectURL(
                          notification.fromId.profilePicture
                        )
                      : ""
                  }
                  className="w-12 h-12 rounded-full object-cover"
                />
                {openUnfollowModal && unfollowId && (
                  <UnfollowModal
                    openUnfollowModal={openUnfollowModal}
                    handleUnfollowModal={handleUnfollowModal}
                    userData={unfollowId}
                  />
                )}
                <div className="flex flex-col">
                  <div
                    onClick={() =>
                      navigate(`/user/${notification.fromId.username}`)
                    }
                    className="text-[15px] font-semibold max-w-[15rem] break-words"
                  >
                    <div className="flex gap-2 items-center">
                      {notification.fromId.username}{" "}
                      {
                        notification.fromId.isVerified.status && <VerificationIcon size={'18'} />
                      }
                    </div>
                    <span className="font-normal">
                      {notification.message}&nbsp;
                    </span>
                    <span className="font-thin">
                      {timeSince(notification.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              {notification.relation === "follow" &&
                (notification.type === "follow" ? (
                  <button
                    onClick={() =>
                      handleFollow(notification.fromId.username, "followBack")
                    }
                    className="cursor-pointer w-20 font-bold bg-[#0095f6] hover:bg-opacity-70 text-white border text-sm px-1 py-1.5 rounded-lg transition-colors text-center"
                  >
                    {notification.fromId.isPrivateAccount
                      ? "Request"
                      : "Follow"}
                  </button>
                ) : notification.type === "request" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleFollow(
                          notification.fromId.username,
                          "acceptRequest"
                        )
                      }
                      className="cursor-pointer w-20 font-bold bg-[#0095f6] hover:bg-opacity-70 text-white border text-sm px-1 py-1.5 rounded-lg transition-colors text-center"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() =>
                        handleFollow(notification.fromId.username, "delete")
                      }
                      className="cursor-pointer w-20 font-bold dark:bg-[#363636] bg-[#efefef] dark:hover:bg-opacity-70 hover:bg-opacity-70 border text-sm px-3 py-1.5 rounded-lg transition-colors text-center"
                    >
                      Delete
                    </button>
                  </div>
                ) : notification.type === "followed" ? (
                  <button
                    onClick={() => {
                      handleUnfollowModal(false)
                      setUnFollowId(notification.fromId)
                    }}
                    className="cursor-pointer font-bold dark:bg-[#363636] bg-[#efefef] dark:hover:bg-opacity-70 hover:bg-opacity-70 border text-sm px-3 py-1.5 rounded-lg transition-colors text-center"
                  >
                    Following
                  </button>
                ) : notification.type === "requested" ? (
                  <button
                    onClick={() => {
                      handleUnfollowModal(false)
                      setUnFollowId(notification.fromId)
                    }}
                    className="cursor-pointer font-bold dark:bg-[#363636] bg-[#efefef] dark:hover:bg-opacity-70 hover:bg-opacity-70 border text-sm px-3 py-1.5 rounded-lg transition-colors text-center"
                  >
                    Requested
                  </button>
                ) : (
                  ""
                ))}
              {notification.relation === "post" && (
                notification.postId.post[0].type === 'image' ?
                  <img
                    className="w-12 h-12 rounded-lg object-cover"
                    onClick={() => {
                      setSelectedPost(notification.postId)
                      window.history.pushState(
                        null,
                        "",
                        `/post/${notification.postId._id}`
                      );
                    }}
                    src={notification.postId.post[0].url}
                    alt=""
                  /> : <video
                    className="w-12 h-12 rounded-lg object-cover"
                    muted={true}
                    onClick={() => {
                      setSelectedPost(notification.postId)
                      window.history.pushState(
                        null,
                        "",
                        `/post/${notification.postId._id}`
                      );
                    }}
                    src={notification.postId.post[0].url}
                  />
              )}
            </div>
          ))}
        </>
      )}
    </>
  );

  return (
    <>
      <div className="w-full h-screen flex items-start justify-between">
        <div className="w-1/2 h-screen flex flex-col items-center">
          <div className="w-full flex h-[13%] items-center justify-center p-3 border-b">
            <h1 className="font-semibold text-xl">Notifications</h1>
          </div>

          <div className="w-4/5 h-[90%] flex flex-col py-4 items-center overflow-auto scrollbar-hidden">
            {request && request.length > 0 && (
              <>
                {openFriendRequestModal && (
                  <FriendRequestModal
                    openFriendRequestModal={openFriendRequestModal}
                    handleFriendRequest={handleFriendRequest}
                    friendRequest={request}
                  />
                )}
                <button
                  onClick={() => setOpenFriendRequestModal(true)}
                  className="text-end font-semibold text-blue-500 hover:opacity-70 transition-colors cursor-pointer self-end mr-4"
                >
                  Request ({request.length})
                </button>
              </>
            )}
            {groupedNotifications.today.length > 0 && (
              <>{renderNotifications("Today", groupedNotifications.today)}</>
            )}
            {groupedNotifications.yesterday.length > 0 && (
              <>
                {renderNotifications(
                  "Yesterday",
                  groupedNotifications.yesterday
                )}
              </>
            )}
            {groupedNotifications.thisWeek.length > 0 && (
              <>
                {renderNotifications(
                  "This Week",
                  groupedNotifications.thisWeek
                )}
              </>
            )}
            {groupedNotifications.thisMonth.length > 0 && (
              <>
                {renderNotifications(
                  "This Month",
                  groupedNotifications.thisMonth
                )}
              </>
            )}

            {groupedNotifications.today.length === 0 &&
              groupedNotifications.yesterday.length === 0 &&
              groupedNotifications.thisWeek.length === 0 &&
              groupedNotifications.thisMonth.length === 0 && (
                <div className="w-full h-[90%] text-2xl font-bold flex items-center justify-center text-center mt-4">
                  No Notifications Yet
                </div>
              )}
          </div>
        </div>
        <FriendSuggetion />
      </div>
    </>
  );
};

export default NotificationDetials;
