import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { getStories } from "@/apis/api/userApi";
import { StoriesWithUserData } from "@/types/create-post/create-post";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import StoryModal from "../common/StoryModal/StoryModal";
import { useNavigate } from "react-router-dom";

const Stories = () => {

  const [storyData, setStoryData] = useState<StoriesWithUserData[] | []>([]);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [selectedStory, setSelectedStory] = useState<{ userIndex: number, storyIndex: number } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      const stories: StoriesWithUserData[] = await getStories();

      const unseenStories: StoriesWithUserData[] = [];
      const seenStories: StoriesWithUserData[] = [];

      stories.forEach((story) => {
        const unseenUserStories = story.userStory.filter(
          (s) => !s.seenBy.includes(currentUser?._id.toString() || "")
        );

        if (unseenUserStories.length > 0) {
          unseenStories.push({ ...story, userStory: unseenUserStories });
        } else {
          seenStories.push(story);
        }
      });

      setStoryData([...unseenStories, ...seenStories]);
    };

    fetchStories();
  }, [currentUser?._id]);

  const closeModal = () => {
    setSelectedStory(null);
    navigate("/", { state: { preventRefetch: true } });
  }

  return (
    <div className="border-b-[1px] border-[#333232] h-[120px] p-3 flex justify-start items-center">
      {selectedStory && (
        <StoryModal
          story={storyData}
          index={selectedStory}
          close={closeModal}
        />
      )}
      <div className="flex space-x-4 overflow-x-auto scrollbar-hidden">
        <div className="relative flex-shrink-0 w-[70px] h-[70px]">
          <div className="p-[2px] bg-gradient-to-r from-[#b5347c] via-[#eb1c25] to-[#fdcd23] rounded-full relative">
            <div className="w-full h-full rounded-full border-2 dark:border-black border-white overflow-hidden">
              <img
                src="./avatar1.jpg"
                alt="image"
                className="object-cover w-full h-full"
              />
            </div>
            <FontAwesomeIcon
              icon={faCirclePlus}
              className="text-[#0095F6] rounded-full bg-white absolute bottom-0 right-0 w-6 h-6"
            />
          </div>
        </div>
        {
          storyData.length > 0 && (
            storyData.map((user, index) => {
              const unseenIndex = user.userStory.findIndex(
                (story) => !story.seenBy.includes(currentUser?._id.toString() || "")
              );

              const isWatched = unseenIndex === -1; // If no unseen story, mark as watched
              const selectedStoryIndex = isWatched ? 0 : unseenIndex;
              return (
                <div onClick={() => {
                  setSelectedStory({ userIndex: index, storyIndex: selectedStoryIndex })
                  window.history.pushState(
                    null,
                    "",
                    `/stories/${user.userData.username}/${user.userStory[selectedStoryIndex]._id}`
                  );
                }} key={user.userData._id} className="relative flex-shrink-0 w-[70px] h-[70px] cursor-pointer">
                  <div
                    className={`p-[2px] rounded-full relative ${isWatched ? "bg-gray-500 bg-opacity-50" : "bg-gradient-to-r from-[#b5347c] via-[#eb1c25] to-[#fdcd23]"}`}>
                    <div className="w-full h-full rounded-full border-2 dark:border-black border-white  overflow-hidden">
                      <img
                        src={user.userData.profilePicture.toString()}
                        alt="image"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              )
            })
          )
        }
      </div>
    </div>
  );
};

export default Stories;
