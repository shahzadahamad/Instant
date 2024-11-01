import { useState } from "react";
import ChatMessageHeader from "./ChatMessageHeader";
import TextMessage from "./message-type/TextMessage";
import FileMessage from "./message-type/FileMessage";
import AudioMessage from "./message-type/AudioMessage";
import SharePostMessage from "./message-type/SharePostMessage";

const ChatDetials = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="w-2/3 h-full flex flex-col ">
      <ChatMessageHeader />
      <div className="w-full flex-1 flex flex-col border-b overflow-y-auto scrollbar-hidden">
        <div className="flex flex-col items-center justify-center gap-2 p-10 pb-20">
          <div className="w-24 h-24 cursor-pointer">
            <img
              src="/avatar.png"
              className="w-full h-full rounded-full object-cover"
              alt=""
            />
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <div>
              <h1 className="text-xl font-semibold cursor-pointer">
                Shahzad Ahamad P
              </h1>
              <h1 className="text-base text-[#8a8a8a]">shahzad</h1>
            </div>
            <button className="dark:hover:bg-[#191919] text-sm hover:bg-[#f0f0f0] font-semibold transition-colors px-3 py-1.5 border rounded-md">
              View Profile
            </button>
          </div>
        </div>
        <TextMessage />
        <FileMessage />
        <AudioMessage />
        <SharePostMessage />
      </div>
      <div className="h-[5rem] p-3 content-center ">
        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 rounded-md border bg-transparent outline-none pr-10"
            placeholder="Type here..."
          />

          {message ? (
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 font-semibold">
              Send
            </button>
          ) : (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-3">
              <svg
                aria-label="Add Photo or Video"
                className="x1lliihq x1n2onr6 x5n08af cursor-pointer"
                fill="currentColor"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24"
              >
                <title>Add Photo or Video</title>
                <path
                  d="M6.549 5.013A1.557 1.557 0 1 0 8.106 6.57a1.557 1.557 0 0 0-1.557-1.557Z"
                  fill-rule="evenodd"
                ></path>
                <path
                  d="m2 18.605 3.901-3.9a.908.908 0 0 1 1.284 0l2.807 2.806a.908.908 0 0 0 1.283 0l5.534-5.534a.908.908 0 0 1 1.283 0l3.905 3.905"
                  fill="none"
                  stroke="currentColor"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
                <path
                  d="M18.44 2.004A3.56 3.56 0 0 1 22 5.564h0v12.873a3.56 3.56 0 0 1-3.56 3.56H5.568a3.56 3.56 0 0 1-3.56-3.56V5.563a3.56 3.56 0 0 1 3.56-3.56Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>

              <svg
                aria-label="Voice clip"
                className="x1lliihq x1n2onr6 x5n08af cursor-pointer"
                fill="currentColor"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24"
              >
                <title>Voice clip</title>
                <path
                  d="M19.5 10.671v.897a7.5 7.5 0 0 1-15 0v-.897"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
                <line
                  fill="none"
                  stroke="currentColor"
                  stroke-linejoin="round"
                  stroke-width="2"
                  x1="12"
                  x2="12"
                  y1="19.068"
                  y2="22"
                ></line>
                <line
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  x1="8.706"
                  x2="15.104"
                  y1="22"
                  y2="22"
                ></line>
                <path
                  d="M12 15.745a4 4 0 0 1-4-4V6a4 4 0 0 1 8 0v5.745a4 4 0 0 1-4 4Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatDetials;
