import { StoriesWithUserData } from '@/types/create-post/create-post';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';
import VerificationIcon from '../svg/VerificationIcon';
import { useNavigate } from 'react-router-dom';

const StoryModal: React.FC<{ story: StoriesWithUserData[], index: { userIndex: number, storyIndex: number }, close: () => void }> = ({ story, index, close }) => {

  const navigate = useNavigate();
  const [currentUserIndex, setCurrentUserIndex] = useState(index.userIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(index.storyIndex);

  // Get current user and current story
  const currentUser = story[currentUserIndex];
  const currentStory = currentUser.userStory[currentStoryIndex];

  // Handle navigation through stories and users
  const goToNextStory = () => {
    if (currentStoryIndex < currentUser.userStory.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      if (currentUserIndex < story.length - 1) {
        setCurrentUserIndex(currentUserIndex + 1);
        setCurrentStoryIndex(0);
      }
    }
  };

  const goToPrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else {
      if (currentUserIndex > 0) {
        const prevUserIndex = currentUserIndex - 1;
        const prevUser = story[prevUserIndex];
        setCurrentUserIndex(prevUserIndex);
        setCurrentStoryIndex(prevUser.userStory.length - 1);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1a1a1a] flex justify-center items-center z-50">
      <div className="flex flex-col w-full h-screen relative">
        {/* Top bar with "Instant" text and close button */}
        <div className="absolute top-0 left-0 w-full flex justify-between items-center p-4">
          <div onClick={() => navigate("/", { state: { preventRefetch: true } })} className="text-3xl font-bold">Instant</div>
          <button onClick={close} className="text-2xl">✕</button>
        </div>

        <div className="flex items-center justify-center h-full">
          {currentUserIndex > 0 || currentStoryIndex > 0 ? (
            <button
              onClick={goToPrevStory}
              className="text-4xl mx-4 w-5 h-5 rounded-full bg-[#d9cdc2] hover:bg-opacity-60 cursor-pointer transition-colors flex items-center justify-center"
            >
              <ChevronLeftIcon fontSize="medium" />
            </button>
          ) : <div className="w-5 mx-4"></div>}

          <div className="flex flex-col w-full max-w-lg h-full bg-gray-900 relative">
            <div className="absolute top-0 left-0 right-0 z-10">
              <div className="w-full px-2 pt-1 flex space-x-1">
                {currentUser.userStory.map((story, index) => (
                  <div
                    key={story._id}
                    className="h-1 flex-1 rounded-full"
                    style={{ backgroundColor: index <= currentStoryIndex ? 'white' : 'rgba(255,255,255,0.3)' }}
                  />
                ))}
              </div>
              <div className="flex items-center p-4">
                <div className="flex items-center">
                  <div onClick={() => navigate(`/user/${currentUser.userData.username}`)} className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
                    <img src={currentUser.userData.profilePicture.toString()} alt={currentUser.userData.username} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <div className='flex items-center gap-1'>
                      <span onClick={() => navigate(`/user/${currentUser.userData.username}`)} className="font-medium text-sm">{currentUser.userData.username}</span>
                      {
                        currentUser.userData.isVerified.status && (
                          <VerificationIcon size={'16'} />
                        )
                      }
                    </div>
                    <span className="text-xs ml-2 opacity-75">{currentStory.createdAt.toString()}</span>
                  </div>
                </div>
                <FontAwesomeIcon icon={faEllipsis} className='hover:cursor-pointer ml-auto text-2xl' />
              </div>
            </div>

            <div className="flex-1 w-full">
              {
                currentStory.story.type === 'image' ? (
                  <div className="w-full h-full">
                    <img src={currentStory.story.url.toString()} alt="Story content" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-full h-full">
                    <video src={currentStory.story.url.toString()} autoPlay playsInline className="w-full h-full object-contain" />
                  </div>
                )
              }
            </div>

            {/* <div className="p-4 absolute bottom-0 left-0 right-0">
              <div className="flex items-center rounded-full border border-gray-600 px-4 py-2">
                <input
                  type="text"
                  placeholder={`Reply to ${currentUser.userData.username}...`}
                  className="bg-transparent dark:text-black outline-none flex-1"
                />
                <div className="ml-auto flex space-x-4">
                  <FontAwesomeIcon icon={faHeart} className='hover:cursor-pointer' />
                  <FontAwesomeIcon className="hover:cursor-pointer" icon={faPaperPlane} />
                </div>
              </div>
            </div> */}
          </div>

          {currentUserIndex < story.length - 1 || currentStoryIndex < currentUser.userStory.length - 1 ? (
            <button
              onClick={goToNextStory}
              className="text-4xl mx-4 w-5 h-5 rounded-full text-black bg-[#d9cdc2] hover:bg-opacity-60 cursor-pointer transition-colors flex items-center justify-center"
            >
              <ChevronRightIcon fontSize="medium" />
            </button>
          ) : <div className="w-5 mx-4"></div>}
        </div>
      </div>
    </div>
  );
};

export default StoryModal;
