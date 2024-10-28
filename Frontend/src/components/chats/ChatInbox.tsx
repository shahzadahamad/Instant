import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ChatDetials from "./ChatDetials";
import {
  faCircle,
  faMagnifyingGlass,
  faPhone,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const ChatInbox = () => {
  const [tab, setTab] = useState("chats");
  return (
    <div className="w-full flex overflow-auto scrollbar-hidden">
      <div className="w-1/3 h-full border-r">
        <div className="max-h-[25vh]">
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
              className={`w-1/2 text-center p-2 transition-colors border-r cursor-pointer ${
                tab === "chats" && "dark:bg-[#191919] bg-[#f0f0f0]"
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
              className={`w-1/2 text-center p-2 transition-colors cursor-pointer ${
                tab === "group-chats" && "dark:bg-[#191919] bg-[#f0f0f0]"
              } dark:hover:bg-[#191919] hover:bg-[#f0f0f0]`}
            >
              <h1
                className={`${
                  tab === "group-chats" ? "font-bold" : "font-semibold"
                }`}
              >
                Group chats
              </h1>
            </div>
          </div>
        </div>
        {tab === "chats" && (
          <div className="max-h-[80vh] overflow-y-scroll scrollbar-hidden">
            <h1 className="text-end px-4 pt-4 pb-0 font-semibold text-blue-500 hover:opacity-70 transition-colors cursor-pointer">
              Requests
            </h1>
            {[1, 2, 3, 4, 5, 7, 9, 1, 2, 5, 1, 512, 2351, 512, 3512, 35].map(
              (item, index) => (
                <div
                  key={index}
                  className="flex p-3 items-center cursor-pointer dark:hover:bg-[#191919] hover:bg-[#f0f0f0]"
                >
                  <div className="w-12 h-12 relative">
                    <img
                      src="./avatar.png"
                      className="w-full h-full rounded-full object-cover"
                      alt=""
                    />
                    <FontAwesomeIcon
                      icon={faCircle}
                      className="text-[#1cd14f] rounded-full border-3 dark:border-[#09090b] border-white bg-white absolute bottom-0 -right-1 w-[14px] h-[14px]"
                    />
                  </div>
                  <div className="flex justify-between items-center flex-grow ml-3">
                    <div>
                      <h1 className="text-sm">Shahzad</h1>
                      <h1 className="text-xs text-[#8a8a8a]">Active 38m ago</h1>
                    </div>
                    <FontAwesomeIcon
                      icon={faCircle}
                      className="text-[#0095f6] rounded-full border-2 text-xs"
                    />
                    {/* <div className="bg-[#1cd14f] hover:bg-[#58c322] transition-colors p-1 px-3 rounded-lg flex items-center gap-2 cursor-pointer">
                      <FontAwesomeIcon icon={faPhone} className="text-sm" />
                      <FontAwesomeIcon icon={faVideo} className="text-sm" />
                      <h1>Join</h1>
                    </div> */}
                  </div>
                </div>
              )
            )}
          </div>
        )}
        {tab === "group-chats" && (
          <div className="max-h-[80vh] overflow-y-scroll scrollbar-hidden">
            {[1, 2, 3, 4, 5, 7, 9, 1, 2, 5, 1, 512, 2351, 512, 3512, 35].map(
              (item, index) => (
                <div
                  key={index + item}
                  className="flex p-3 group items-center cursor-pointer"
                >
                  <div className="w-12 h-12 relative">
                    <img
                      src="./avatar.png"
                      className="w-full h-full rounded-full object-cover"
                      alt=""
                    />
                  </div>
                  <div className="flex justify-between items-center flex-grow ml-3">
                    <div>
                      <h1 className="text-sm">Shahzad</h1>
                      <h1 className="text-xs text-[#8a8a8a]">Active 38m ago</h1>
                    </div>
                    <FontAwesomeIcon
                      icon={faCircle}
                      className="text-[#0095f6] rounded-full border-2 text-xs"
                    />
                    {/* <div className="bg-[#1cd14f] hover:bg-[#58c322] transition-colors p-1 px-3 rounded-lg flex items-center gap-2 cursor-pointer">
                      <FontAwesomeIcon icon={faPhone} className="text-sm" />
                      <FontAwesomeIcon icon={faVideo} className="text-sm" />
                      <h1>Join</h1>
                    </div> */}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
      <ChatDetials />
    </div>
  );
};

export default ChatInbox;
