import { useCallback, useEffect, useRef, useState } from "react";
import ChatMessageHeader from "./ChatMessageHeader";
import TextMessage from "./message-type/TextMessage";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { getChatData, sendFileMessage } from "@/apis/api/userApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useNavigate, useParams } from "react-router-dom";
import { ChatData, ChatDatas, MessageData } from "@/types/chat/chat";
import { socket } from "@/socket/socket";
import { useDispatch } from "react-redux";
import { updatelastMessage } from "@/redux/slice/chatSlice";
import { format, isToday, isYesterday } from "date-fns";
import SharePostMessage from "./message-type/SharePostMessage";
import Unavailable from "./message-type/Unavailable";
import Image from "../common/svg/Image";
import Audio from "../common/svg/Audio";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import FileMessage from "./message-type/FileMessage";
import AudioRecoding from "./AudioRecoding";
import AudioMessage from "./message-type/AudioMessage";

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAudio, setIsAudio] = useState(false);

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
  }, [messages, chatId]);

  useEffect(() => {
    socket.on("send_message", (data) => {
      if (data.messageData[0].chatId === chatId) {
        setMessages((prevMessages) => (prevMessages ? [...prevMessages, ...data.messageData] : data.messageData));
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

  const handleMessageSend = async (chatId: string, message: string, audioFile: File | null) => {
    if (!message && selectedFiles.length === 0 && !audioFile) return;
    setIsLoading(true);
    const files = audioFile ? [audioFile] : selectedFiles;
    if (files.length > 0) {
      const formData = new FormData();
      files.forEach((fileItem) => {
        formData.append("files", fileItem);
      });
      formData.append('chatId', chatId);
      try {
        await sendFileMessage(formData);
        setSelectedFiles([]);
        setIsLoading(false);
        return true;
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          console.log(error);
          const errorMsg = error.response.data?.error || "An error occurred";
          toast.error(errorMsg);
        } else {
          console.error("Unexpected error:", error);
          toast.error("An unexpected error occurred");
        }
        return false;
      } finally {
        setIsLoading(false);
      }
    }

    if (message) {
      const data = { chatId, message, type: 'text' }
      socket.emit('send_message', data);
      setSendMessage("");
      setSelectedFiles([]);
      setIsLoading(false);
    }
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

  const handleSvgClick = () => {
    if (selectedFiles.length >= 5) {
      toast.error("You can only upload up to 5 files.");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files = event.target.files;
    if (!files || files.length === 0) {
      toast.error("Please select at least one file to upload.");
      return;
    }

    if (selectedFiles.length + files.length > 5) {
      toast.error("You can only upload up to 5 files. Extra files will be removed.");

      const remainingSlots = 5 - selectedFiles.length;

      const limitedFiles = Array.from(files).slice(0, remainingSlots);

      const dataTransfer = new DataTransfer();
      limitedFiles.forEach((file) => dataTransfer.items.add(file));

      event.target.files = dataTransfer.files;
    }

    const maxSizeInMB = 50;
    const maxDurationInSeconds = 60;

    const newFiles: File[] = [];

    const checkVideoDuration = (file: File): Promise<boolean> => {
      return new Promise((resolve) => {
        const video = document.createElement("video");
        video.preload = "metadata";

        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          resolve(video.duration <= maxDurationInSeconds);
        };

        video.src = URL.createObjectURL(file);
      });
    };

    const processFiles = async () => {
      for (const file of files) {
        if (file.size > maxSizeInMB * 1024 * 1024) {
          toast.error(`"${file.name}" exceeds 50MB file size limit.`);
          continue;
        }

        if (file.type.startsWith("video/")) {
          const isValidDuration = await checkVideoDuration(file);
          if (!isValidDuration) {
            toast.error(`"${file.name}" exceeds 1-minute duration limit.`);
            continue;
          }
        }

        newFiles.push(file);
      }

      if (newFiles.length > 0) {
        setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles].slice(0, 5));
      }
    };

    processFiles();
  };


  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleIsAudio = () => {
    setIsAudio(false);
  }

  const handleAudioSend = async (audioFile: File, chatId: string): Promise<boolean> => {
    const res = await handleMessageSend(chatId, sendMessage, audioFile);
    if (res) {
      setIsAudio(false);
      return true;
    } else {
      return false;
    }
  }

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
                          <TextMessage key={message._id} message={message} />
                        ) : message.type === 'sharePost' ? (
                          <SharePostMessage key={message._id} message={message} />
                        ) : message.type === 'unavailable' ? (
                          <Unavailable key={message._id} message={message} />
                        ) : (message.type === 'image' || message.type === 'video') ? (
                          <FileMessage key={message._id} message={message} />
                        ) : message.type === 'audio' && (
                          <AudioMessage key={message._id} message={message} />
                        )
                      )}
                    </div>
                  )
                )}
              <div ref={messagesEndRef} />
            </div>
            {
              isAudio && (
                <div className="px-3 py-4 content-center flex flex-col gap-3">
                  <AudioRecoding handleIsAudio={handleIsAudio} handleAudioSend={handleAudioSend} chatId={chatData._id} />
                </div>
              )
            }
            {
              !isAudio && (
                <div className="px-3 py-4 content-center flex flex-col gap-3">
                  {selectedFiles.length > 0 && (
                    <div className="flex gap-2 ml-2">
                      <div onClick={handleSvgClick} className="w-20 h-20 flex items-center justify-center dark:bg-[#212426] bg-[#e0e3e5] rounded-lg cursor-pointer">
                        <Image />
                      </div>
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative">
                          {file.type.startsWith("image/") ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt="Preview"
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          ) : (
                            <video
                              src={URL.createObjectURL(file)}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          )}

                          {file.type.startsWith("video/") && (
                            <div className="absolute top-1/2 left-1/2 w-8 h-8 text-base rounded-full flex items-center justify-center bg-black bg-opacity-50 transform -translate-x-1/2 -translate-y-1/2">
                              <FontAwesomeIcon className="hover:cursor-pointer text-white" icon={faPlay} />
                            </div>
                          )}

                          <button
                            className="absolute top-[-6px] right-[-6px] w-5 h-5 flex items-center justify-center bg-[#989898] text-white rounded-full text-xs"
                            onClick={() => handleRemoveFile(index)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="relative">
                    <input
                      type="text"
                      value={sendMessage}
                      onChange={(e) => setSendMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleMessageSend(chatData._id, sendMessage, null)
                        }
                      }}
                      className="w-full p-3 rounded-xl border bg-transparent outline-none pl-10 pr-10"
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

                    {sendMessage || selectedFiles.length > 0 ? (
                      <button onClick={() => handleMessageSend(chatData._id, sendMessage, null)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 font-semibold">
                        {isLoading ? <div className="spinner"></div> : "Send"}
                      </button>
                    ) : (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-3">
                        <div onClick={handleSvgClick}>
                          <Image />
                        </div>
                        <div onClick={() => setIsAudio(true)}>
                          <Audio />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            }
            <input
              type="file"
              multiple
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        ) : (
          ""
        )
      }
    </>
  );
};

export default ChatDetials;
