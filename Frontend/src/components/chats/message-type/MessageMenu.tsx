import {
  faCopy,
  faPaperPlane,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";
import { faEllipsis, faReply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

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
    </div>
  );
};

export default MessageMenu;
