import toast from "react-hot-toast";
import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";
import { useEffect, useRef, useState } from "react";
import { createMusicSchema } from "@/validations/authValidations";
import { AxiosError } from "axios";
import { adminApiClient } from "@/apis/apiClient";
import { Slider } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const AddMusicForm: React.FC<{ fetchMusic: (page: number) => void }> = ({
  fetchMusic,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const musicRef = useRef<HTMLInputElement | null>(null);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [musicFile, setMusicFile] = useState<File | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      const timeUpdateHandler = () => {
        setCurrentTime(audio.currentTime);
      };

      const loadedMetadataHandler = () => {
        setDuration(audio.duration);
      };

      const endedHandler = () => {
        setCurrentTime(0);
        setIsPlaying(false);
      };

      const pauseHandler = () => {
        setIsPlaying(false);
      };

      const playHandler = () => {
        setIsPlaying(true);
      };

      audio.addEventListener("timeupdate", timeUpdateHandler);
      audio.addEventListener("loadedmetadata", loadedMetadataHandler);
      audio.addEventListener("ended", endedHandler);
      audio.addEventListener("play", playHandler);
      audio.addEventListener("pause", pauseHandler);

      return () => {
        audio.removeEventListener("timeupdate", timeUpdateHandler);
        audio.removeEventListener("loadedmetadata", loadedMetadataHandler);
        audio.addEventListener("ended", endedHandler);
        audio.addEventListener("play", playHandler);
        audio.addEventListener("pause", pauseHandler);
      };
    }
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files.length === 1) {
      const file = files[0];

      const maxSizeInMB = 10;
      if (file.size > maxSizeInMB * 1024 * 1024) {
        toast.error(`File size must be less than ${maxSizeInMB}MB.`);
        return;
      }

      const allowedTypes = [
        "audio/mpeg",
        "audio/wav",
        "audio/ogg",
        "audio/aac",
        "audio/mp4",
        "audio/webm",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid format.");
        return;
      }

      const audioURL = URL.createObjectURL(file);
      const audio = new Audio(audioURL);

      audio.onloadedmetadata = () => {
        if (audio.duration > 60) {
          toast.error("File length must be less than or equal to 1 minute.");
          return;
        }
        setMusicFile(file);
        setSelectedFile(audioURL);
      };

      setIsPlaying(true);
      audio.load();
    } else {
      toast.error("Only one music allowed.");
    }
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleModalChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedFile("");
      setImage("");
      setTitle("");
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
    onOpenChange();
  };

  const handleChooseMusic = () => {
    if (musicRef.current) {
      musicRef.current.click();
    }
  };

  const handleChooseImage = () => {
    if (imageRef.current) {
      imageRef.current.click();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files.length === 1) {
      const file = files[0];

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp",
        "image/tiff",
        "image/svg+xml",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only images are allowed.");
        return;
      }

      const maxSizeInMB = 10;
      if (file.size > maxSizeInMB * 1024 * 1024) {
        toast.error(`File size must be less than ${maxSizeInMB}MB.`);
        return;
      }

      setImage(URL.createObjectURL(file));
    } else {
      toast.error("Please select one file to upload.");
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const parsed = createMusicSchema.safeParse({
      title,
    });
    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((err) => err.message);
      toast.error(errorMessages[0]);
      setLoading(false);
      return;
    }
    toast.dismiss();

    const formData = new FormData();

    if (!imageRef.current?.files || !imageRef.current.files[0]) {
      toast.error("Image is required.");
      setLoading(false);
      return;
    }

    if (!musicFile) {
      toast.error("Music is required.");
      setLoading(false);
      return;
    }

    formData.append("title", title);
    formData.append("image", imageRef.current.files[0]);
    formData.append("audio", musicFile);

    try {
      const response = await adminApiClient.post(
        `/music/create-music`,
        formData
      );
      fetchMusic(1);
      handleModalChange(false);
      setIsPlaying(false);
      setCurrentTime(0);
      toast.success(response.data.message);
      setLoading(false);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.log(error);
        const errorMsg = error.response.data?.error || "An error occurred";
        toast.error(errorMsg);
        setLoading(false);
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
        setLoading(false);
      }
    }
  };

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      if (audioRef.current) {
        audioRef.current.currentTime = newValue;
      }
      setCurrentTime(newValue);
    }
  };

  return (
    <>
      <Button variant="outline" className="mb-5" onClick={onOpen}>
        Add Music
      </Button>
      <Modal isOpen={isOpen} size="lg" onOpenChange={handleModalChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center border-1">
                Add Music
              </ModalHeader>
              <ModalBody className="p-8 border-1 w-full h-full flex flex-col gap-6">
                <div className="flex items-center">
                  <div className="w-20 h-20 rounded-md border overflow-hidden mr-4">
                    <img
                      src={image}
                      alt="Upload"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handleChooseImage}
                    className="border"
                  >
                    {image ? "Change image" : "Choose a image"}
                  </Button>
                  <input
                    ref={imageRef}
                    hidden
                    onChange={handleImageUpload}
                    type="file"
                    className="border rounded-md p-2 cursor-pointer"
                    accept="image/*"
                  />
                </div>
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex flex-col">
                    <label htmlFor="title" className="mb-2 text-sm font-medium">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter Title"
                      className="p-3 border outline-none bg-transparent shadow text-sm rounded-md"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="music" className="mb-2 text-sm font-medium">
                      Music
                    </label>
                    {selectedFile ? (
                      <div className="relative">
                        <audio
                          ref={audioRef}
                          id="audio"
                          src={selectedFile}
                          autoPlay={true}
                          preload="metadata"
                        ></audio>
                        <div className="flex items-center justify-start gap-10 border rounded-md p-5">
                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              className="w-12 h-12 flex items-center justify-center rounded-full border"
                              onClick={handlePlayPause}
                            >
                              {isPlaying ? <PauseIcon /> : <PlayIcon />}
                            </Button>
                            <div>
                              <span>
                                {formatTime(currentTime)} /{" "}
                                {formatTime(duration)}
                              </span>
                            </div>
                          </div>
                          <div className=" flex flex-col w-40">
                            <Slider
                              size="small"
                              valueLabelDisplay="off"
                              onChange={(e, newValue) =>
                                handleSliderChange(e, newValue)
                              }
                              value={currentTime}
                              max={duration}
                            />
                          </div>
                          <FontAwesomeIcon
                            onClick={() => {
                              setIsPlaying(false);
                              setCurrentTime(0);
                              setMusicFile(null);
                              setSelectedFile("");
                            }}
                            icon={faCircleXmark}
                            className="absolute rounded-full hover:opacity-70 transition-colors top-2 right-2 cursor-pointer"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          onClick={handleChooseMusic}
                          className="border w-1/2"
                        >
                          Choose a music
                        </Button>
                        <input
                          ref={musicRef}
                          type="file"
                          id="music"
                          onChange={handleFileChange}
                          hidden
                          className="border rounded-md p-2 cursor-pointer"
                          accept="audio/*"
                        />
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="ghost"
                    onClick={handleSubmit}
                    style={{ minWidth: "100px" }}
                    className={`border ${
                      loading && "opacity-60 cursor-not-allowed"
                    }`}
                  >
                    {loading ? <div className="spinner"></div> : "Submit"}
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddMusicForm;
