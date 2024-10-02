import apiClient from "@/apis/apiClient";
import { removePostMusic, setPostMusic } from "@/redux/slice/postSlice";
import { RootState } from "@/redux/store/store";
import {
  GetCreatePostMusicData,
  GetSelectMusicData,
} from "@/types/create-post/create-post";
import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";

const CreatePostMusic = () => {
  const dispatch = useDispatch();
  const { musicId } = useSelector((state: RootState) => state.post);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const [searchVal, setSearchValue] = useState("");
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] =
    useState<string>("");
  const [music, setMusic] = useState<GetCreatePostMusicData[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<GetSelectMusicData | null>(
    null
  );
  const [totalMusic, setTotalMusic] = useState(0);

  const fetchMusic = async (id: string | boolean) => {
    try {
      if (id) {
        const response = await apiClient.get(
          `/user/music/create-post/get-selected-music-data/${id}`
        );
        setSelectedMusic(response.data);
      } else {
        const response = await apiClient.get(
          `/user/music/create-post/get-data/?searchVal=${searchVal}`
        );
        setMusic(response.data.musicData);
        setTotalMusic(response.data.totalMusic);
      }
    } catch (error) {
      console.error("Error fetching music:", error);
    }
  };

  useEffect(() => {
    if (musicId) {
      fetchMusic(musicId);
    } else {
      fetchMusic(false);
    }
  }, [musicId, searchVal]);

  const handlePlayPause = (
    e: React.MouseEvent<HTMLDivElement>,
    musicId: string
  ) => {
    e.stopPropagation();
    const currentAudio = audioRefs.current[musicId];

    if (currentAudio) {
      if (currentlyPlayingIndex !== null && currentlyPlayingIndex !== musicId) {
        const currentlyPlayingAudio = audioRefs.current[currentlyPlayingIndex];
        if (currentlyPlayingAudio) {
          currentlyPlayingAudio.pause();
          currentlyPlayingAudio.currentTime = 0;
        }
      }

      if (currentAudio.paused) {
        currentAudio.play();
        setCurrentlyPlayingIndex(musicId);
      } else {
        currentAudio.pause();
        setCurrentlyPlayingIndex("");
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {totalMusic > 0 ? (
        <>
          {!selectedMusic && (
            <input
              type="text"
              value={searchVal}
              className="p-3 w-[22.5rem] border outline-none bg-transparent shadow text-sm rounded-md"
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search"
            />
          )}

          {!musicId && music.length > 0
            ? music.map((music) => (
                <div key={music._id}>
                  <audio
                    id="audio"
                    ref={(el) => (audioRefs.current[music._id] = el)}
                    src={music.music}
                  ></audio>
                  <div
                    onClick={() => {
                      dispatch(
                        setPostMusic({
                          music: music._id,
                        })
                      );
                    }}
                    className={`w-[22.5rem] cursor-pointer object-cover rounded-md border ${
                      music._id === musicId &&
                      "border-1 border-black dark:border-white"
                    } p-2 flex items-center justify-between`}
                  >
                    <div className="w-14 h-14 mr-10">
                      <img
                        src={music.image}
                        className="w-full rounded-md h-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="flex-1">
                      <h1>{music.title}</h1>
                    </div>
                    <div
                      className="border p-2 rounded-full content-center cursor-pointer"
                      onClick={(e) => handlePlayPause(e, music._id)}
                    >
                      {currentlyPlayingIndex === music._id ? (
                        <PauseIcon className="" />
                      ) : (
                        <PlayIcon className="" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            : !musicId && <h1>No results found.</h1>}
        </>
      ) : (
        !musicId && <h1>Music not available.</h1>
      )}
      {selectedMusic && musicId === selectedMusic._id && (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-52 h-52">
              <img
                src={selectedMusic.image}
                className="w-full rounded-md h-full object-cover"
                alt=""
              />
            </div>
            <h1 className="text-center w-72">{selectedMusic.title}</h1>
            <Button
              variant="outline"
              onClick={() => {
                dispatch(removePostMusic());
                setCurrentlyPlayingIndex("");
                setSearchValue("");
                setSelectedMusic(null);
              }}
            >
              Change
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePostMusic;
