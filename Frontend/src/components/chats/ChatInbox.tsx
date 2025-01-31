import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faPhone,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createNewChat, getChatList } from "@/apis/api/userApi";
import { ChatData, Member } from "@/types/chat/chat";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useDispatch } from "react-redux";
import { setChatList, updateUserOnlineStatus } from "@/redux/slice/chatSlice";
import { socket } from "@/socket/socket";
import { timeBetween } from "@/helperFuntions/timeBetween";
import { timeSince } from "@/helperFuntions/dateFormat";
import { Modal, ModalContent, ModalBody, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { Upload, X } from "lucide-react";
import apiClient from "@/apis/apiClient";
import { debounce } from 'lodash';

const ChatsInbox: React.FC<{ tab: string }> = ({ tab }) => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { chatList } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();
  const { chatId } = useParams();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [createGroup, setCreateGroup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [searchUsers, setSearchUsers] = useState<Member[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [groupName, setGroupName] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const { callerDetials } = useSelector((state: RootState) => state.chat);


  const handleUserSelection = (user: Member) => {
    if (selectedUsers.find(u => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearch("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const removeRecipient = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(user => user._id !== userId));
  };

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
      dispatch(setChatList(updatedChatList));
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
  }, [currentUser, dispatch])

  useEffect(() => {

    fetchChatList(tab);

    return () => { }
  }, [tab, fetchChatList]);

  const getSuggestionUser = (chatList: ChatData[]): Member[] => {
    return chatList
      .filter(chat => chat.type === 'personal')
      .flatMap(chat => chat.members);
  };

  useEffect(() => {
    socket.on("online", (data) => {
      dispatch(updateUserOnlineStatus({ userId: data.userId, isOnline: { status: true, date: new Date() } }));
    });

    socket.on("offline", (data) => {
      dispatch(updateUserOnlineStatus({ userId: data.userId, isOnline: { status: false, date: new Date() } }));
    });

    return () => {
      socket.off("online");
      socket.off("offline");
    };
  }, [dispatch]);

  const fetchSearchData = useMemo(
    () =>
      debounce(async (search) => {
        try {
          const response = await apiClient.get(`/user/create-post/get-data`, {
            params: {
              search: search,
              users: [currentUser?._id],
            },
          });
          setSearchUsers(response.data);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      }, 500),
    [currentUser]
  );

  useEffect(() => {
    fetchSearchData(search);
    return () => {
      fetchSearchData.cancel();
    };
  }, [search, fetchSearchData]);

  const hanldeModalChange = () => {
    setSearchUsers([]);
    setSelectedUsers([]);
    setSearch("");
    setCreateGroup(false);
    setGroupName("");
    setSelectedImage(null);
    onOpenChange();
  }

  const handleSubmit = async (isGroup: boolean) => {
    try {
      const formData = new FormData();
      if (isGroup) {
        setLoading(true);
        const userIds = selectedUsers.map((user) => user._id);
        formData.append("userIds", JSON.stringify(userIds));
        formData.append('groupName', groupName);
        if (selectedImage) {
          formData.append("groupProfile", selectedImage);
        }
        const chatId = await createNewChat(formData);
        navigate(`/chats/${chatId}`);
        hanldeModalChange();
      } else {
        setLoading(true);
        formData.append("userIds", JSON.stringify([selectedUsers[0]._id]));
        const chatId = await createNewChat(formData);
        navigate(`/chats/${chatId}`);
        hanldeModalChange();
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.log(error);
        const errorMsg = error.response.data?.error || "An error occurred";
        toast.error(errorMsg);
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files = event.target.files;
    if (files && files.length === 1) {
      const file = files[0];
      if (file.size > 100 * 1024 * 1024) {
        toast.error("The file size cannot exceed 2 MB!");
        return;
      }

      const fileType = file.type.startsWith("video") ? "video" : "image";
      if (fileType !== "image") {
        toast.error("Only image is allowed.");
        return;
      }

      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      toast.error("Please choose a single file to upload.");
    }
  };

  const checkHowManyMemberAreOnline = useCallback((members: Member[]) => {
    return members.filter(user => user.isOnline.status).length;
  }, []);

  return (
    <>
      <div className="px-4 pt-3 pb-3 flex items-center justify-between">
        <div className="flex gap-2 items-center group transition-transform cursor-pointer">
          <h1 onClick={onOpen} className="text-sm font-semibold text-blue-500 hover:opacity-70 transition-transform">
            Create new chat
          </h1>
        </div>
        {/* <h1 className="text-end text-sm font-semibold text-blue-500 hover:opacity-70 transition-colors cursor-pointer">
          Requests (4)
        </h1> */}
      </div>

      {
        createGroup ?
          <Modal
            isOpen={isOpen}
            onOpenChange={hanldeModalChange}
            size="lg"
            className="relative flex items-center preventbutton justify-center"
            hideCloseButton={true}
          >
            <ModalContent>
              <ModalHeader>
                <div className="w-full flex flex-col gap-4 justify-between items-center">
                  <h1 className="text-lg font-bold">New group chat</h1>
                </div>
              </ModalHeader>
              <ModalBody className="w-full p-0 flex flex-col border-t gap-0">
                <div className="w-full rounded-lg shadow-lg overflow-hidden">

                  <div className="w-full max-w-md mx-auto p-6">

                    <div className="flex flex-col items-center mb-6">
                      <div
                        className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center cursor-pointer relative"
                        onClick={() => {
                          const inputTag = document.getElementById('group-image');
                          if (inputTag) {
                            inputTag.click();
                          }
                        }
                        }
                      >
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Group"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                        <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                          <Upload className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <input
                        id="group-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>

                    <div className="mb-6">
                      <input
                        type="text"
                        placeholder="Group name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <button
                      onClick={() => handleSubmit(true)}
                      disabled={!groupName.trim()}
                      className={`w-full text-center py-3 rounded-lg ${loading
                        ? "opacity-60 cursor-not-allowed"
                        : "opacity-100 cursor-pointer"
                        } transition-all ${(!groupName.trim())
                          ? 'bg-blue-500/50 text-white/50 cursor-not-allowed'
                          : 'bg-blue-500 text-white cursor-pointer hover:bg-blue-600'
                        }`}
                    >
                      {loading ? <div className="spinner"></div> : "Create group"}
                    </button>
                  </div>
                </div>
              </ModalBody>
            </ModalContent>
          </Modal>
          :
          <Modal
            isOpen={isOpen}
            onOpenChange={hanldeModalChange}
            size="2xl"
            className="relative flex items-center preventbutton justify-center"
            hideCloseButton={true}
          >
            <ModalContent>
              <ModalHeader>
                <div className="w-full flex flex-col gap-4 justify-between items-center">
                  <h1 className="text-lg font-bold">New chat</h1>
                </div>
              </ModalHeader>
              <ModalBody className="w-full p-0 flex flex-col border-t gap-0">
                <div className="w-full rounded-lg shadow-lg overflow-hidden h-[80vh] max-h-[80vh]">

                  <div className="p-4 border-b border-gray-700 max-h-36 overflow-y-auto">
                    <div className="flex flex-wrap items-start gap-2">
                      <div className="font-bold text-gray-400 mr-2">To:</div>
                      {selectedUsers.map((user) => (
                        <div
                          key={user._id}
                          className="bg-blue-500 text-white px-2 py-1 rounded-md flex items-center gap-1"
                        >
                          {user.username}
                          <X
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => removeRecipient(user._id)}
                          />
                        </div>
                      ))}
                      <input
                        type="text"
                        ref={inputRef}
                        placeholder="Search..."
                        className="flex-1 bg-transparent outline-none min-w-[100px]"
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value)
                        }}
                      />
                    </div>
                  </div>
                  <div className="max-h-[50vh] h-[50vh] overflow-y-auto">
                    {
                      (!search) &&
                      <div className="p-2 text-sm font-semibold">Suggested</div>
                    }
                    {(search
                      ? (searchUsers && searchUsers.length > 0
                        ? searchUsers
                        : <p className="px-4 py-2 font-semibold text-center">No users found</p>)
                      : getSuggestionUser(chatList)
                    ) instanceof Array
                      ? (search ? searchUsers : getSuggestionUser(chatList)).map((user) => (
                        <div
                          key={user._id}
                          className="flex items-center justify-between px-4 py-2 dark:hover:bg-gray-800 hover:bg-[#f0f0f0] cursor-pointer"
                          onClick={() => handleUserSelection(user)}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={user.profilePicture}
                              alt={user.username}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="">{user.username}</span>
                          </div>
                          <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center">
                            {selectedUsers.find((u) => u._id === user._id) && (
                              <div className="w-3 h-3 rounded-full bg-blue-500" />
                            )}
                          </div>
                        </div>
                      ))
                      : search && searchUsers.length === 0 && <p className="px-4 py-2 font-semibold text-center">No users found</p>}
                  </div>


                  <div className="p-4">
                    <button
                      onClick={() => {
                        if (selectedUsers.length > 1) {
                          setCreateGroup(true);
                        } else {
                          handleSubmit(false);
                        }
                      }}
                      className={`w-full py-2 rounded-md font-medium transition-all text-white ${selectedUsers.length > 0 && !loading ? 'bg-blue-500 hover:opacity-70' : 'bg-blue-500/50 cursor-not-allowed'
                        }`}
                      disabled={selectedUsers.length === 0 || loading}
                    >
                      {loading ? <div className="spinner"></div> : selectedUsers.length > 1 ? "Next" : "Chat"}
                    </button>
                  </div>
                </div>
              </ModalBody>
            </ModalContent>
          </Modal>
      }



      {chatList.length >
        0 ? (
        <div className="flex-1 overflow-y-scroll scrollbar-hidden">
          {chatList.map(
            (chat) => (
              <div
                onClick={() => navigate(`/chats/${chat._id}`)}
                key={chat._id}
                className={`flex p-3 items-center cursor-pointer ${chatId?.toString() === chat._id.toString() ? "dark:bg-[#191919] bg-[#f0f0f0]" : "dark:hover:bg-[#191919] hover:bg-[#f0f0f0]"} `}
              >
                <div className={`w-12 h-12 relative`}>
                  <img
                    src={chat.type === 'personal' ? chat.members[0].profilePicture : chat.profilePicture}
                    className="w-full h-full rounded-full object-cover"
                    alt=""
                  />
                  {((chat.type === 'personal' && chat.members[0]?.isOnline?.status) ||
                    (chat.type === 'group' && checkHowManyMemberAreOnline(chat.members) > 0)) && (
                      <FontAwesomeIcon
                        icon={faCircle}
                        className="text-[#1cd14f] rounded-full border-3 dark:border-[#09090b] border-white bg-white absolute bottom-0 -right-1 w-[14px] h-[14px]"
                      />
                    )}

                </div>
                <div className="flex justify-between items-center flex-grow ml-4">
                  <div>
                    <h1 className="text-sm font-semibold">{chat.type === 'personal' ? chat.members[0].fullname : chat.name}</h1>
                    <h1
                      className="text-sm text-[#8a8a8a] truncate max-w-[200px]"
                      title={
                        chat.lastMessage?.fromId._id === currentUser?._id
                          ? "You: " + chat.lastMessage?.message
                          : chat.lastMessage?.message
                      }
                    >
                      {chat.type === 'personal' ? chat.members[0].isOnline.status
                        ? "Active now"
                        : timeBetween(chat.members[0].isOnline.date)
                          ? `Active ${timeSince(chat.members[0].isOnline.date)} ago`
                          : chat.lastMessage?.fromId._id === currentUser?._id
                            ? "You: " + chat.lastMessage?.message
                            : chat.lastMessage?.fromId.username + ": " + chat.lastMessage?.message : checkHowManyMemberAreOnline(chat.members) > 0 ? checkHowManyMemberAreOnline(chat.members) + ' Member are active now'
                        : chat.lastMessage?.fromId._id === currentUser?._id
                          ? "You: " + chat.lastMessage?.message
                          : chat.lastMessage?.fromId.username + ": " + chat.lastMessage?.message}
                    </h1>
                  </div>
                  {/* <FontAwesomeIcon
                    icon={faCircle}
                    className="text-[#0095f6] rounded-full border-2 text-xs"
                  /> */}
                  {
                    callerDetials.receivingCall && callerDetials.callerId === chat.members[0]._id && (
                      <div onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/calls?isVideo=${callerDetials.isVideo}&userId=${callerDetials.callerId}`);
                      }} className="bg-[#1cd14f] hover:bg-[#58c322] transition-colors p-1 px-3 rounded-lg flex items-center gap-2 cursor-pointer">
                        {
                          callerDetials.isVideo ? (
                            <FontAwesomeIcon icon={faVideo} className="text-sm" />
                          ) : (
                            <FontAwesomeIcon icon={faPhone} className="text-sm" />
                          )
                        }
                        <h1>Join</h1>
                      </div>
                    )
                  }
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <>
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
