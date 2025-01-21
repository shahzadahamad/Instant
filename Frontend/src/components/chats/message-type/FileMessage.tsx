import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MessageProfile from "../MessageProfile";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import MessageMenu from "./MessageMenu";
import EmojiReaction from "./EmojiReaction";

const FileMessage = () => {
  return (
    <>
      <div className="relative flex group items-center gap-2 px-3 pb-7">
        <MessageProfile />
        <div className="w-48">
          <img
            src="/neymar.jpg"
            className="w-full cursor-pointer rounded-2xl object-contain"
            alt=""
          />
        </div>
        <EmojiReaction value={true} />
        <MessageMenu value={true} />
      </div>

      <div className="relative flex items-center group justify-end gap-3 px-3 pb-7">
        <MessageMenu value={false} />
        <div className="w-48">
          <img
            src="/neymar.jpg"
            className="w-full cursor-pointer rounded-2xl object-contain"
            alt=""
          />
        </div>
        <EmojiReaction value={false} />
      </div>

      <div className="relative flex items-center group gap-2 px-3 pb-7">
        <MessageProfile />
        <div className="relative w-48">
          <video
            src="/suisui.mp4"
            className="w-full cursor-pointer rounded-2xl object-contain"
          />
          <div className="absolute top-1 right-1 group-hover:opacity-60 transition-opacity text-white px-1">
            <FontAwesomeIcon icon={faPlay} />
          </div>
        </div>
        <EmojiReaction value={true} />
        <MessageMenu value={true} />
      </div>

      <div className="relative flex group items-center justify-end gap-3 px-3 pb-7">
        <MessageMenu value={false} />
        <div className="relative w-48">
          <video
            src="/suisui.mp4"
            className="w-full cursor-pointer rounded-2xl object-contain"
          />
          <div className="absolute top-1 right-1 group-hover:opacity-60 transition-opacity text-white px-1">
            <FontAwesomeIcon icon={faPlay} />
          </div>
        </div>
        <EmojiReaction value={false} />
      </div>
    </>
  );
};

export default FileMessage;
