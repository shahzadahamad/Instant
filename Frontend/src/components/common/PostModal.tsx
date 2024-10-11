import {
  faComment,
  faHeart,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import { faEllipsis, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { useState } from "react";

const PostModal = () => {
  const defaultArray = Array.from({ length: 30 }, (_, index) =>
    (index + 1).toString()
  );
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");

  const handleEmojiClick = (emoji: string) => {
    setComment((prev) => prev + emoji);
  };
  return (
    <div className="fixed inset-0 w-screen h-screen bg-black bg-opacity-70 flex justify-center items-center z-[1000]">
      <div className="absolute top-2.5 right-4 text-2xl cursor-pointer">
        <FontAwesomeIcon icon={faXmark} />
      </div>

      <div className="relative flex w-[85vw] h-[90vh] dark:bg-black bg-white">
        <div className="w-full h-full border-r">
          <img
            src="./ney.jpg"
            alt="Modal Content"
            className="object-contain w-full h-full"
          />
        </div>
        <div className="w-full h-full dark:bg-black bg-white">
          <div className="flex item-center justify-between p-3 border-b">
            <div className="flex gap-2">
              <div className="w-8 h-8">
                <img
                  src="./avatar.png"
                  className="rounded-full object-cover"
                  alt=""
                />
              </div>
              <h1 className="text-sm font-semibold flex items-center">
                neymarjr
              </h1>
            </div>
            <div className="flex cursor-pointer items-center">
              <FontAwesomeIcon icon={faEllipsis} className="text-lg" />
            </div>
          </div>
          <div className="w-full h-[22rem] overflow-auto scrollbar-hidden dark:bg-black bg-white border-b">
            <div className="w-full p-3 flex gap-4 items-center">
              <div className="w-8 h-8">
                <img
                  src="./avatar.png"
                  className="rounded-full object-cover"
                  alt=""
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-semibold">jiyad muhammed</h1>
                <h1 className="text-xs text-[#8a8a8a]">1 year</h1>
              </div>
            </div>
            {defaultArray.map((item) => (
              <div className="w-full p-3 flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <div className="w-8 h-8">
                    <img
                      src="./avatar.png"
                      className="rounded-full object-cover"
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col ">
                    <h1 className="text-sm font-semibold">jiyad muhammed</h1>
                    <div className="flex gap-2 text-[#8a8a8a]">
                      <h1 className="text-xs">1 year</h1>
                      <h1 className="text-xs">23 like</h1>
                      <h1 className="text-xs">Reply</h1>
                    </div>
                  </div>
                </div>
                <FontAwesomeIcon icon={faHeart} className="text-xs" />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-b dark:bg-black bg-white">
            <div className="p-3 flex flex-col gap-2">
              <div className="text-white flex gap-3 text-2xl">
                <FontAwesomeIcon
                  className="hover:cursor-pointer"
                  icon={faHeart}
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
              <div className="flex items-center">
                <div className="flex hover:cursor-pointer">
                  <div className="w-5 h-5 rounded-full overflow-hidden z-30 relative">
                    <img
                      src="./avatar.png"
                      alt="First person"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-5 h-5 rounded-full overflow-hidden z-20 relative -left-2">
                    <img
                      src="./avatar1.jpg"
                      alt="Second person"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-5 h-5 rounded-full overflow-hidden z-10 relative -left-4">
                    <img
                      src="./avatar.png"
                      alt="Third person"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <p className="text-xs">Liked by _jasill and others</p>
              </div>
            </div>
            <span className="text-xs pr-3">11 September 2023</span>
          </div>
          <div className="flex items-center p-3 dark:bg-black bg-white h-[52px]">
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
              <div className="absolute bottom-[25px]">
                <EmojiPicker
                  open={open}
                  autoFocusSearch={false}
                  theme={Theme.DARK}
                  emojiStyle={EmojiStyle.GOOGLE}
                  onEmojiClick={(e) => handleEmojiClick(e.emoji)}
                />
              </div>
            </div>
            <input
              type="text"
              placeholder="Add a comment..."
              className="bg-transparent w-full placeholder:text-[#8a8a8a] placeholder:font-semibold placeholder:text-[12px] focus:outline-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            {comment && (
              <button className="text-blue-500 font-bold ml-3">Post</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
