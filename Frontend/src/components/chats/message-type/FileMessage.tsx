import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MessageProfile from "../MessageProfile";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import MessageMenu from "./MessageMenu";
import { MessageData } from "@/types/chat/chat";
import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import ViewFile from "@/components/common/ViewFile";
import { useState } from "react";

const FileMessage: React.FC<{ message: MessageData }> = ({ message }) => {

  const [openViewModal, setOpenViewModal] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.user);

  const handleCloseModal = () => {
    setOpenViewModal(false)
  }

  return (
    <>
      {
        openViewModal && (
          <ViewFile file={message.message} type={message.type} handleCloseModal={handleCloseModal} />
        )
      }
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
          {
            message.type === 'image' ? (
              <img
                onClick={() => setOpenViewModal(true)}
                src={message.message}
                className="w-full cursor-pointer rounded-2xl object-contain"
                alt=""
              />
            ) : (
              <div className="relative">
                <video
                  onClick={() => setOpenViewModal(true)}
                  src={message.message}
                  className="w-full cursor-pointer rounded-2xl object-contain"
                />
                <div className={`absolute top-1 right-1 group-hover:opacity-60 transition-opacity text-white px-1`}>
                  <FontAwesomeIcon icon={faPlay} />
                </div>
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
    </>
  );
};

export default FileMessage;
