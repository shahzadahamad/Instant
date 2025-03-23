/* eslint-disable react-hooks/exhaustive-deps */
import { getSingleChatData, getUserDataById } from "@/apis/api/userApi";
import { changeViewModal, changeViewModalGroup, setCallerState, setGroupCall } from "@/redux/slice/chatSlice";
import { RootState } from "@/redux/store/store";
import { socket } from "@/socket/socket";
import { ChatData } from "@/types/chat/chat";
import { userData } from "@/types/profile/profile";
import { AxiosError } from "axios";
import { Phone, Video, X } from "lucide-react"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CallModal: React.FC<{ isGroupCall: boolean }> = ({ isGroupCall }) => {

  const { callerDetials, groupCall } = useSelector((state: RootState) => state.chat);
  const [userData, setUserData] = useState<userData>();
  const [chatData, setChatData] = useState<ChatData>();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const fetchUserData = async (userId: string) => {
    try {
      const userData = await getUserDataById(userId);
      setUserData(userData);
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

  const fetchChatData = async (chatId: string) => {
    try {
      const chatData = await getSingleChatData(chatId);
      setChatData(chatData);
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
    if (isGroupCall) {
      if (groupCall.chatId) {
        fetchChatData(groupCall.chatId);
      }
    } else {
      if (callerDetials.callerId) {
        fetchUserData(callerDetials.callerId);
      }
    }
  }, [callerDetials.callerId]);

  const callDecline = () => {
    if (isGroupCall) {
      dispatch(setGroupCall({
        receivingCall: false,
        chatId: "",
        isVideo: false,
        isViewModal: false,
      }))
    } else {
      socket.emit("endCall", {
        userId: userData?._id,
        isVideo: callerDetials.isVideo
      })
      dispatch(setCallerState({ receivingCall: false, callerSocketId: "", callerSignal: null, callerId: "", isVideo: false, isViewModal: false }));
    }
  }

  const closeModal = () => {
    if (isGroupCall) {
      dispatch(changeViewModalGroup());
    } else {
      dispatch(changeViewModal());
    }
  };

  const callAccpect = () => {
    if (isGroupCall) {
      dispatch(changeViewModalGroup());
      navigate(`/group-calls?isVideo=${groupCall.isVideo}&chatId=${groupCall.chatId}`)
    } else {
      dispatch(changeViewModal())
      navigate(`/calls?isVideo=${callerDetials.isVideo}&userId=${callerDetials.callerId}`)
    }
  }

  return (
    <div
      className="flex bg-black/50 justify-center fixed inset-0 items-center"
      onClick={closeModal} // Close modal when clicking outside
    >
      <div
        className="flex flex-col bg-gray-800 p-8 rounded-lg w-96 gap-6 items-center relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close Button */}
        <button
          className="p-2 rounded-full absolute right-3 top-3 transition-colors"
          onClick={closeModal}
        >
          <X className="h-6 text-white w-6" />
        </button>

        {/* Avatar */}
        <div className="flex bg-blue-600 h-24 justify-center rounded-full w-24 items-center">
          <img
            src={isGroupCall ? chatData?.profilePicture : userData?.profilePicture}
            alt="Avatar"
            className="h-full rounded-full w-full object-cover"
          />
        </div>

        {/* Caller Name */}
        <div className="text-white text-xl font-medium">{isGroupCall ? chatData?.name : userData?.fullname}</div>

        {/* Call Status */}
        <div className="text-gray-400 text-sm">Incoming {isGroupCall ? groupCall.isVideo ? "video" : "audio" : callerDetials.isVideo ? "video" : "audio"} call...</div>

        {/* Action Buttons */}
        <div className="flex gap-8 mt-2">
          <button
            onClick={callDecline}
            className="flex bg-red-500 h-14 justify-center rounded-full w-14 cursor-pointer hover:bg-red-600 items-center transition-colors"
          >
            <X className="h-8 text-white w-8" />
          </button>

          <button
            onClick={callAccpect}
            className="flex bg-green-500 h-14 justify-center rounded-full w-14 cursor-pointer hover:bg-green-600 items-center transition-colors"
          >
            {
              (isGroupCall && groupCall.isVideo || callerDetials.isVideo) ?
                <Video className="h-8 text-white w-8" />
                :
                <Phone className="h-8 text-white w-8" />
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default CallModal
