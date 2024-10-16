import { GetComments, PostModalProps } from "@/types/profile/profile";
import {
  faComment,
  faHeart as faHeartRegular,
  faPaperPlane,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import {
  faArrowLeft,
  faArrowRight,
  faEllipsis,
  faHeart,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import apiClient from "@/apis/apiClient";
import {
  GetCreatePostUserData,
  GetSelectMusicData,
} from "@/types/create-post/create-post";
import toast from "react-hot-toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";
import { useNavigate } from "react-router-dom";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import {
  checkHasUserLikedThePost,
  commentPost,
  getComments,
  likeAndDisLikePost,
} from "../../../apis/api/userApi";
import PostModalActions from "./PostModalActions";
import { AxiosError } from "axios";

const PostModal: React.FC<PostModalProps> = ({ post, imageIndex, close }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(imageIndex);
  const [taggedUser, setTaggedUser] = useState<GetCreatePostUserData[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [music, setMusic] = useState<GetSelectMusicData | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [openActionModal, setOpenActionModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<GetComments[]>([]);

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      modalRef.current &&
      !modalRef.current.contains(event.target as Node) &&
      !(event.target as HTMLElement).closest(".preventbutton")
    ) {
      close();
    } else if (
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

  const fetchComments = async () => {
    try {
      const res = await getComments(post[currentIndex]._id);
      setComments(res);
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

  useLayoutEffect(() => {
    const fetchMusic = async (id: string) => {
      const response = await apiClient.get(
        `/user/music/get-selected-music-data/${id}`
      );
      setMusic(response.data);
    };
    if (post[currentIndex].musicId) {
      fetchMusic(post[currentIndex].musicId);
    }
    fetchComments();
    return () => {};
  }, [post, currentIndex]);

  useLayoutEffect(() => {
    const checkHasuserLikedCurrentPost = async (id: string) => {
      const response = await checkHasUserLikedThePost(id);
      setIsLiked(response);
    };
    checkHasuserLikedCurrentPost(post[currentIndex]._id);
    return () => {};
  }, [post, currentIndex]);

  const handleEmojiClick = (emoji: string) => {
    setComment((prev) => prev + emoji);
  };

  const handleNextIndex = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (post && post[currentIndex].post.length > 0) {
      const newIndex = (index + 1) % post[currentIndex].post.length;
      window.history.pushState(
        null,
        "",
        `/post/${post[currentIndex]._id}/?img_index=${newIndex}`
      );
      setIndex(newIndex);
    }
  };

  const handlePreviousIndex = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (post && post[currentIndex].post.length > 0) {
      const newIndex =
        (index - 1 + post[currentIndex].post.length) %
        post[currentIndex].post.length;
      window.history.pushState(
        null,
        "",
        `/post/${post[currentIndex]._id}/?img_index=${newIndex}`
      );
      setIndex(newIndex);
    }
  };

  const handleNextImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIndex(0);
    setIsPlaying(true);
    if (post && post.length > 0) {
      const newIndex = (currentIndex + 1) % post.length;
      if (post[newIndex].post.length > 1) {
        window.history.pushState(
          null,
          "",
          `/post/${post[newIndex]._id}/?img_index=0`
        );
      } else {
        window.history.pushState(null, "", `/post/${post[newIndex]._id}`);
      }
      setCurrentIndex(newIndex);
    }
  };

  const handlePreviousImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIndex(0);
    setIsPlaying(true);
    if (post && post.length > 0) {
      const newIndex = (currentIndex - 1 + post.length) % post.length;
      if (post[newIndex].post.length > 1) {
        window.history.pushState(
          null,
          "",
          `/post/${post[newIndex]._id}/?img_index=0`
        );
      } else {
        window.history.pushState(null, "", `/post/${post[newIndex]._id}`);
      }
      setCurrentIndex(newIndex);
    }
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };

  const fetchTagUser = async () => {
    try {
      const response = await apiClient.get(`/user/get-tagged-user-data`, {
        params: { taggedUsers: post[currentIndex].post[index].tagUsers },
      });
      setTaggedUser(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleTagUserClick = async () => {
    if (post[currentIndex].post[index].tagUsers.length > 0) {
      fetchTagUser();
      onOpen();
    } else {
      toast.error("No user tagged yet.");
    }
  };

  function timeSince(date: Date) {
    const now = new Date().getTime();
    const past = new Date(date).getTime();

    if (isNaN(past)) {
      throw new Error("Invalid date provided");
    }

    const seconds = Math.floor((now - past) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""}`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""}`;
    } else if (weeks > 0) {
      return `${weeks} week${weeks > 1 ? "s" : ""}`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    } else if (minutes > 0) {
      return `${minutes} min`;
    } else if (seconds < 10) {
      return "Now";
    } else {
      return `${seconds} sec`;
    }
  }

  const handleAudioControl = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLikeAndUnlikePost = async () => {
    if (isLiked) {
      await likeAndDisLikePost(post[currentIndex]._id, "dislike");
      setIsLiked(false);
      post[currentIndex].likeCount--;
    } else {
      await likeAndDisLikePost(post[currentIndex]._id, "like");
      setIsLiked(true);
      post[currentIndex].likeCount++;
    }
  };

  const handleDeletePostData = () => {
    close();
  };

  const handleModalOpenAndClose = (status: boolean) => {
    setOpenActionModal(status);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (comment.trim()) {
        setLoading(true);
        setTimeout(async () => {
          const res = await commentPost(post[currentIndex]._id, comment);
          const newComment = [res, ...comments];
          setComments(newComment);
          setComment("");
          setLoading(false);
        }, 1000);
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
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div
        className="absolute top-2.5 right-4 text-2xl cursor-pointer"
        onClick={() => {
          close();
        }}
      >
        <FontAwesomeIcon icon={faXmark} />
      </div>
      {currentIndex < post.length - 1 && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
          <button
            onClick={handleNextImage}
            className="w-8 h-8 rounded-full preventbutton bg-white hover:bg-opacity-70 cursor-pointer transition-colors flex items-center justify-center"
          >
            <FontAwesomeIcon
              icon={faArrowRight}
              className="text-black text-[15px]"
            />
          </button>
        </div>
      )}
      {currentIndex > 0 && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <button
            onClick={handlePreviousImage}
            className="w-8 h-8 rounded-full bg-white preventbutton hover:bg-opacity-70 cursor-pointer transition-colors flex items-center justify-center"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="text-black text-[15px]"
            />
          </button>
        </div>
      )}

      {openActionModal && (
        <PostModalActions
          openActionModal={openActionModal}
          handleModalOpenAndClose={handleModalOpenAndClose}
          postUserId={post[currentIndex].userId._id}
          postId={post[currentIndex]._id}
          handleDeletePostData={handleDeletePostData}
        />
      )}

      <div
        ref={modalRef}
        className="relative flex w-[85vw] h-[90vh] border dark:bg-black bg-white"
      >
        <div className="relative w-full h-full">
          {post[currentIndex].post[index].type === "video" ? (
            <div
              className="w-full h-full border-r"
              style={{
                filter: `
                  contrast(${post[currentIndex].post[index].customFilter.contrast}%)
                  brightness(${post[currentIndex].post[index].customFilter.brightness}%)
                  saturate(${post[currentIndex].post[index].customFilter.saturation}%)
                  sepia(${post[currentIndex].post[index].customFilter.sepia}%)
                  grayscale(${post[currentIndex].post[index].customFilter.grayScale}%)
                `,
              }}
            >
              <video
                src={post[currentIndex].post[index].url}
                autoPlay
                controls
                className={`${post[currentIndex].post[index].filterClass} object-contain w-full h-full`}
              />
            </div>
          ) : (
            <div
              className="w-full h-full border-r"
              style={{
                filter: `
                    contrast(${post[currentIndex].post[index].customFilter.contrast}%)
                    brightness(${post[currentIndex].post[index].customFilter.brightness}%)
                    saturate(${post[currentIndex].post[index].customFilter.saturation}%)
                    sepia(${post[currentIndex].post[index].customFilter.sepia}%)
                    grayscale(${post[currentIndex].post[index].customFilter.grayScale}%)
                  `,
              }}
            >
              <img
                src={post[currentIndex].post[index].url}
                alt="Modal Content"
                className={`${post[currentIndex].post[index].filterClass} object-contain w-full h-full`}
              />
            </div>
          )}
          {index < post[currentIndex].post.length - 1 && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
              <button
                onClick={handleNextIndex}
                className="w-6 h-6 rounded-full bg-[#d9cdc2] hover:bg-opacity-60 cursor-pointer transition-colors flex items-center justify-center"
              >
                <ChevronRightIcon fontSize="medium" color="action" />
              </button>
            </div>
          )}
          {index > 0 && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              <button
                onClick={handlePreviousIndex}
                className="w-6 h-6 rounded-full bg-[#d9cdc2] hover:bg-opacity-60 cursor-pointer transition-colors flex items-center justify-center"
              >
                <ChevronLeftIcon fontSize="medium" color="action" />
              </button>
            </div>
          )}
          {post[currentIndex].post[index].tagUsers.length > 0 && (
            <Button
              onClick={handleTagUserClick}
              variant="outline"
              className="absolute bottom-2 border-none text-white z-10 hover:text-white left-2 w-8 h-8 rounded-full bg-black bg-opacity-50 hover:bg-black hover:bg-opacity-20 transition-colors flex items-center cursor-pointer justify-center"
            >
              <FontAwesomeIcon icon={faUser} />
            </Button>
          )}
          {post[currentIndex].musicId && music && (
            <>
              <audio
                ref={audioRef}
                id="audio"
                src={music.music}
                onEnded={() => setIsPlaying(!isPlaying)}
                autoPlay={isPlaying}
              ></audio>
              <Button
                onClick={handleAudioControl}
                variant="outline"
                className="absolute bottom-2 border-none text-white z-10 hover:text-white right-2 w-8 h-8 rounded-full bg-black bg-opacity-50 hover:bg-black hover:bg-opacity-20 transition-colors flex items-center cursor-pointer justify-center"
              >
                {isPlaying ? (
                  <VolumeUpIcon style={{ fontSize: "15px" }} />
                ) : (
                  <VolumeOffIcon style={{ fontSize: "15px" }} />
                )}
              </Button>
            </>
          )}
        </div>

        <div className="w-full h-full dark:bg-black bg-white">
          <div className="flex item-center justify-between p-3 border-b">
            <div className="flex gap-2">
              <div className="w-8 h-8">
                <img
                  src={
                    post[currentIndex].userId?.profilePicture
                      ? typeof post[currentIndex].userId.profilePicture ===
                        "string"
                        ? post[currentIndex].userId.profilePicture
                        : URL.createObjectURL(
                            post[currentIndex].userId.profilePicture
                          )
                      : ""
                  }
                  className="w-[27px] h-[27px] rounded-full object-cover"
                  alt=""
                />
              </div>
              <h1 className="text-sm font-semibold flex items-center">
                {post[currentIndex].userId.username}
              </h1>
            </div>
            <div
              className="flex cursor-pointer items-center"
              onClick={() => {
                setOpenActionModal(true);
              }}
            >
              <FontAwesomeIcon icon={faEllipsis} className="text-lg" />
            </div>
          </div>
          <div className="w-full h-[22rem] overflow-auto scrollbar-hidden dark:bg-black bg-white border-b">
            {comments.length > 0 || post[currentIndex].caption ? (
              <>
                {post[currentIndex].caption && (
                  <div className="w-full p-3 flex gap-2 items-center">
                    <div className="w-8 h-8">
                      <img
                        src={
                          post[currentIndex].userId?.profilePicture
                            ? typeof post[currentIndex].userId
                                .profilePicture === "string"
                              ? post[currentIndex].userId.profilePicture
                              : URL.createObjectURL(
                                  post[currentIndex].userId.profilePicture
                                )
                            : ""
                        }
                        className="w-[27px] h-[27px] rounded-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col">
                      <h1 className="text-sm font-semibold">
                        {post[currentIndex].userId.username}&nbsp;
                        <span className="font-normal">
                          {post[currentIndex].caption}
                        </span>
                      </h1>
                      <h1 className="text-xs text-[#8a8a8a]">
                        {timeSince(new Date(post[currentIndex].createdAt))}
                      </h1>
                    </div>
                  </div>
                )}
                {comments.map((item) => (
                  <div
                    key={item._id}
                    className="w-full p-3 flex justify-between items-center"
                  >
                    <div className="flex gap-2 items-center">
                      <div className="w-8 h-8">
                        <img
                          src={item.userId.profilePicture}
                          className="w-[27px] h-[27px] rounded-full object-cover"
                          alt=""
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex gap-2 text-sm">
                          <h1 className="font-semibold">
                            {item.userId.username}
                          </h1>
                          <h1 className="font-normal">{item.comment}</h1>
                        </div>
                        <div className="flex gap-2 text-[#8a8a8a]">
                          <h1 className="text-xs">
                            {timeSince(new Date(item.createdAt))}
                          </h1>
                          <h1 className="text-xs">23 like</h1>
                          <h1 className="text-xs">Reply</h1>
                        </div>
                      </div>
                    </div>
                    <FontAwesomeIcon
                      icon={faHeartRegular}
                      className="text-xs"
                    />
                  </div>
                ))}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">No comments yet.</h1>
                <p>Start the conversation.</p>
              </div>
            )}
          </div>

          <div className="w-full h-[4.8rem] flex items-center justify-between border-b dark:bg-black bg-white">
            <div className="p-3 flex flex-col gap-2">
              <div className="dark:text-white text-black flex gap-3 text-2xl">
                <FontAwesomeIcon
                  onClick={handleLikeAndUnlikePost}
                  className={`${
                    isLiked ? "text-[#ff3040]" : "text-white"
                  } hover:cursor-pointer`}
                  icon={isLiked ? faHeart : faHeartRegular}
                />
                <FontAwesomeIcon
                  className="hover:cursor-pointer"
                  icon={faComment}
                />
                <FontAwesomeIcon
                  className="hover:cursor-pointer"
                  icon={faPaperPlane}
                />
              </div>
              {post[currentIndex].likeCount > 0 ? (
                <div className="flex items-center transition-all">
                  {/* <div className="flex hover:cursor-pointer">
                    <div className="w-5 h-5 rounded-full overflow-hidden z-30 relative">
                      <img
                        src="/avatar.png"
                        alt="First person"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-5 h-5 rounded-full overflow-hidden z-20 relative -left-2">
                      <img
                        src="/avatar1.jpg"
                        alt="Second person"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-5 h-5 rounded-full overflow-hidden z-10 relative -left-4">
                      <img
                        src="/avatar.png"
                        alt="Third person"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div> */}
                  {/* <p className="text-xs">
                    Liked by {post[currentIndex].likeCount}{" "}
                    {post[currentIndex].likeCount <= 1 ? "user" : "users"}
                  </p> */}
                  <p className="text-xs">
                    {post[currentIndex].likeCount}{" "}
                    {post[currentIndex].likeCount <= 1 ? "like" : "likes"}
                  </p>
                </div>
              ) : (
                <div className="flex items-center transition-all">
                  <p className="text-xs">
                    Be the first to{" "}
                    <span
                      onClick={handleLikeAndUnlikePost}
                      className="hover:text-gray-500 cursor-pointer"
                    >
                      like this
                    </span>{" "}
                  </p>
                </div>
              )}
            </div>
            <span className="text-xs pr-3">
              {formatDate(new Date(post[currentIndex].createdAt))}
            </span>
          </div>
          <div className="flex items-center p-3 dark:bg-black bg-white h-[51px]">
            <div className="relative">
              <svg
                aria-label="Emoji"
                className="x1lliihq x1n2onr6 x5n08af cursor-pointer mr-3"
                fill="currentColor"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24"
                onClick={() => setOpen(!open)}
              >
                <title>Emoji</title>
                <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
              </svg>
              <div ref={emojiPickerRef} className="absolute bottom-[25px]">
                <EmojiPicker
                  open={open}
                  autoFocusSearch={false}
                  theme={Theme.DARK}
                  emojiStyle={EmojiStyle.GOOGLE}
                  onEmojiClick={(e) => handleEmojiClick(e.emoji)}
                />
              </div>
            </div>
            <form onSubmit={handleFormSubmit} className="w-full flex">
              <input
                type="text"
                placeholder="Add a comment..."
                className="bg-transparent w-full placeholder:text-[#8a8a8a] placeholder:font-semibold placeholder:text-[12px] focus:outline-none"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              {comment &&
                (loading ? (
                  <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full border-blue-500 border-t-transparent"></div>
                ) : (
                  <button
                    type="submit"
                    className="text-blue-500 font-bold ml-3"
                  >
                    Post
                  </button>
                ))}
            </form>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        size="lg"
        onOpenChange={onOpenChange}
        className="relative flex items-center preventbutton justify-center"
      >
        <ModalContent>
          <ModalHeader>
            <div className="w-full flex justify-between items-center">
              <h1 className="text-lg font-semibold">Tagged Users</h1>
            </div>
          </ModalHeader>
          <ModalBody className="w-full h-[70vh] overflow-y-auto flex flex-col border-t relative">
            {post[currentIndex].post[index].tagUsers.length > 0 ? (
              <div className="w-full">
                {taggedUser.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => navigate(`/user/${user.username}`)}
                    className="w-full rounded-md flex border justify-between items-center p-2 dark:hover:bg-gray-800 transition-colors hover:bg-gray-200 cursor-pointer mb-2"
                  >
                    <div className="flex gap-2">
                      <img
                        src={user.profilePicture}
                        alt="profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold">
                          {user.username}
                        </span>
                        <span className="text-[12px] dark:text-[#a3a09f] text-[#3c3532]">
                          {user.fullname}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <h1 className="text-center">No Tagged User.</h1>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PostModal;
