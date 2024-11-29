import { acceptRequest, deleteRequest } from '@/apis/api/userApi';
import { FriendRequestModalProps } from '@/types/notification/notification';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

const FriendRequestModal: React.FC<FriendRequestModalProps> = ({ openFriendRequestModal, handleFriendRequest, friendRequest }) => {

  const handleFollow = async (username: string, type: string) => {
    try {
      if (type === 'acceptRequest') {
        await acceptRequest(username);
      } else if (type === 'delete') {
        await deleteRequest(username);
      }
      handleFriendRequest(false);
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

  return (
    <Modal
      isOpen={openFriendRequestModal}
      size="lg"
      onOpenChange={() => handleFriendRequest(true)}
      className="relative flex items-center justify-center preventbutton"
    >
      <ModalContent className="max-h-[70vh] w-full overflow-hidden rounded-lg">
        <ModalHeader>
          <div className="w-full flex justify-between items-center">
            <h1 className="text-lg font-semibold">Friend Request</h1>
          </div>
        </ModalHeader>
        <ModalBody className="w-full h-full overflow-y-auto border-t">
          <div className="w-full h-full">
            {friendRequest.map((user, index) => (
              <div
                key={user._id || index}
                className="w-full rounded-md flex border justify-between items-center p-3 dark:hover:bg-gray-800 transition-colors hover:bg-gray-200 cursor-pointer mb-2"
              >
                <div className="flex gap-2">
                  <img
                    src={
                      user.profilePicture
                        ? typeof user.profilePicture === "string"
                          ? user.profilePicture
                          : URL.createObjectURL(user.profilePicture)
                        : "/default-avatar.png"
                    }
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold">{user.username}</span>
                    <span className="text-[12px] dark:text-[#a3a09f] text-[#3c3532]">
                      {user.fullname}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleFollow(user.username, 'acceptRequest')}
                    className="cursor-pointer w-20 font-bold bg-[#0095f6] hover:bg-opacity-70 text-white border text-sm px-1 py-1.5 rounded-lg transition-colors text-center">
                    Confirm
                  </button>
                  <button onClick={() => handleFollow(user.username, 'delete')} className="cursor-pointer w-20 font-bold dark:bg-[#363636] bg-[#efefef] dark:hover:bg-opacity-70 hover:bg-opacity-70 border text-sm px-3 py-1.5 rounded-lg transition-colors text-center">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FriendRequestModal;
