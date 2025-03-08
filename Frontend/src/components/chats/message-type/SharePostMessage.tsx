import MessageProfile from "../MessageProfile";
import MessageMenu from "./MessageMenu";
import { MessageData } from "@/types/chat/chat";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import VerificationIcon from "@/components/common/svg/VerificationIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import Reel from "@/components/common/svg/Reel";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { IPostWithUserData } from "@/types/create-post/create-post";
import PostModal from "@/components/common/PostViewModal/PostModal";

const SharePostMessage: React.FC<{ message: MessageData }> = ({ message }) => {

  const { currentUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [selectedPost, setSelectedPost] = useState<IPostWithUserData | null>(null);

  const closeModal = (status: boolean = false) => {
    setSelectedPost(null);
    if (status) {
      navigate(`/chats/${chatId}`);
    } else {
      navigate(`/chats/${chatId}`);
    }
  };

  const closeWhileTouchOutsideModal = () => {
    setSelectedPost(null);
    navigate(`/chats/${chatId}`);
  }

  return (
    <div className={`relative flex group items-center ${message.senderId._id === currentUser?._id ? "justify-end gap-3 px-3 pb-7" : "gap-2 px-3 pb-7"}`}>
      {
        message.senderId._id !== currentUser?._id && (
          <MessageProfile user={message.senderId} />
        )
      }
      {
        message.senderId._id === currentUser?._id && (
          <MessageMenu data={{ messageId: message._id, date: message.createdAt }} value={message.senderId._id !== currentUser?._id} />
        )
      }
      {(selectedPost) && (
        <PostModal
          post={[selectedPost]}
          imageIndex={0}
          close={closeModal}
          closeWhileTouchOutsideModal={closeWhileTouchOutsideModal}
        />
      )}
      <div className="w-72 flex flex-col">
        <div className="flex items-center gap-2 rounded-t-2xl p-3 bg-[#262626]">
          <div className="w-8 cursor-pointer" onClick={() => navigate(`/user/${message.postId.userId.username}`)}>
            <img
              src={message.postId.userId.profilePicture.toString()}
              className="w-8 cursor-pointer rounded-full object-cover"
              alt=""
            />
          </div>
          <div onClick={() => navigate(`/user/${message.postId.userId.username}`)} className="flex items-center gap-1 ">
            <h1 className="text-sm break-words font-semibold cursor-pointer">{message.postId.userId.username}</h1>
            {
              message.postId.userId.isVerified.status && <VerificationIcon size={'16'} />
            }
          </div>
        </div>
        {
          message.postId.post[0].type === 'image' ? (

            <div onClick={() => {
              setSelectedPost(message.postId)
              window.history.pushState(
                null,
                "",
                `/post/${message.postId._id}`
              );
            }} className="w-full relative">
              <img
                src={message.postId.post[0].url}
                className={`w-full cursor-pointer object-contain ${!message.postId.caption && 'rounded-b-2xl'}`}
                alt=""
              />
              {
                message.postId.post.length > 1 && (
                  <div className="absolute top-1 right-1 transition-opacity text-white p-1">
                    <svg
                      aria-label="Carousel"
                      className="x1lliihq x1n2onr6 x9bdzbf"
                      fill="currentColor"
                      height="20"
                      role="img"
                      viewBox="0 0 48 48"
                      width="20"
                    >
                      <title>Carousel</title>
                      <path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1 1.1 2.4 1.8 4.1 1.8h13.4c5.7 0 10.3-4.6 10.3-10.3V18.5c0-1.6-.7-3.1-1.8-4.1-.5-.4-1.2 0-1.2.6z"></path>
                    </svg>
                  </div>
                )
              }
            </div>
          ) :
            <div onClick={() => {
              setSelectedPost(message.postId)
              window.history.pushState(
                null,
                "",
                `/post/${message.postId._id}`
              );
            }} className="w-full h-[20rem] relative">
              <video
                src={message.postId.post[0].url}
                className={`w-full h-[20rem] cursor-pointer object-cover ${!message.postId.caption && 'rounded-b-2xl'}`}
              />
              {
                message.postId.post[0].type === 'reel' ? (
                  <div className="absolute top-2 right-1 transition-opacity text-white px-1">
                    <Reel size={"17"} />
                  </div>
                ) :
                  <div className="absolute top-1 right-1 transition-opacity text-white px-1">
                    <FontAwesomeIcon icon={faPlay} />
                  </div>
              }
            </div>
        }
        {
          message.postId.caption && (
            <div className="rounded-b-2xl p-3 min-h-12 flex items-center bg-[#262626]">
              <h1 className=" text-xs font-semibold break-words">
                {
                  message.postId.caption
                }
              </h1>
            </div>
          )
        }
      </div>
      {
        message.senderId._id !== currentUser?._id && (
          <MessageMenu data={{ messageId: message._id, date: message.createdAt }} value={message.senderId._id !== currentUser?._id} />
        )
      }
    </div>
  );
};

export default SharePostMessage;
