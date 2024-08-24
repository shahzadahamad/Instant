import {
  faHeart,
  faPaperPlane,
  faComment,
  faSmile,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";

const Posts = () => {
  const defaultArray = Array.from({ length: 5 }, (_, index) =>
    (index + 1).toString()
  );

  const [open, setOpen] = useState<{ [key: number]: boolean }>({});
  const [comment, setComment] = useState<{ [key: number]: string }>({});

  const handleEmojiClick = (emoji: string, index: number) => {
    setComment((prev) => ({
      ...prev,
      [index]: (prev[index] || "") + emoji,
    }));
  };

  return (
    <div className="w-[89vw] h-[80vh] overflow-auto scrollbar-hidden">
      <div className="flex flex-col items-center justify-start gap-4 p-4">
        {defaultArray.map((item, index) => (
          <div
            key={index}
            className="w-[500px] flex items-center flex-col justify-center rounded-xl-lg "
          >
            <div className="w-full">
              <div className="px-1 py-3 rounded flex gap-3 items-center">
                <div className="relative flex-shrink-0 w-[50px] h-[50px]">
                  <div className="p-[2.5px] bg-gradient-to-r from-[#b5347c] via-[#eb1c25] to-[#fdcd23] rounded-full relative">
                    <div className="w-full h-full rounded-full border-[1.5px] border-black overflow-hidden">
                      <img
                        src="./avatar.png"
                        alt="avatar"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-white font-bold">neymarjr</h2>
                  <p className="text-[#3B3B3B] font-bold text-[12px]">2 d</p>
                </div>
                <div className="ml-auto p-0">
                  <h1 className="text-white -mt-[20px] text-4xl leading-none">
                    ...
                  </h1>
                </div>
              </div>
              <div className="bg-blue-800 rounded border-[.9px] border-[#797777]">
                <img src="./post.jpg" alt="post" className="rounded" />
              </div>
              <div className="rounded flex flex-col py-4 gap-2">
                <div className="flex justify-between">
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
                    <p className="text-white text-[12px] font-bold">
                      435 likes
                    </p>
                  </div>
                </div>
                <div>
                  <h1 className="text-white font-bold text-[12px]">
                    Neymar at santos
                  </h1>
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
                            [index]: !prev[index],
                          }))
                        }
                      />
                      <div className="absolute bottom-[25px]">
                        <EmojiPicker
                          open={open[index]}
                          autoFocusSearch={false}
                          theme={Theme.DARK}
                          emojiStyle={EmojiStyle.GOOGLE}
                          onEmojiClick={(e) => handleEmojiClick(e.emoji, index)}
                        />
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="bg-transparent text-white w-full placeholder:text-[#3B3B3B] placeholder:font-extrabold placeholder:text-[12px] focus:outline-none"
                      value={comment[index]}
                      onChange={(e) => setComment((prev) => ({
                        ...prev,
                        [index]: e.target.value
                      }))}
                    />
                    {comment[index] && (
                      <button className="text-blue-500 font-bold ml-3">
                        Post
                      </button>
                    )}
                  </div>
                </div>
                <div></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
