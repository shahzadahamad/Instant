import { GetUserPostData, PostEditModalProps } from "@/types/profile/profile";
import { Modal, ModalContent, ModalBody, ModalHeader } from "@nextui-org/modal";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile } from "@fortawesome/free-regular-svg-icons";
import { Button } from "@/components/ui/button";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { editPostApi, getPostData } from "@/apis/api/userApi";
import { useNavigate } from "react-router-dom";

const PostEditModal: React.FC<PostEditModalProps> = ({
  openEditModal,
  handleEditModalOpenAndClose,
  postId,
  handleEditAndDelete,
}) => {
  const navigate = useNavigate();
  const [editPost, setEditPost] = useState<GetUserPostData | null>(null);
  const [caption, setCaption] = useState("");
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [hideLikeAndViewCount, setLikeAndHideViewCount] = useState(false);
  const [turnOffCounting, setTurnOffCounting] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useLayoutEffect(() => {
    const fetchEditPostData = async () => {
      try {
        const postData = await getPostData(postId);
        setEditPost(postData);
        setCaption(postData.caption);
        setTurnOffCounting(postData.hideComment);
        setLikeAndHideViewCount(postData.hideLikeAndView);
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
    };
    fetchEditPostData();
    return () => {};
  }, [postId]);

  const handleEmojiClick = (emoji: string) => {
    setCaption((prev) => prev + emoji);
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCaption(e.target.value);
  };

  const handleSharePost = async () => {
    setLoading(true);
    try {
      const formData = {
        caption: caption,
        hideLikeAndViewCount: String(hideLikeAndViewCount),
        turnOffCounting: String(turnOffCounting),
      };
      const res = await editPostApi(postId, formData);
      setTimeout(() => {
        handleEditAndDelete();
        navigate("/profile");
        toast.success(res);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("Error creating post");
      console.error("Error handling post share:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={openEditModal}
        size="3xl"
        className="relative flex items-center preventbutton justify-center"
        onOpenChange={() => handleEditModalOpenAndClose(!openEditModal)}
        hideCloseButton={true}
      >
        <ModalContent className="h-[78%]">
          <ModalHeader>
            <div className="w-full flex justify-between items-center">
              <h1 className="text-lg font-semibold">Edit Info</h1>
            </div>
          </ModalHeader>
          <ModalBody className="w-full p-0 flex flex-col item-center border-t gap-0">
            <div className="flex p-7 pt-5 pb-0 items-center w-full gap-3 justify-start">
              <div className="w-8 h-8">
                <img
                  src={editPost?.userId?.profilePicture.toString()}
                  className="w-full h-full object-cover rounded-full"
                  alt=""
                />
              </div>
              <h1 className="font-semibold">{editPost?.userId?.username}</h1>
            </div>
            <div className="flex p-3 items-center justify-start gap-3 py-2">
              <div className="w-1/2 p-3">
                <textarea
                  id="caption"
                  value={caption}
                  onChange={handleCaptionChange}
                  maxLength={2000}
                  placeholder="Write a caption"
                  className="p-2 w-full h-[19rem] border outline-none bg-transparent resize-none text-sm "
                />
                <div
                  ref={emojiPickerRef}
                  className={`absolute z-50 bottom-[2%] right-5 transition-all duration-300 ease-in-out ${
                    open ? "opacity-100 scale-100" : "opacity-0 scale-0"
                  }`}
                  style={{ transformOrigin: "bottom" }}
                >
                  <EmojiPicker
                    open={open}
                    autoFocusSearch={false}
                    onEmojiClick={(e) => handleEmojiClick(e.emoji)}
                    theme={Theme.DARK}
                    emojiStyle={EmojiStyle.GOOGLE}
                  />
                </div>
                <div className="flex items-center justify-between w-full">
                  <FontAwesomeIcon
                    icon={faSmile}
                    className="text-gray-500 cursor-pointer mr-3"
                    onClick={() => setOpen(!open)}
                  />
                  <span className="text-sm text-gray-500">
                    {caption.length}/2000
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start justify-between h-full w-1/2 p-3">
                <div className="w-full h-full flex justify-between">
                  <div className="w-full h-full transition-all duration-300 ease-in-out overflow-y-auto scrollbar-hidden">
                    <div className="flex flex-col gap-2 w-full h-full mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm ml-1">
                          Hide like and view counts on this post
                        </span>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={hideLikeAndViewCount}
                            onChange={() =>
                              setLikeAndHideViewCount(!hideLikeAndViewCount)
                            }
                          />
                          <div className="relative">
                            <div
                              className={`block w-12 h-7 bg-gray-300 rounded-full transition duration-300 ${
                                hideLikeAndViewCount
                                  ? "dark:bg-[#f8f9f9] bg-blue-500"
                                  : "dark:bg-[#323539] bg-[#e5e7eb]"
                              }`}
                            ></div>
                            <div
                              className={`dot absolute top-1/2 left-1 dark:bg-[#0f1419] bg-white w-5 h-5 rounded-full transition-transform duration-300 transform ${
                                hideLikeAndViewCount
                                  ? "translate-x-full -translate-y-1/2"
                                  : "-translate-y-1/2"
                              }`}
                            ></div>
                          </div>
                        </label>
                      </div>
                      <span className="text-[10px] text-[#929292] ml-1">
                        Only you will see the total number of likes and views on
                        this post. You can change this later by going to the ···
                        menu at the top of the post. To hide like counts on
                        other people's posts, go to your account settings.
                      </span>
                      <div className="flex justify-between items-center">
                        <span className="text-sm ml-1">
                          Turn off commenting
                        </span>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={turnOffCounting}
                            onChange={() =>
                              setTurnOffCounting(!turnOffCounting)
                            }
                          />
                          <div className="relative">
                            <div
                              className={`block w-12 h-7 bg-gray-300 rounded-full transition duration-300 ${
                                turnOffCounting
                                  ? "dark:bg-[#f8f9f9] bg-blue-500"
                                  : "dark:bg-[#323539] bg-[#e5e7eb]"
                              }`}
                            ></div>
                            <div
                              className={`dot absolute top-1/2 left-1 dark:bg-[#0f1419] bg-white w-5 h-5 rounded-full transition-transform duration-300 transform ${
                                turnOffCounting
                                  ? "translate-x-full -translate-y-1/2"
                                  : "-translate-y-1/2"
                              }`}
                            ></div>
                          </div>
                        </label>
                      </div>
                      <span className="text-[10px] text-[#929292] ml-1">
                        You can change this later by going to the ··· menu at
                        the top of your post.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-end pt-10">
                  <Button
                    variant="ghost"
                    className="border"
                    onClick={handleSharePost}
                    style={{
                      width: "6rem",
                      opacity: loading ? 0.6 : 1,
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                    disabled={loading}
                  >
                    {loading ? <div className="spinner"></div> : "Share Post"}
                  </Button>
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PostEditModal;
