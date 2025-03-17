/* eslint-disable react-hooks/exhaustive-deps */
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
import { Slider } from "@mui/material";
import toast from "react-hot-toast";

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
  const [sliderValues, setSliderValues] = useState<{ [key: string]: number }>(
    {}
  );

  useEffect(() => {
    const currentAudio = audioRefs.current[currentlyPlayingIndex];
    if (currentAudio) {
      const updateSlider = () => {
        setSliderValues((prevValues) => ({
          ...prevValues,
          [currentlyPlayingIndex]: currentAudio.currentTime,
        }));
      };

      const endedHandler = () => {
        currentAudio.currentTime = 0;
        currentAudio.pause();
        setCurrentlyPlayingIndex("");
      };

      const pauseHandler = () => {
        currentAudio.pause();
        setCurrentlyPlayingIndex("");
      };

      const playHandler = () => {
        currentAudio.play();
        setCurrentlyPlayingIndex(currentlyPlayingIndex);
      };

      currentAudio.addEventListener("timeupdate", updateSlider);
      currentAudio.addEventListener("ended", endedHandler);
      currentAudio.addEventListener("play", playHandler);
      currentAudio.addEventListener("pause", pauseHandler);

      return () => {
        currentAudio.removeEventListener("timeupdate", updateSlider);
        currentAudio.addEventListener("ended", endedHandler);
        currentAudio.addEventListener("play", playHandler);
        currentAudio.addEventListener("pause", pauseHandler);
      };
    }
  }, [currentlyPlayingIndex]);

  const fetchMusic = async (id: string | boolean) => {
    try {
      if (id) {
        const response = await apiClient.get(
          `/user/music/get-selected-music-data/${id}`
        );
        if (response.data.message) {
          dispatch(removePostMusic());
          setCurrentlyPlayingIndex("");
          setSearchValue("");
          setSelectedMusic(null);
          setSliderValues({});
          return toast.error(response.data.message);
        }
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
      if (currentlyPlayingIndex) {
        const currentAudio = audioRefs.current[currentlyPlayingIndex];
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
        setCurrentlyPlayingIndex("");
      }
      setSliderValues((prevValues) => {
        const newValues: { [key: string]: number } = {};
        Object.keys(prevValues).forEach((key) => {
          newValues[key] = 0;
        });
        return newValues;
      });
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

  const handleSliderChange = (
    _: Event,
    newValue: number | number[],
    musicId: string
  ) => {
    setSliderValues((prevValues) => ({
      ...prevValues,
      [musicId]: newValue as number,
    }));

    const currentAudio = audioRefs.current[musicId];
    if (currentAudio) {
      currentAudio.currentTime = newValue as number;
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
                    } p-2 flex items-center justify-between gap-1`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14">
                        <img
                          src={music.image}
                          className="w-full rounded-md h-full object-cover"
                          alt=""
                        />
                      </div>
                      <h1>{music.title}</h1>
                    </div>
                    <div className=" flex items-center justify-center gap-2">
                      <div
                        className="w-20 flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Slider
                          size="small"
                          value={sliderValues[music._id] || 0}
                          onChange={(e, newValue) =>
                            handleSliderChange(e, newValue, music._id)
                          }
                          valueLabelDisplay="off"
                          max={audioRefs.current[music._id]?.duration}
                        />
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
                setSliderValues({});
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
