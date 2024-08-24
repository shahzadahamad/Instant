import {
  faHeart,
  faPaperPlane,
  faComment,
  faSmile,
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
            <FontAwesomeIcon
              icon={faSmile}
              className="text-gray-400 cursor-pointer mr-3"
              onClick={() =>
                setOpen((prev) => ({
                  ...prev,
                  [postId]: !prev[postId],
                }))
              }
            />
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
