import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import AddMusicForm from "./AddMusicForm";
import { GetMusicData } from "@/types/admin/music";
import { adminApiClient } from "@/apis/apiClient";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";
import { Slider } from "@mui/material";
import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import MusicAction from "./MusicAction";

const MusicDetialsTable = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [searchVal, setSearchVal] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalMusic, setTotalMusic] = useState(0);
  const [page, setPage] = useState(1);
  const [music, setMusic] = useState<GetMusicData[]>([]);
  const [viewMusicImage, setViewMusicImage] = useState<string | File>("");
  const isDisabled = page === totalPages;
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const [sliderValues, setSliderValues] = useState<{ [key: string]: number }>(
    {}
  );
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] =
    useState<string>("");

  const fetchMusic = async (page: number) => {
    try {
      const response = await adminApiClient.get(`/music/get-data`, {
        params: {
          page,
          search: searchVal,
        },
      });
      setMusic(response.data.music);
      setTotalPages(response.data.totalPages);
      setTotalMusic(response.data.totalMusic);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
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
    fetchMusic(page);
    return () => { };
  }, [page, searchVal]);

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
        currentAudio.removeEventListener("ended", endedHandler);
        currentAudio.removeEventListener("play", playHandler);
        currentAudio.removeEventListener("pause", pauseHandler);
      };
    }
  }, [currentlyPlayingIndex]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleModal = (musicImageUrl: string | File) => {
    setViewMusicImage(musicImageUrl);
    onOpen();
  };

  const handlePlayPause = (musicId: string) => {
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    setPage(1);
  };

  const handleSliderChange = (
    event: Event,
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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <>
      <Modal isOpen={isOpen} size="md" onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <>
                <ModalHeader className="flex flex-col gap-1 text-center border-1">
                  View Profile
                </ModalHeader>
                <ModalBody className="p-10 border-1 w-full h-full flex justify-center items-center">
                  <div className="w-[200px] h-[200px] rounded-md border overflow-hidden">
                    <img
                      src={
                        typeof viewMusicImage === "string" ? viewMusicImage : ""
                      }
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </ModalBody>
              </>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="h-[88vh] overflow-y-auto scrollbar-hidden">
        <div className="w-full p-10 pb-1 flex justify-between items-center">
          <div className="w-full max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchVal}
                onChange={handleSearchChange}
                className="w-full bg-transparent p-3 pr-10 border rounded-md shadow-sm focus:outline-none"
                name="search"
                placeholder="Search"
              />
              <button className="absolute right-2 top-1 p-2 transition-colors hover:text-blue-500 focus:outline-none">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>
          </div>
          <h1 className="text-lg font-semibold">Total Music : {totalMusic}</h1>
        </div>
        <div className="overflow--auto p-10">
          <AddMusicForm fetchMusic={fetchMusic} />
          {music.length > 0 ? (
            <table className="min-w-full">
              <thead className="border rounded-md">
                <tr>
                  <th className="py-3 px-4 text-left">Image</th>
                  <th className="py-3 px-4 text-left">Title</th>
                  <th className="py-3 px-4 text-left">Music</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Action</th>
                </tr>
              </thead>
              {music.map((music) => (
                <tbody key={music._id} className="border">
                  <tr className="">
                    <td className="py-2 px-4">
                      <div className="w-10 h-10 rounded-md border overflow-hidden cursor-pointer mr-4">
                        <img
                          onClick={() => handleModal(music.image)}
                          src={music.image}
                          alt="Upload"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-2 px-4">{music.title}</td>
                    <td className="py-2 px-4">
                      <div className="">
                        <audio
                          id="audio"
                          ref={(el) => (audioRefs.current[music._id] = el)}
                          src={music.music}
                        />
                        <div className="w-60 flex items-center justify-center gap-5 border rounded-md p-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              className="w-8 h-8 p-0 flex items-center justify-center rounded-full border"
                              onClick={() => handlePlayPause(music._id)}
                            >
                              {currentlyPlayingIndex === music._id ? (
                                <PauseIcon />
                              ) : (
                                <PlayIcon />
                              )}
                            </Button>
                            <div>
                              <span className="text-sm w-full">
                                {formatTime(
                                  audioRefs.current[music._id]?.currentTime || 0
                                )}{" "}
                                /{" "}
                                {formatTime(
                                  audioRefs.current[music._id]?.duration || 0
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col w-20">
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
                        </div>
                      </div>
                    </td>
                    <td
                      className={`py-2 px-4 ${music.isListed ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {music.isListed ? "Listed" : "Unlisted"}
                    </td>
                    <td className="py-2 px-4">
                      <MusicAction
                        id={music._id}
                        isListed={music.isListed}
                        title={music.title}
                        fetchMusic={fetchMusic}
                        page={page}
                        image={music.image}
                      />
                    </td>
                  </tr>
                </tbody>
              ))}
              <tfoot className="border">
                <tr>
                  <td className="py-2 px-4 font-bold" colSpan={5}>
                    <div className={`flex items-center ${!(totalMusic !== 0 && page === 1 && isDisabled) ? "justify-between" : "justify-end"}`}>
                      {!(totalMusic !== 0 && page === 1 && isDisabled) && (
                        <div className="flex gap-4">
                          <Button
                            disabled={page === 1}
                            onClick={handlePrevPage}
                            variant="outline"
                          >
                            &lt;&lt;
                          </Button>
                          <Button
                            disabled={isDisabled}
                            onClick={handleNextPage}
                            variant="outline"
                          >
                            &gt;&gt;
                          </Button>
                        </div>
                      )}
                      <h1 className="p-2 font-semibold">Total Music: {music.length}</h1>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          ) : totalMusic === 0 ? (
            <h1>User Not found in Database</h1>
          ) : (
            <h1>No search result</h1>
          )}
        </div>
      </div>
    </>
  );
};

export default MusicDetialsTable;
