import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MessageProfile from "../MessageProfile";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import MessageMenu from "./MessageMenu";
import { MessageData } from "@/types/chat/chat";
import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";

const FileMessage: React.FC<{ message: MessageData }> = ({ message }) => {

  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <>
      {
        message.type === 'image' ? (
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
            <div className="w-48">
              <img
                src={message.message}
                className="w-full cursor-pointer rounded-2xl object-contain"
                alt=""
              />
            </div>
            {
              message.senderId._id !== currentUser?._id && (
                <MessageMenu data={{ messageId: message._id, date: message.createdAt }} value={message.senderId._id !== currentUser?._id} />
              )
            }
          </div>
        ) : (
          <div className={`relative flex items-center group ${message.senderId._id === currentUser?._id ? " justify-end gap-3 px-3 pb-7" : "gap-2 px-3 pb-7"}`}>
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
            <div className="relative w-48">
              <video
                src={message.message}
                className="w-full cursor-pointer rounded-2xl object-contain"
              />
              <div className="absolute top-1 right-1 group-hover:opacity-60 transition-opacity text-white px-1">
                <FontAwesomeIcon icon={faPlay} />
              </div>
            </div>
            {
              message.senderId._id !== currentUser?._id && (
                <MessageMenu data={{ messageId: message._id, date: message.createdAt }} value={message.senderId._id !== currentUser?._id} />
              )
            }
          </div >
        )
      }
    </>
  );
};

export default FileMessage;
