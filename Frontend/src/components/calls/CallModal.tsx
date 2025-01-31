import { getUserDataById } from "@/apis/api/userApi";
import { changeViewModal, setCallerState } from "@/redux/slice/chatSlice";
import { RootState } from "@/redux/store/store";
import { socket } from "@/socket/socket";
import { userData } from "@/types/profile/profile";
import { AxiosError } from "axios";
import { Phone, X } from "lucide-react"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CallModal = () => {

  const { callerDetials } = useSelector((state: RootState) => state.chat);
  const [userData, setUserData] = useState<userData>();
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

  useEffect(() => {
    if (callerDetials.callerId) {
      fetchUserData(callerDetials.callerId);
    }
  }, [callerDetials.callerId]);

  const callDecline = () => {
    socket.emit("endCall", {
      userId: userData?._id,
      isVideo: callerDetials.isVideo
    })
    dispatch(setCallerState({ receivingCall: false, callerSocketId: "", callerSignal: null, callerId: "", isVideo: false, isViewModal: false }));
  }

  const closeModal = () => {
    dispatch(changeViewModal());
  };

  const callAccpect = () => {
    dispatch(changeViewModal())
    navigate(`/calls?isVideo=${callerDetials.isVideo}&userId=${callerDetials.callerId}`)
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
      onClick={closeModal} // Close modal when clicking outside
    >
      <div
        className="bg-gray-800 rounded-lg p-8 flex flex-col items-center gap-6 w-96 relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 p-2 rounded-full transition-colors"
          onClick={closeModal}
        >
          <X className="text-white w-6 h-6" />
        </button>

        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center">
          <img
            src={userData?.profilePicture}
            alt="Avatar"
            className="rounded-full w-full h-full object-cover"
          />
        </div>

        {/* Caller Name */}
        <div className="text-white text-xl font-medium">{userData?.fullname}</div>

        {/* Call Status */}
        <div className="text-gray-400 text-sm">Incoming {callerDetials.isVideo ? "video" : "audio"} call...</div>

        {/* Action Buttons */}
        <div className="flex gap-8 mt-2">
          <button
            onClick={callDecline}
            className="w-14 h-14 cursor-pointer bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="text-white w-8 h-8" />
          </button>

          <button
            onClick={callAccpect}
            className="w-14 h-14 bg-green-500 cursor-pointer rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
          >
            <Phone className="text-white w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CallModal
