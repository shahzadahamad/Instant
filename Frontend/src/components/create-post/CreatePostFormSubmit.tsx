import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile } from "@fortawesome/free-regular-svg-icons";
import React, { useEffect, useRef, useState } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

const CreatePostFormSubmit = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [hideLikeAndViewCount, setLikeAndHideViewCount] = useState(false);
  const [turnOffCounting, setTurnOffCounting] = useState(false);

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCaption(e.target.value);
  };

  const toggleAdvancedSettings = () => {
    setShowAdvancedSettings((prev) => !prev);
  };

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setCaption((prev) => prev + emojiData.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-start gap-3 py-2">
      <div className="flex items-center w-full gap-3 justify-start">
        <div className="w-8 h-8">
          <img
            src={currentUser?.profilePicture}
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
        <h1 className="font-semibold">{currentUser?.username}</h1>
      </div>
      <textarea
        id="caption"
        value={caption}
        onChange={handleCaptionChange}
        maxLength={2000}
        placeholder="Write a caption"
        className="p-1 w-[22.5rem] h-[10rem] border-b outline-none bg-transparent resize-none text-sm "
      />
      <div
        ref={emojiPickerRef}
        className={`absolute bottom-[20%] right-[3%] transition-all duration-300 ease-in-out ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
        style={{ transformOrigin: "bottom" }}
      >
        <EmojiPicker
          open={open}
          autoFocusSearch={false}
          onEmojiClick={handleEmojiClick}
          theme={Theme.DARK}
          emojiStyle={EmojiStyle.GOOGLE}
        />
      </div>
      <div className="flex items-center justify-between w-full">
        <FontAwesomeIcon
          icon={faSmile}
          className="text-gray-500 cursor-pointer mr-3"
          onClick={() => setOpen(!open)}
        />
        <span className="text-sm text-gray-500">{caption.length}/2000</span>
      </div>
      <div
        className="flex items-center justify-between w-full cursor-pointer"
        onClick={toggleAdvancedSettings}
      >
        <span className="text-sm font-semibold ml-1">Advanced Settings</span>

        {showAdvancedSettings ? (
          <FontAwesomeIcon icon={faChevronUp} />
        ) : (
          <FontAwesomeIcon icon={faChevronDown} />
        )}
      </div>
      {showAdvancedSettings && (
        <div className="w-full max-h-48 overflow-y-auto transition-all duration-300 ease-in-out">
          <div className="flex flex-col gap-2 w-full mt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm ml-1">
                Hide like and view counts on this post
              </span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={hideLikeAndViewCount}
                  onChange={() =>
                    setLikeAndHideViewCount(!hideLikeAndViewCount)
                  }
                />
                <div className="relative">
                  <div
                    className={`block w-12 h-7 bg-gray-300 rounded-full transition duration-300 ${
                      hideLikeAndViewCount
                        ? "dark:bg-[#f8f9f9] bg-blue-500"
                        : "dark:bg-[#323539] bg-[#e5e7eb]"
                    }`}
                  ></div>
                  <div
                    className={`dot absolute top-1/2 left-1 dark:bg-[#0f1419] bg-white w-5 h-5 rounded-full transition-transform duration-300 transform ${
                      hideLikeAndViewCount
                        ? "translate-x-full -translate-y-1/2"
                        : "-translate-y-1/2"
                    }`}
                  ></div>
                </div>
              </label>
            </div>
            <span className="text-[10px] text-[#929292] ml-1">
              Only you will see the total number of likes and views on this
              post. You can change this later by going to the ··· menu at the
              top of the post. To hide like counts on other people's posts, go
              to your account settings.
            </span>
            <div className="flex justify-between items-center">
              <span className="text-sm ml-1">Turn off commenting</span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={turnOffCounting}
                  onChange={() => setTurnOffCounting(!turnOffCounting)}
                />
                <div className="relative">
                  <div
                    className={`block w-12 h-7 bg-gray-300 rounded-full transition duration-300 ${
                      turnOffCounting
                        ? "dark:bg-[#f8f9f9] bg-blue-500"
                        : "dark:bg-[#323539] bg-[#e5e7eb]"
                    }`}
                  ></div>
                  <div
                    className={`dot absolute top-1/2 left-1 dark:bg-[#0f1419] bg-white w-5 h-5 rounded-full transition-transform duration-300 transform ${
                      turnOffCounting
                        ? "translate-x-full -translate-y-1/2"
                        : "-translate-y-1/2"
                    }`}
                  ></div>
                </div>
              </label>
            </div>
            <span className="text-[10px] text-[#929292] ml-1">
              You can change this later by going to the ··· menu at the top of
              your post.
            </span>
          </div>
        </div>
      )}
      <div className="w-full flex justify-end mt-1">
        <Button variant="outline">Share Post</Button>
      </div>
    </div>
  );
};

export default CreatePostFormSubmit;
