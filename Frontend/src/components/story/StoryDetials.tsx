import { faHeart, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';

const InstagramStoriesUI = () => {
  // Sample data structure with users and their multiple stories
  const usersWithStories = [
    {
      id: 1,
      username: "jobinselvariose",
      avatar: "./avatar.png",
      timestamp: "58 m",
      stories: [
        { id: 101, imageUrl: "./avatar.png", timestamp: "58 m" },
        { id: 102, imageUrl: "./avatar.png", timestamp: "57 m" },
        { id: 103, imageUrl: "./avatar.png", timestamp: "55 m" }
      ]
    },
    {
      id: 2,
      username: "payindia",
      avatar: "./avatar.png",
      timestamp: "2 h",
      stories: [
        { id: 201, imageUrl: "./avatar.png", timestamp: "2 h" },
        { id: 202, imageUrl: "./avatar.png", timestamp: "1 h 50 m" }
      ]
    },
    {
      id: 3,
      username: "am_m_sss",
      avatar: "./avatar.png",
      timestamp: "1 h",
      stories: [
        { id: 301, imageUrl: "./avatar.png", timestamp: "1 h" }
      ]
    }
  ];

  // State to track current user and story indices
  const [currentUserIndex, setCurrentUserIndex] = useState(1); // Starting with payindia
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  // Get current user and current story
  const currentUser = usersWithStories[currentUserIndex];
  const currentStory = currentUser.stories[currentStoryIndex];

  // Handle navigation through stories and users
  const goToNextStory = () => {
    if (currentStoryIndex < currentUser.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      if (currentUserIndex < usersWithStories.length - 1) {
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
        const prevUser = usersWithStories[prevUserIndex];
        setCurrentUserIndex(prevUserIndex);
        setCurrentStoryIndex(prevUser.stories.length - 1);
      }
    }
  };

  const handleClose = () => {
    console.log("Close button clicked");
  };

  return (
    <div className="flex flex-col w-full h-screen relative">
      {/* Top bar with "Instant" text and close button */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center p-4">
        <div className="text-3xl font-bold">Instant</div>
        <button onClick={handleClose} className="text-2xl">✕</button>
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
              {currentUser.stories.map((story, index) => (
                <div
                  key={story.id}
                  className="h-1 flex-1 rounded-full"
                  style={{ backgroundColor: index <= currentStoryIndex ? 'white' : 'rgba(255,255,255,0.3)' }}
                />
              ))}
            </div>
            <div className="flex items-center p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img src={currentUser.avatar} alt={currentUser.username} className="w-full h-full object-cover" />
                </div>
                <div className="ml-2 text-white">
                  <span className="font-medium text-sm">{currentUser.username}</span>
                  <span className="text-xs ml-2 opacity-75">{currentStory.timestamp}</span>
                </div>
              </div>
              <div className="ml-auto text-white text-2xl">⋯</div>
            </div>
          </div>

          <div className="flex-1">
            <div className="w-full h-full">
              <img src={currentStory.imageUrl} alt="Story content" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="p-4 absolute bottom-0 left-0 right-0">
            <div className="flex items-center rounded-full border border-gray-600 px-4 py-2">
              <input
                type="text"
                placeholder={`Reply to ${currentUser.username}...`}
                className="bg-transparent text-white outline-none flex-1"
              />
              <div className="ml-auto flex space-x-4">
                <FontAwesomeIcon icon={faHeart} className='hover:cursor-pointer' />
                <FontAwesomeIcon className="hover:cursor-pointer" icon={faPaperPlane} />
              </div>
            </div>
          </div>
        </div>

        {currentUserIndex < usersWithStories.length - 1 || currentStoryIndex < currentUser.stories.length - 1 ? (
          <button
            onClick={goToNextStory}
            className="text-4xl mx-4 w-5 h-5 rounded-full text-black bg-[#d9cdc2] hover:bg-opacity-60 cursor-pointer transition-colors flex items-center justify-center"
          >
            <ChevronRightIcon fontSize="medium" />
          </button>
        ) : <div className="w-5 mx-4"></div>}
      </div>
    </div>
  );
};

export default InstagramStoriesUI;
