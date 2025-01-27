import { MessageData } from "@/types/chat/chat";
import MessageProfile from "../MessageProfile";
// import EmojiReaction from "./EmojiReaction";
// import MessageMenu from "./MessageMenu";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

const TextMessage: React.FC<{ message: MessageData }> = ({ message }) => {

  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <>
      {
        message.senderId._id === currentUser?._id ? (
          <div className="relative flex group items-center justify-end gap-3 px-3 pb-7">
            {/* <MessageMenu value={false} /> */}
            <div className="max-w-[70%] bg-[#0084ff] text-white break-words px-3 py-2 rounded-2xl">
              <h1>
                {message.message}
              </h1>
            </div>
            {/* <EmojiReaction value={false} /> */}
          </div>
        ) : (
          <div className="relative flex group items-center gap-2 px-3 pb-7">
            <MessageProfile user={message.senderId} />
            <div className="max-w-[70%] dark:bg-[#262626] break-words bg-[#efefef] px-3 py-2 rounded-2xl">
              <h1>
                {
                  message.message
                }
              </h1>
            </div>
            {/* <EmojiReaction value={true} /> */}
            {/* <MessageMenu value={true} /> */}
          </div>
        )
      }
    </>
  );
};

export default TextMessage;
