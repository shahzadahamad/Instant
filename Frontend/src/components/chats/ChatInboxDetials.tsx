import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ChatDetials from "./ChatDetials";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import ChatsInbox from "./ChatInbox";
import { useParams } from "react-router-dom";

const ChatInboxDetials = () => {
  const [tab, setTab] = useState("chats");
  const { chatId } = useParams();

  return (
    <div className="w-full flex overflow-auto scrollbar-hidden">
      <div className="w-1/3 h-full border-r flex flex-col">
        <div className="flex flex-col">
          <div className="p-3 max-w-md border-b">
            <div className="relative">
              <input
                type="text"
                className="w-full bg-transparent p-3 pr-10 border rounded-md shadow-sm focus:outline-none"
                name="search"
                placeholder="Search"
              />
              <button className="absolute right-2 top-1 p-2 transition-colors hover:text-blue-500 focus:outline-none">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>
          </div>
          <div className="flex border-b">
            <div
              onClick={() => setTab("chats")}
              className={`w-1/2 text-center p-2 transition-colors border-r cursor-pointer ${tab === "chats" && "dark:bg-[#191919] bg-[#f0f0f0]"
                } dark:hover:bg-[#191919] hover:bg-[#f0f0f0]`}
            >
              <h1
                className={`${tab === "chats" ? "font-bold" : "font-semibold"}`}
              >
                Chats
              </h1>
            </div>
            <div
              onClick={() => setTab("group-chats")}
              className={`w-1/2 text-center p-2 transition-colors cursor-pointer ${tab === "group-chats" && "dark:bg-[#191919] bg-[#f0f0f0]"
                } dark:hover:bg-[#191919] hover:bg-[#f0f0f0]`}
            >
              <h1
                className={`${tab === "group-chats" ? "font-bold" : "font-semibold"
                  }`}
              >
                Group chats
              </h1>
            </div>
          </div>
        </div>
        {tab === "chats" && <ChatsInbox tab={tab} />}
        {tab === "group-chats" && <ChatsInbox tab={tab} />}
      </div>

      {chatId ? (
        <ChatDetials />
      ) : (
        <div className="w-2/3 h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <svg
              aria-label=""
              className="x1lliihq x1n2onr6 x5n08af"
              fill="currentColor"
              height="96"
              role="img"
              viewBox="0 0 96 96"
              width="96"
            >
              <title></title>
              <path d="M48 0C21.532 0 0 21.533 0 48s21.532 48 48 48 48-21.532 48-48S74.468 0 48 0Zm0 94C22.636 94 2 73.364 2 48S22.636 2 48 2s46 20.636 46 46-20.636 46-46 46Zm12.227-53.284-7.257 5.507c-.49.37-1.166.375-1.661.005l-5.373-4.031a3.453 3.453 0 0 0-4.989.921l-6.756 10.718c-.653 1.027.615 2.189 1.582 1.453l7.257-5.507a1.382 1.382 0 0 1 1.661-.005l5.373 4.031a3.453 3.453 0 0 0 4.989-.92l6.756-10.719c.653-1.027-.615-2.189-1.582-1.453ZM48 25c-12.958 0-23 9.492-23 22.31 0 6.706 2.749 12.5 7.224 16.503.375.338.602.806.62 1.31l.125 4.091a1.845 1.845 0 0 0 2.582 1.629l4.563-2.013a1.844 1.844 0 0 1 1.227-.093c2.096.579 4.331.884 6.659.884 12.958 0 23-9.491 23-22.31S60.958 25 48 25Zm0 42.621c-2.114 0-4.175-.273-6.133-.813a3.834 3.834 0 0 0-2.56.192l-4.346 1.917-.118-3.867a3.833 3.833 0 0 0-1.286-2.727C29.33 58.54 27 53.209 27 47.31 27 35.73 36.028 27 48 27s21 8.73 21 20.31-9.028 20.31-21 20.31Z"></path>
            </svg>
            <div className="text-center flex gap-1 flex-col">
              <h1 className="text-2xl font-bold">Your messages</h1>
              <h1 className="text-sm font-base text-[#8b949b]">
                {`Send messages and private photos ${tab === "chats"
                  ? "to a friend."
                  : tab === "group-chats"
                    ? "to a group."
                    : ""
                  }`}
              </h1>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInboxDetials;
