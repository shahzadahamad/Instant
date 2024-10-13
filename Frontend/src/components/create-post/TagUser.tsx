import { RootState } from "@/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import apiClient from "@/apis/apiClient";
import { GetCreatePostUserData } from "@/types/create-post/create-post";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { pushTagUser, removeTagUser } from "@/redux/slice/postSlice";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";

const TagUser = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { post } = useSelector((state: RootState) => state.post);
  const [searchVal, setSearchVal] = useState("");
  const [searchUsers, setSearchUsers] = useState<
    GetCreatePostUserData[] | null
  >([]);
  const [postIndex, setPostIndex] = useState(0);
  const [taggedUser, setTaggedUser] = useState<GetCreatePostUserData[]>([]);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const response = await apiClient.get(`/user/create-post/get-data`, {
          params: {
            search: searchVal,
            users: post[postIndex].tagUsers,
          },
        });
        setSearchUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    if (searchVal) {
      fetchMusic();
    }
    return () => {};
  }, [searchVal, postIndex, post]);

  useEffect(() => {
    fetchTagUser();
    return () => {};
  }, [post[postIndex].tagUsers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setSearchVal("");
      setSearchUsers([]);
    }
    setSearchVal(e.target.value);
  };

  const handleNextImage = () => {
    if (post && post.length > 0) {
      setPostIndex((prevIndex) => (prevIndex + 1) % post.length);
    }
  };

  const handlePreviousImage = () => {
    if (post && post.length > 0) {
      setPostIndex((prevIndex) => (prevIndex - 1 + post.length) % post.length);
    }
  };

  const fetchTagUser = async () => {
    try {
      const response = await apiClient.get(`/user/get-tagged-user-data`, {
        params: { taggedUsers: post[postIndex].tagUsers },
      });
      setTaggedUser(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleTagUserClick = async () => {
    if (post[postIndex].tagUsers.length > 0) {
      fetchTagUser();
      onOpen();
    } else {
      toast.error("No user tagged yet.");
    }
  };

  const handleTagUser = (id: string) => {
    if (
      post &&
      post[postIndex] &&
      post[postIndex].tagUsers &&
      post[postIndex].tagUsers.length >= 10
    ) {
      toast.error("You can tag a maximum of 10 users per post.");
      return;
    }
    dispatch(pushTagUser({ index: postIndex, id: id }));
    setSearchVal("");
    setSearchUsers([]);
  };

  const handleRemoveTag = (id: string) => {
    dispatch(removeTagUser({ index: postIndex, id }));
    if (post[postIndex].tagUsers.length === 1) {
      onOpenChange();
    }
    toast.success("User has been untagged.");
  };

  return (
    <div className="relative flex flex-col items-center justify-start gap-10 h-full w-full">
      <div className="relative w-[28rem]">
        <input
          type="text"
          value={searchVal}
          onChange={handleSearchChange}
          className="w-full p-3 border rounded-md outline-none bg-transparent resize-none text-sm"
          placeholder="Tag users"
        />
        <PersonAddAltIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm cursor-pointer" />
        {searchVal && searchUsers && searchUsers.length > 0 && (
          <div className="absolute z-10 w-full dark:bg-[#18181b] bg-gray-300 border rounded-sm max-h-[60vh] scrollbar-style overflow-y-auto">
            {searchUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => handleTagUser(user._id)}
                className="flex items-center p-2 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover mr-2"
                />
                <div className="flex flex-col">
                  <span className="text-[13px]">{user.username}</span>
                  <span className="text-[12px] text-[#a9a6a4]">
                    {user.fullname}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="relative w-72 h-72 flex items-center justify-center">
        {post && post.length > 0 && post[postIndex].type === "image" ? (
          <img
            className="absolute w-full h-full rounded-md object-contain"
            src={post[postIndex].url}
            alt="Uploaded content"
          />
        ) : (
          <video
            className="absolute w-full h-full rounded-md object-contain"
            src={post[postIndex].url}
          />
        )}
      </div>

      {searchUsers && searchUsers.length <= 0 && (
        <>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
            <button
              onClick={handleNextImage}
              className={`w-8 h-8 rounded-full bg-black bg-opacity-50 hover:bg-black hover:bg-opacity-20 cursor-pointer transition-colors flex items-center justify-center ${
                post && postIndex === post.length - 1 ? "hidden" : ""
              }`}
            >
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-white text-[15px]"
              />
            </button>
          </div>

          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
            <button
              onClick={handlePreviousImage}
              className={`w-8 h-8 rounded-full bg-black bg-opacity-50 hover:bg-black hover:bg-opacity-20 cursor-pointer transition-colors flex items-center justify-center ${
                post && postIndex === 0 ? "hidden" : ""
              }`}
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="text-white text-[14px]"
              />
            </button>
          </div>
          {post[postIndex].tagUsers.length > 0 && (
            <Button
              onClick={handleTagUserClick}
              variant="outline"
              className="absolute bottom-2 border-none text-white z-10 hover:text-white right-2 w-8 h-8 rounded-full bg-black bg-opacity-50 hover:bg-black hover:bg-opacity-20 transition-colors flex items-center cursor-pointer justify-center"
            >
              <FontAwesomeIcon icon={faUser} />
            </Button>
          )}
        </>
      )}
      <Modal
        isOpen={isOpen}
        size="lg"
        onOpenChange={onOpenChange}
        className="flex items-center justify-center"
      >
        <ModalContent>
          <ModalHeader>
            <div className="w-full flex justify-between items-center">
              <h1 className="text-lg font-semibold">Tagged Users</h1>
            </div>
          </ModalHeader>
          <ModalBody className="w-full h-[70vh] overflow-y-auto flex flex-col border-t relative">
            {post[postIndex].tagUsers.length > 0 ? (
              <div className="w-full">
                {taggedUser.map((user) => (
                  <div
                    key={user._id}
                    className="w-full rounded-md flex border justify-between items-center p-2 dark:hover:bg-gray-800 transition-colors hover:bg-gray-200 cursor-pointer mb-2"
                  >
                    <div className="flex gap-2">
                      <img
                        src={user.profilePicture}
                        alt="profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold">
                          {user.username}
                        </span>
                        <span className="text-[12px] dark:text-[#a3a09f] text-[#3c3532]">
                          {user.fullname}
                        </span>
                      </div>
                    </div>
                    <button className="text-red-500 hover:text-red-700">
                      <FontAwesomeIcon
                        onClick={() => handleRemoveTag(user._id)}
                        icon={faXmark}
                      />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <h1 className="text-center">No Tagged User.</h1>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TagUser;
