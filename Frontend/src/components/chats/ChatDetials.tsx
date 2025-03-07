import { useCallback, useEffect, useRef, useState } from "react";
import ChatMessageHeader from "./ChatMessageHeader";
import TextMessage from "./message-type/TextMessage";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { getChatData } from "@/apis/api/userApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useNavigate, useParams } from "react-router-dom";
import { ChatData, ChatDatas, MessageData } from "@/types/chat/chat";
import { socket } from "@/socket/socket";
import { useDispatch } from "react-redux";
import { updatelastMessage } from "@/redux/slice/chatSlice";
import { format, isToday, isYesterday } from "date-fns";
import SharePostMessage from "./message-type/SharePostMessage";

const ChatDetials = () => {
  const [sendMessage, setSendMessage] = useState("");
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { chatId } = useParams();
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [messages, setMessages] = useState<MessageData[] | null>(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  const fetchChatData = useCallback(
    async (chatId: string) => {

      try {
        const res: ChatDatas = await getChatData(chatId);
        res.chatData.members = res.chatData.members.filter(member => member._id.toString() !== currentUser?._id.toString());
        setChatData(res.chatData);
        setMessages(res.messageData);
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          console.log(error);
          const errorMsg = error.response.data?.error || "An error occurred";
          toast.error(errorMsg);
        } else {
          console.error("Unexpected error:", error);
          toast.error("An unexpected error occurred");
        }
      }
    },
    [currentUser],
  )

  useEffect(() => {

    if (chatId) {
      fetchChatData(chatId);
    }

    return () => { }
  }, [chatId, fetchChatData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.on("send_message", (data) => {
      if (data.messageData.chatId === chatId) {
        setMessages((prevMessages) => (prevMessages ? [...prevMessages, data.messageData] : [data.messageData]));
        dispatch(updatelastMessage({ _id: data.messageData.chatId, lastMessage: data.lastMessage }));
      }
    });

    return () => {
      socket.off("send_message");
    };
  }, [dispatch, chatId]);


  const handleEmojiClick = (emoji: string) => {
    setSendMessage((prev) => prev + emoji);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target as Node) &&
      !(event.target as HTMLElement).closest(".preventbutton")
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleMessageSend = (chatId: string, message: string, type: string) => {
    const data = {
      chatId, message, type
    }
    socket.emit('send_message', data);
    setSendMessage("");
  }

  const groupMessagesByDate = (messages: MessageData[]) => {
    return messages.reduce((acc: Record<string, MessageData[]>, message) => {
      const messageDate = new Date(message.createdAt);
      const dateKey = isToday(messageDate)
        ? "Today"
        : isYesterday(messageDate)
          ? "Yesterday"
          : format(messageDate, "MMMM d, yyyy");

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(message);
      return acc;
    }, {});
  };


  return (
    <>
      {
        chatData ? (
          <div className="w-2/3 h-full flex flex-col ">
            <ChatMessageHeader userData={chatData.type === 'personal' ? chatData.members[0] : chatData} />
            <div className="w-full flex-1 flex flex-col border-b overflow-y-auto scrollbar-hidden">
              <div className="flex flex-col items-center justify-center gap-2 p-10 pb-20">
                <div className="w-24 h-24 cursor-pointer">
                  <img
                    src={chatData.type === 'personal' ? chatData.members[0].profilePicture : chatData.profilePicture}
                    className="w-full h-full rounded-full object-cover"
                    alt=""
                  />
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div>
                    <h1 className="text-xl font-semibold cursor-pointer">
                      {chatData.type === 'personal' ? chatData.members[0].fullname : chatData.name}
                    </h1>
                    {
                      chatData.type === 'personal' ? (
                        <h1 className="text-base text-[#8a8a8a]">{chatData.members[0].username}</h1>
                      ) :
                        <h1 className="text-base text-[#8a8a8a]">{chatData.createdBy._id === currentUser?._id ? "You created this group" : chatData.createdBy.username + " created this group"}</h1>
                    }
                  </div>
                  {
                    chatData.type === 'personal' && (
                      <button onClick={() => navigate(`/user/${chatData.members[0].username}`)} className="dark:hover:bg-[#191919] text-sm hover:bg-[#f0f0f0] font-semibold transition-colors px-3 py-1.5 border rounded-md">
                        View Profile
                      </button>
                    )
                  }
                </div>
              </div>
              {messages &&
                Object.entries(groupMessagesByDate(messages)).map(
                  ([date, messagesForDate]) => (
                    <div key={date}>
                      <div className="text-center text-base text-[#8a8a8a] my-4">
                        {date}
                      </div>
                      {messagesForDate.map((message) =>
                        message.type === "callText" ? (
                          <p key={message._id} className="text-center pb-7 text-[#8a8a8a] text-sm">
                            {
                              (message.message === 'Audio call ended' || message.message === 'Video chat ended') ? message.message :
                                message.senderId._id === currentUser?._id.toString() ? "You " + message.message.split(" ").slice(1).join(" ") :
                                  message.senderId.username + " " + message.message.split(" ").slice(1).join(" ")
                            }
                          </p>
                        ) : message.type === 'text' ? (
                          <>
                            <TextMessage key={message._id} message={message} />
                          </>
                        ) : message.type === 'sharePost' && (
                          <SharePostMessage key={message._id} message={message} />
                        )
                      )}
                    </div>
                  )
                )}
              <div ref={messagesEndRef} />
            </div>
            <div className="h-[5rem] p-3 content-center ">
              <div className="relative">
                <input
                  type="text"
                  value={sendMessage}
                  onChange={(e) => setSendMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleMessageSend(chatData._id, sendMessage, 'text')
                    }
                  }}
                  className="w-full p-3 rounded-md border bg-transparent outline-none pl-10 pr-10"
                  placeholder="Type here..."
                />

                <div ref={emojiPickerRef} className="absolute bottom-[50px]">
                  <EmojiPicker
                    open={open}
                    autoFocusSearch={false}
                    theme={Theme.DARK}
                    emojiStyle={EmojiStyle.GOOGLE}
                    onEmojiClick={(e) => handleEmojiClick(e.emoji)}
                  />
                </div>

                <div className="absolute preventbutton cursor-pointer top-1/2 left-3 transform -translate-y-1/2 ">
                  <svg
                    onClick={() => setOpen(!open)}
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

                {sendMessage ? (
                  <button onClick={() => handleMessageSend(chatData._id, sendMessage, 'text')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 font-semibold">
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
        ) : (
          ""
        )
      }
    </>
  );
};

export default ChatDetials;
