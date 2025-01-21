import {
  faCopy,
  faPaperPlane,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";
import { faEllipsis, faReply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";

const MessageMenu: React.FC<{ value: boolean }> = ({ value }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setTimeout(() => {
      menuRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      const inputElement = menuRef.current;
      inputElement?.focus();
    }, 100);
  };

  const handleEmojiButtonClick = () => {
    setOpen((prev) => !prev);
    setTimeout(() => {
      emojiPickerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      const inputElement = emojiPickerRef.current;
      inputElement?.focus();
    }, 100);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      !(event.target as HTMLElement).closest(".preventbutton")
    ) {
      setIsMenuOpen(false);
    } else if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target as Node) &&
      !(event.target as HTMLElement).closest(".preventbuttonEmoji")
    ) {
      setOpen(false);
      setTimeout(() => {
        emojiPickerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        const inputElement = emojiPickerRef.current;
        inputElement?.focus();
      }, 100);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            setIsMenuOpen(false);
          }
        });
      },
      { threshold: 0 }
    );

    const currentMenuRef = menuRef.current;
    const currentEmojiRef = emojiPickerRef.current

    if (currentMenuRef) {
      observer.observe(currentMenuRef);
    }

    if (currentEmojiRef) {
      observer.observe(currentEmojiRef);
    }

    return () => {
      if (currentMenuRef) {
        observer.unobserve(currentMenuRef);
      }

      if (currentEmojiRef) {
        observer.unobserve(currentEmojiRef)
      }
    };
  }, [isMenuOpen, open]);

  return (
    <div
      className={`relative ${isMenuOpen ? "flex" : "hidden"
        } group-hover:flex transition-transform`}
    >
      <FontAwesomeIcon
        className="cursor-pointer preventbutton p-2 rounded-full dark:hover:bg-[#191919] hover:bg-[#f0f0f0]"
        icon={faEllipsis}
        onClick={toggleMenu}
      />
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute p-1 top-full mt-2 right-0 w-36 bg-white dark:bg-[#191919] rounded-md shadow-lg z-10"
        >
          <ul className="text-sm">
            <div className="flex justify-between items-center p-3 cursor-pointer rounded-md hover:bg-[#f0f0f0] dark:hover:bg-[#2c2c2c]">
              <li>Forward</li>
              <FontAwesomeIcon
                className="hover:cursor-pointer transition-colors hover:opacity-70"
                icon={faPaperPlane}
              />
            </div>

            <div className="flex justify-between items-center p-3 cursor-pointer rounded-md hover:bg-[#f0f0f0] dark:hover:bg-[#2c2c2c]">
              <li>Copy</li>
              <FontAwesomeIcon
                className="hover:cursor-pointer transition-colors hover:opacity-70"
                icon={faCopy}
              />
            </div>

            <div className="flex justify-between items-center p-3 cursor-pointer rounded-md hover:bg-[#f0f0f0] dark:hover:bg-[#2c2c2c]">
              <li className="text-red-500">{value ? "Delete for you" : "Unsend"}</li>
              <FontAwesomeIcon
                className="hover:cursor-pointer text-red-500 transition-colors hover:opacity-70"
                icon={faTrashCan}
              />
            </div>
          </ul>
        </div>
      )}
      <FontAwesomeIcon
        className="cursor-pointer rounded-full p-2 dark:hover:bg-[#191919] hover:bg-[#f0f0f0]"
        icon={faReply}
      />
      <div className="p-2 cursor-pointer preventbuttonEmoji rounded-full dark:hover:bg-[#191919] hover:bg-[#f0f0f0]">
        <svg
          onClick={handleEmojiButtonClick}
          aria-label="Emoji"
          className="x1lliihq x1n2onr6 x5n08af"
          fill="currentColor"
          height="18"
          role="img"
          viewBox="0 0 24 24"
          width="18"
        >
          <title>Emoji</title>
          <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
        </svg>
      </div>

      {open && (
        <div ref={emojiPickerRef} className="absolute bottom-[35px] z-10">
          <EmojiPicker
            open={open}
            width={300}
            height={400}
            autoFocusSearch={false}
            theme={Theme.DARK}
            emojiStyle={EmojiStyle.GOOGLE}
          />
        </div>
      )}
    </div>
  );
};

export default MessageMenu;
