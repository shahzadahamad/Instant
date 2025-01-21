import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MessageProfile from "../MessageProfile";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import MessageMenu from "./MessageMenu";
import EmojiReaction from "./EmojiReaction";

const SharePostMessage = () => {
  return (
    <>
      <div className="relative flex items-center group gap-2 px-3 pb-7">
        <MessageProfile />
        <div className="w-72 flex flex-col">
          <div className="flex items-center gap-2 rounded-t-2xl p-3 bg-[#262626]">
            <div className="w-8">
              <img
                src="/avatar.png"
                className="w-8 cursor-pointer rounded-full object-cover"
                alt=""
              />
            </div>
            <h1 className="text-sm break-words font-semibold">Shahzad</h1>
          </div>
          <div className="w-full">
            <img
              src="/neymar.jpg"
              className="w-full cursor-pointer object-contain"
              alt=""
            />
          </div>
          <div className="rounded-b-2xl p-3 bg-[#262626]">
            <h1 className=" text-xs font-semibold break-words">
              Falcon 9 delivers 20 Starlink satellites to orbit from California
            </h1>
          </div>
        </div>
        <EmojiReaction value={true} />
        <MessageMenu value={true} />
      </div>

      <div className="relative flex group items-center justify-end gap-3 px-3 pb-7">
        <MessageMenu value={false} />
        <div className="w-72 flex flex-col">
          <div className="flex items-center gap-2 rounded-t-2xl p-3 bg-[#262626]">
            <div className="w-8">
              <img
                src="/avatar.png"
                className="w-8 cursor-pointer rounded-full object-cover"
                alt=""
              />
            </div>
            <h1 className="text-sm break-words font-semibold">Shahzad</h1>
          </div>
          <div className="w-full">
            <img
              src="/neymar.jpg"
              className="w-full cursor-pointer object-contain"
              alt=""
            />
          </div>
          <div className="rounded-b-2xl p-3 bg-[#262626]">
            <h1 className=" text-xs font-semibold break-words">
              Falcon 9 delivers 20 Starlink satellites to orbit from California
            </h1>
          </div>
        </div>
        <EmojiReaction value={false} />
      </div>

      <div className="relative flex group items-center gap-2 px-3 pb-7">
        <MessageProfile />
        <div className="w-72 flex flex-col">
          <div className="flex items-center gap-2 rounded-t-2xl p-3 bg-[#262626]">
            <div className="w-8">
              <img
                src="/avatar.png"
                className="w-8 cursor-pointer rounded-full object-cover"
                alt=""
              />
            </div>
            <h1 className="text-sm break-words font-semibold">Shahzad</h1>
          </div>
          <div className="w-full h-[20rem] relative">
            <video
              src="/suisui.mp4"
              className="w-full h-[20rem] cursor-pointer object-cover"
            />
            <div className="absolute top-1 right-1 group-hover:opacity-60 transition-opacity text-white px-1">
              <FontAwesomeIcon icon={faPlay} />
            </div>
          </div>
          <div className="rounded-b-2xl p-3 bg-[#262626]">
            <h1 className=" text-xs font-semibold break-words">
              Falcon 9 delivers 20 Starlink satellites to orbit from California
            </h1>
          </div>
        </div>
        <EmojiReaction value={true} />
        <MessageMenu value={true} />
      </div>

      <div className="relative flex group items-center justify-end gap-3 px-3 pb-7">
        <MessageMenu value={false} />
        <div className="w-72 flex flex-col">
          <div className="flex items-center gap-2 rounded-t-2xl p-3 bg-[#262626]">
            <div className="w-8">
              <img
                src="/avatar.png"
                className="w-8 cursor-pointer rounded-full object-cover"
                alt=""
              />
            </div>
            <h1 className="text-sm break-words font-semibold">Shahzad</h1>
          </div>
          <div className="w-full h-[20rem] relative">
            <video
              src="/suisui.mp4"
              className="w-full h-[20rem] cursor-pointer object-cover"
            />
            <div className="absolute top-1 right-1 group-hover:opacity-60 transition-opacity text-white px-1">
              <FontAwesomeIcon icon={faPlay} />
            </div>
          </div>
          <div className="rounded-b-2xl p-3 bg-[#262626]">
            <h1 className=" text-xs font-semibold break-words">
              Falcon 9 delivers 20 Starlink satellites to orbit from California
            </h1>
          </div>
        </div>
        <EmojiReaction value={false} />
      </div>
    </>
  );
};

export default SharePostMessage;
