import { unfollowUser } from "@/apis/api/userApi";
import { setFollowDetials } from "@/redux/slice/userSlice";
import { UnfollowModalProps } from "@/types/notification/notification";
import { Modal, ModalContent, ModalBody } from "@nextui-org/modal";
import { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const UnfollowModal: React.FC<UnfollowModalProps> = ({
  openUnfollowModal,
  handleUnfollowModal,
  userData,
}) => {

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleUnfollow = async (userId: string) => {
    setLoading(true);
    try {
      await unfollowUser(userId);
      handleUnfollowModal(true);
      dispatch(setFollowDetials({ follow: false, request: false }));
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error.response.data?.error || "An error occurred");
        toast.error(error.response.data?.error || "An error occurred");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={openUnfollowModal}
      size="lg"
      className="relative flex items-center preventbutton justify-center"
      onOpenChange={() => handleUnfollowModal(!openUnfollowModal)}
      hideCloseButton={true}
    >
      <ModalContent>
        <ModalBody className="w-full p-0">
          <div className="w-full flex flex-col items-center justify-center">
            <div className="p-10 pb-12 flex flex-col gap-5">
              <img
                className="w-32 h-32 rounded-full object-cover"
                src={
                  userData.profilePicture
                    ? typeof userData.profilePicture === "string"
                      ? userData.profilePicture
                      : URL.createObjectURL(userData.profilePicture)
                    : ""
                }
                alt=""
              />
              <h1 className="text-center font-bold">{userData.username}</h1>
            </div>
            <div className="w-full flex flex-col bg-white5">
              <button onClick={() => handleUnfollow(userData._id)} className="p-4 border-b border-t font-bold text-[#ed4956] text-center">
                {loading ? <div className="spinner"></div> : "Unfollow"}
              </button>
              <button className="p-4" onClick={() => handleUnfollowModal(false)}>Cancel</button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UnfollowModal;
