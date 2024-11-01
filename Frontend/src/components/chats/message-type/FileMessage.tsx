import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MessageProfile from "../MessageProfile";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import MessageMenu from "./MessageMenu";

const FileMessage = () => {
  return (
    <>
      <div className="flex group items-center gap-2 px-3 pb-7">
        <MessageProfile />
        <div className="w-[25%]">
          <img
            src="/neymar.jpg"
            className="w-full cursor-pointer rounded-2xl object-contain"
            alt=""
          />
        </div>
        <MessageMenu />
      </div>

      <div className="flex items-center group justify-end gap-3 px-3 pb-7">
        <MessageMenu />
        <div className="w-[25%]">
          <img
            src="/neymar.jpg"
            className="w-full cursor-pointer rounded-2xl object-contain"
            alt=""
          />
        </div>
      </div>

      <div className="flex items-center group gap-2 px-3 pb-7">
        <MessageProfile />
        <div className="relative w-[25%]">
          <video
            src="/suisui.mp4"
            className="w-full cursor-pointer rounded-2xl object-contain"
          />
          <div className="absolute top-1 right-1 group-hover:opacity-60 transition-opacity text-white px-1">
            <FontAwesomeIcon icon={faPlay} />
          </div>
        </div>
        <MessageMenu />
      </div>

      <div className="flex group items-center justify-end gap-3 px-3 pb-7">
        <MessageMenu />
        <div className="relative w-[25%]">
          <video
            src="/suisui.mp4"
            className="w-full cursor-pointer rounded-2xl object-contain"
          />
          <div className="absolute top-1 right-1 group-hover:opacity-60 transition-opacity text-white px-1">
            <FontAwesomeIcon icon={faPlay} />
          </div>
        </div>
      </div>
    </>
  );
};

export default FileMessage;
