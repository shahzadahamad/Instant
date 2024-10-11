import {
  faHeart,
  faPaperPlane,
  faComment,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { useState } from "react";
import { PostLowerSectionComponentProps } from "../../types/home/postLowerSection";

const PostLowerSection = ({ postId }: PostLowerSectionComponentProps) => {
  const [open, setOpen] = useState<{ [key: number]: boolean }>({});
  const [comment, setComment] = useState<{ [key: number]: string }>({});

  const handleEmojiClick = (emoji: string, postId: number) => {
    setComment((prev) => ({
      ...prev,
      [postId]: (prev[postId] || "") + emoji,
    }));
  };

  return (
    <div className="rounded flex flex-col py-4 gap-2">
      <div className="flex justify-between">
        <div className="text-white flex gap-3 text-2xl">
          <FontAwesomeIcon className="hover:cursor-pointer" icon={faHeart} />
          <FontAwesomeIcon className="hover:cursor-pointer" icon={faComment} />
          <FontAwesomeIcon
            className="hover:cursor-pointer"
            icon={faPaperPlane}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex hover:cursor-pointer">
            <div className="w-5 h-5 rounded-full overflow-hidden border border-black z-30 relative">
              <img
                src="./avatar.png"
                alt="First person"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-5 h-5 rounded-full overflow-hidden border border-black z-20 relative -left-2">
              <img
                src="./avatar1.jpg"
                alt="Second person"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-5 h-5 rounded-full overflow-hidden border border-black z-10 relative -left-4">
              <img
                src="./avatar.png"
                alt="Third person"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <p className="text-white text-[12px] font-bold">435 likes</p>
        </div>
      </div>
      <div>
        <h1 className="text-white font-bold text-[12px]">Neymar at santos</h1>
        <h1 className="text-[#3B3B3B] font-extrabold text-[12px]">
          View all 136 comments
        </h1>
        <div className="flex items-center border-b border-[#262626] py-3">
          <div className="relative">
            <svg
              aria-label="Emoji"
              className="x1lliihq x1n2onr6 x5n08af cursor-pointer mr-3"
              fill="currentColor"
              height="24"
              role="img"
              viewBox="0 0 24 24"
              width="24"
              onClick={() =>
                setOpen((prev) => ({
                  ...prev,
                  [postId]: !prev[postId],
                }))
              }
            >
              <title>Emoji</title>
              <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
            </svg>
            <div className="absolute bottom-[25px]">
              <EmojiPicker
                open={open[postId]}
                autoFocusSearch={false}
                theme={Theme.DARK}
                emojiStyle={EmojiStyle.GOOGLE}
                onEmojiClick={(e) => handleEmojiClick(e.emoji, postId)}
              />
            </div>
          </div>
          <input
            type="text"
            placeholder="Add a comment..."
            className="bg-transparent text-white w-full placeholder:text-[#3B3B3B] placeholder:font-extrabold placeholder:text-[12px] focus:outline-none"
            value={comment[postId]}
            onChange={(e) =>
              setComment((prev) => ({
                ...prev,
                [postId]: e.target.value,
              }))
            }
          />
          {comment[postId] && (
            <button className="text-blue-500 font-bold ml-3">Post</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostLowerSection;
