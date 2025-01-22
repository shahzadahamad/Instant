import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faPhone,
  faVideo,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import { getChatList } from "@/apis/api/userApi";
import { ChatData } from "@/types/chat/chat";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

const ChatsInbox: React.FC<{ tab: string }> = ({ tab }) => {
  const navigate = useNavigate();
  const [chatList, setChatList] = useState<ChatData[] | []>([]);
  const { currentUser } = useSelector((state: RootState) => state.user);


  const fetchChatList = useCallback(async (tab: string) => {


    try {
      const type = tab === 'chats' ? 'personal' : 'group';
      const chatList: ChatData[] = await getChatList(type);
      const updatedChatList: ChatData[] = chatList.map(chat => {
        const opositeUser = chat.members.filter(member => member._id.toString() !== currentUser?._id.toString());

        return {
          ...chat,
          members: opositeUser
        }
      });
      setChatList(updatedChatList);
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
  }, [currentUser])

  useEffect(() => {

    fetchChatList(tab);

    return () => { }
  }, [tab, fetchChatList]);


  return (
    <>
      {chatList.length >
        0 ? (
        <div className="flex-1 overflow-y-scroll scrollbar-hidden">
          {tab === "chats" ? (
            <h1 className="text-end px-4 pt-4 pb-0 font-semibold text-blue-500 hover:opacity-70 transition-colors cursor-pointer">
              Requests (1)
            </h1>
          ) : tab === "group-chats" ? (
            <div className="px-4 pt-4 pb-0 flex items-center justify-between">
              <div className="flex gap-2 items-center group transition-transform cursor-pointer">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="text-xl border dark:hover:bg-[#191919] hover:bg-[#f0f0f0] transition-colors p-2 py-1.5 rounded-md"
                />
                <h1 className="text-sm hidden group-hover:block transition-transform">
                  Create new group chat{" "}
                </h1>
              </div>
              <h1 className="text-end font-semibold text-blue-500 hover:opacity-70 transition-colors cursor-pointer">
                Requests (4)
              </h1>
            </div>
          ) : (
            ""
          )}
          {chatList.map(
            (chat) => (
              <div
                onClick={() => navigate(`/chats/${chat._id}`)}
                key={chat._id}
                className="flex p-3 items-center cursor-pointer dark:hover:bg-[#191919] hover:bg-[#f0f0f0]"
              >
                <div className={`w-12 h-12 ${tab === "chats" && "relative"}`}>
                  <img
                    src={chat.members[0].profilePicture}
                    className="w-full h-full rounded-full object-cover"
                    alt=""
                  />
                  {tab === "chats" && (
                    <FontAwesomeIcon
                      icon={faCircle}
                      className="text-[#1cd14f] rounded-full border-3 dark:border-[#09090b] border-white bg-white absolute bottom-0 -right-1 w-[14px] h-[14px]"
                    />
                  )}
                </div>
                <div className="flex justify-between items-center flex-grow ml-3">
                  <div>
                    <h1 className="text-sm">{chat.members[0].fullname}</h1>
                    <h1 className="text-xs text-[#8a8a8a]">{chat.lastMessage}</h1>
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
      ) : (
        <>
          <h1 className="text-end px-4 pt-4 pb-0 font-semibold text-blue-500 hover:opacity-70 transition-colors cursor-pointer">
            Requests (1)
          </h1>
          <div className="h-[60vh] flex items-center justify-center overflow-y-scroll scrollbar-hidden">
            <div className="flex flex-col items-center gap-3">
              <div className="text-center flex gap-1 flex-col">
                <h1 className="text-2xl font-bold">Your inbox</h1>
                <h1 className="text-sm font-base text-[#8b949b]">
                  {tab === "chats"
                    ? `Start messaging to a friend.`
                    : tab === "group-chats"
                      ? `Create a group and start messaging.`
                      : ""}
                </h1>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ChatsInbox;
