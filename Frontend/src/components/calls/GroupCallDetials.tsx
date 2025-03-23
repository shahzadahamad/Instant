/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useNavigate } from "react-router-dom";
import { socket } from "@/socket/socket";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { getSingleChatData } from "@/apis/api/userApi";
import { useDispatch } from "react-redux";
import { setGroupCall } from "@/redux/slice/chatSlice";

const GroupCallDetials = () => {
  const [showCall, setShowCall] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.user);

  const queryParams = new URLSearchParams(location.search);
  const isVideo = queryParams.get('isVideo') === 'true';
  const chatId = queryParams.get('chatId');
  const zpInstanceRef = useRef<ZegoUIKitPrebuilt | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchChatData = async (chatId: string) => {
    try {
      const chatData = await getSingleChatData(chatId);
      if (!chatData.members.includes(currentUser?._id.toString())) {
        navigate(`/error?message=Unauthorized.&statusCode=401&data=${null}`);
      }
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

  useEffect(() => {
    fetchChatData(chatId!);
  }, [chatId])


  useEffect(() => {
    const startGroupCall = async () => {
      const appID = Number(import.meta.env.VITE_ZEGO_CLOUD_APP_ID);
      const serverSecret = import.meta.env.VITE_ZEGO_CLOUD_SERVER_SECRET;

      if (!appID || !serverSecret) {
        console.error("ZEGOCLOUD_APP_ID or SERVER_SECRET is missing.");
        return;
      }

      const roomID = chatId;
      const userID = currentUser?._id.toString();
      const userName = currentUser?.username || "Guest";

      setShowCall(true);

      setTimeout(() => {
        const container = document.getElementById("zego-container");
        if (!container) {
          console.error("ZEGOCLOUD container not found in the DOM");
          return;
        }

        const token = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID!,
          userID!,
          userName
        );

        const zp = ZegoUIKitPrebuilt.create(token);
        zpInstanceRef.current = zp;

        zp.joinRoom({
          container,
          scenario: { mode: ZegoUIKitPrebuilt.GroupCall },
          showScreenSharingButton: isVideo,
          showLeaveRoomConfirmDialog: true,
          turnOnCameraWhenJoining: isVideo,
          turnOnMicrophoneWhenJoining: true,

          onJoinRoom: () => {
            socket.emit("callGroup", { chatId, isVideo });
          },

          onUserLeave: (users) => {
            console.log(users);
            if (users.length === 0) {
              socket.emit("endCallGroup", { chatId, isVideo });
            }
          },

          onLeaveRoom: () => {
            dispatch(setGroupCall({
              receivingCall: false,
              chatId: "",
              isVideo: false,
              isViewModal: false,
            }))
            navigate(-1);
          },
        });


        setTimeout(() => {
          const usernameInput = document.querySelector(
            'input[placeholder="Your name"]'
          ) as HTMLInputElement;
          if (usernameInput) {
            usernameInput.setAttribute("readonly", "true");
          }
        }, 1000);
      }, 500);
    };

    startGroupCall();

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      if (zpInstanceRef.current) {
        zpInstanceRef.current.destroy();
      }
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (zpInstanceRef.current) {
        zpInstanceRef.current.destroy();
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };

  }, [chatId, currentUser?._id, isVideo, currentUser?.username, navigate]);


  return (
    showCall && (
      <div
        id="zego-container"
        className="h-screen w-screen"
      ></div>
    )
  )
}

export default GroupCallDetials
