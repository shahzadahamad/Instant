import { Modal, ModalContent, ModalBody, ModalHeader } from "@nextui-org/modal";
import { Check, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from "react";
import VerificationIcon from "./svg/VerificationIcon";
import { ShareMOdalProps } from "@/types/home/postLowerSection";
import { ChatData } from "@/types/chat/chat";
import { getChatList } from "@/apis/api/userApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { socket } from "@/socket/socket";

const SharePostModal: React.FC<ShareMOdalProps> = ({ postId, shareModalOpen, handleShareModal }) => {
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [chats, setchats] = useState<ChatData[]>([])
  const { currentUser } = useSelector((state: RootState) => state.user);

  const fetchChatList = useCallback(async () => {
    try {
      const type = "all";
      const chatList: ChatData[] = await getChatList(type);
      const updatedChatList: ChatData[] = chatList.map(chat => {
        const opositeUser = chat.members.filter(member => member._id.toString() !== currentUser?._id.toString());

        return {
          ...chat,
          members: opositeUser
        }
      });
      setchats(updatedChatList);
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
    fetchChatList();
    return () => { }
  }, [fetchChatList]);

  const toggleSelection = (chatId: string) => {
    if (selectedChats.includes(chatId)) {
      setSelectedChats(selectedChats.filter(id => id !== chatId));
    } else {
      setSelectedChats([...selectedChats, chatId]);
    }
  };

  const sharePost = (chatIds: string[], postId: string) => {
    const data = {
      chatIds,
      postId
    }
    socket.emit('send_share_message', data);
    setSearch("");
    handleShareModal()
  }

  const filteredChats = search.trim()
    ? chats.filter((chat) => {
      const chatName = chat.type === 'group' ? chat.name : chat.members[0].username;
      return chatName.toLowerCase().includes(search.toLowerCase());
    })
    : chats;

  return (
    <Modal
      isOpen={shareModalOpen}
      size="lg"
      className="relative flex items-center justify-center preventbutton"
      onOpenChange={handleShareModal}
      hideCloseButton={true}
    >
      <ModalContent className="max-w-lg overflow-hidden">
        <>
          <ModalHeader className="flex justify-between items-center border-b px-6 py-4">
            Share
          </ModalHeader>
          <ModalBody className="p-0 m-0 overflow-hidden">
            <div className="p-4">
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-3 outline-none flex items-center pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
                <input
                  type="search"
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  className="w-full bg-[#121212] border text-white outline-none pl-10 py-2 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-4 gap-4 min-w-96 max-h-64 overflow-y-auto">
                {
                  filteredChats.length > 0 ?
                    filteredChats.map((chat) => (
                      <div
                        key={chat._id}
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => toggleSelection(chat._id)}
                      >
                        <div className="relative w-12 h-12 rounded-full mb-2">
                          <img
                            src={chat.type === 'group' ? chat.profilePicture : chat.members[0].profilePicture}
                            alt={chat._id}
                            className="w-full h-full object-cover rounded-full"
                          />
                          {selectedChats.includes(chat._id) && (
                            <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                              <Check size={8} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-center">
                          <span className="text-xs text-center overflow-ellipsis overflow-hidden w-full">{chat.type === 'group' ? chat.name : chat.members[0].username}</span>
                          {
                            chat.type !== 'group' && chat.members[0].isVerified.status && (
                              <VerificationIcon size={'16'} />
                            )
                          }
                        </div>
                      </div>
                    )) : <p>No results.</p>
                }
              </div>
            </div>
            <div className="p-4">
              <button
                onClick={() => sharePost(selectedChats, postId)}
                disabled={selectedChats.length <= 0}
                className={`w-full bg-blue-500 hover:bg-blue-600 ${selectedChats.length <= 0 && 'cursor-not-allowed opacity-50'} transition-all text-white font-medium p-2 rounded-lg`}
              >
                Send
              </button>
            </div>
          </ModalBody>
        </>
      </ModalContent>
    </Modal >
  );
};

export default SharePostModal;