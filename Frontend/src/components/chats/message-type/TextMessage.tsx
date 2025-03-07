import { MessageData } from "@/types/chat/chat";
import MessageProfile from "../MessageProfile";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import MessageMenu from "./MessageMenu";

const TextMessage: React.FC<{ message: MessageData }> = ({ message }) => {

  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <>
      {
        message.senderId._id === currentUser?._id ? (
          <div className={`relative flex group items-center ${message.senderId._id === currentUser?._id ? "justify-end gap-3 px-3 pb-7" : "gap-2 px-3 pb-7"}`}>
            <MessageMenu data={{ messageId: message._id, date: message.createdAt }} value={false} />
            <div className="max-w-[70%] bg-[#0084ff] text-white break-words px-3 py-2 rounded-2xl">
              <h1>
                {message.message}
              </h1>
            </div>
          </div>
        ) : (
          <div className="relative flex group items-center gap-2 px-3 pb-7">
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
            <div className="max-w-[70%] dark:bg-[#262626] break-words bg-[#efefef] px-3 py-2 rounded-2xl">
              <h1>
                {
                  message.message
                }
              </h1>
            </div>
            {
              message.senderId._id !== currentUser?._id && (
                <MessageMenu data={{ messageId: message._id, date: message.createdAt }} value={message.senderId._id !== currentUser?._id} />
              )
            }
          </div>
        )
      }
    </>
  );
};

export default TextMessage;
