import { deletePost, getCurrentUser } from "@/apis/api/userApi";
import { PostActionModalProps } from "@/types/profile/profile";
import { Modal, ModalContent, ModalBody, ModalHeader } from "@nextui-org/modal";
import { useLayoutEffect, useState } from "react";
import PostShareModal from "./PostShareModal";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

const PostModalActions: React.FC<PostActionModalProps> = ({
  openActionModal,
  handleModalOpenAndClose,
  postUserId,
  postId,
  handleDeletePostData,
}) => {
  const [currentUser, setCurrentUser] = useState("");
  const navigate = useNavigate();
  const [openShareModal, setOpenShareModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    const currentUser = async () => {
      const response = await getCurrentUser();
      setCurrentUser(response);
    };
    currentUser();
    return () => {};
  }, []);

  const handleShareModalOpenAndClose = (status: boolean) => {
    setOpenShareModal(status);
    handleModalOpenAndClose(!openActionModal);
  };

  const handleDeletePost = async () => {
    try {
      setLoading(true);
      const res = await deletePost(postId);
      setTimeout(() => {
        setOpenShareModal(false);
        setOpenDeleteModal(false);
        handleModalOpenAndClose(false);
        handleDeletePostData();
        navigate("/profile");
        toast.success(res);
        setLoading(false);
      }, 1000);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.log(error);
        const errorMsg = error.response.data?.error || "An error occurred";
        toast.error(errorMsg);
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
      setLoading(false);
    }
  };

  return (
    <>
      {openShareModal && (
        <PostShareModal
          openShareModal={openShareModal}
          handleShareModalOpenAndClose={handleShareModalOpenAndClose}
        />
      )}
      <Modal
        isOpen={openActionModal}
        size="lg"
        className="preventbutton"
        onOpenChange={() => handleModalOpenAndClose(!openActionModal)}
        hideCloseButton={true}
      >
        <ModalContent>
          {currentUser === postUserId ? (
            <ModalBody className="w-full p-0 flex flex-col gap-0">
              <div
                onClick={() => setOpenDeleteModal(true)}
                className="w-full text-center border-b p-3 cursor-pointer"
              >
                <h1 className="text-[#ed4956] font-bold">Delete</h1>
              </div>
              <div className="w-full text-center border-b p-3 cursor-pointer">
                <h1>Edit</h1>
              </div>
              <div
                onClick={() => {
                  setOpenShareModal(true);
                }}
                className="w-full text-center border-b p-3 cursor-pointer"
              >
                <h1>Share to...</h1>
              </div>
              <div
                onClick={async () => {
                  await navigator.clipboard.writeText(window.location.href);
                  handleModalOpenAndClose(!openActionModal);
                  toast.success("Link copied to clipboard.");
                }}
                className="w-full text-center border-b p-3 cursor-pointer"
              >
                <h1>Copy link</h1>
              </div>
              <div
                onClick={() => handleModalOpenAndClose(!openActionModal)}
                className="w-full text-center p-3 cursor-pointer"
              >
                <h1>Cancel</h1>
              </div>
            </ModalBody>
          ) : (
            <ModalBody className="w-full p-0 flex flex-col gap-0">
              <div className="w-full text-center border-b p-3 cursor-pointer">
                <h1 className="text-[#ed4956] font-bold">Unfollow</h1>
              </div>
              <div className="w-full text-center border-b p-3 cursor-pointer">
                <h1 className="text-[#ed4956] font-bold">Report</h1>
              </div>
              <div
                onClick={() => handleModalOpenAndClose(!openActionModal)}
                className="w-full text-center border-b p-3 cursor-pointer"
              >
                <h1>Share to...</h1>
              </div>
              <div
                onClick={async () => {
                  await navigator.clipboard.writeText(window.location.href);
                  handleModalOpenAndClose(!openActionModal);
                  toast.success("Link copied to clipboard!");
                }}
                className="w-full text-center border-b p-3 cursor-pointer"
              >
                <h1>Copy link</h1>
              </div>
              <div
                onClick={() => handleModalOpenAndClose(!openActionModal)}
                className="w-full text-center p-3 cursor-pointer"
              >
                <h1>Cancel</h1>
              </div>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
      {openDeleteModal && (
        <Modal
          isOpen={openDeleteModal}
          size="sm"
          className="relative flex items-center preventbutton justify-center"
          onOpenChange={() => {
            setOpenDeleteModal(false);
            handleModalOpenAndClose(!openActionModal);
          }}
          hideCloseButton={true}
        >
          <ModalContent>
            <ModalHeader>
              <div className="w-full flex flex-col gap-4 justify-between items-center">
                <h1 className="text-2xl font-semibold">Delete post?</h1>
                <p className="text-sm text-[#87929a] font-normal">
                  Are you sure you want to delete this post?
                </p>
              </div>
            </ModalHeader>
            <ModalBody className="w-full p-0 flex flex-col border-t gap-0">
              <div
                onClick={handleDeletePost}
                className="w-full text-start p-3 border-t border-b cursor-pointer"
              >
                <h1
                  className={`${
                    !loading ? "text-[#ed4956] font-bold" : ""
                  }  text-center`}
                >
                  {loading ? <div className="spinner"></div> : "Delete"}
                </h1>
              </div>
              <div
                onClick={() => {
                  setOpenDeleteModal(false);
                  handleModalOpenAndClose(!openActionModal);
                }}
                className="w-full text-start p-3 border-t border-b cursor-pointer"
              >
                <h1 className="text-center">Cancel</h1>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default PostModalActions;
