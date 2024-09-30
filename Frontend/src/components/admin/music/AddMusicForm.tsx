import toast from "react-hot-toast";
import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import { RotateCwIcon } from "lucide-react";
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

const AddMusicForm: React.FC<{ fetchMusic: (page: number) => void }> = ({
  fetchMusic,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
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

      audio.addEventListener("timeupdate", timeUpdateHandler);
      audio.addEventListener("loadedmetadata", loadedMetadataHandler);

      return () => {
        audio.removeEventListener("timeupdate", timeUpdateHandler);
        audio.removeEventListener("loadedmetadata", loadedMetadataHandler);
      };
    }
  }, [selectedFile]);

  useEffect(() => {
    if (selectedFile && audioRef.current) {
      const audioContext = new window.AudioContext();
      const analyzer = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyzer);
      analyzer.connect(audioContext.destination);
      analyzer.fftSize = 2048;

      audioContextRef.current = audioContext;
      analyzerRef.current = analyzer;

      visualize();

      return () => {
        audioContext.close();
        audioContextRef.current = null;
        analyzerRef.current = null;
      };
    }
  }, [selectedFile]);

  const visualize = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const analyzer = analyzerRef.current;

    if (!ctx || !analyzer) return;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    if (canvas) {
      const draw = () => {
        requestAnimationFrame(draw);
        analyzer.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 10;
        let barHeight;
        let x = 0;

        const r = 100;
        const g = 150;
        const b = 250;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = (dataArray[i] / 255) * canvas.height;

          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

          x += barWidth + 1;
        }
      };
      draw();
    }
  };

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

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
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

  return (
    <>
      <Button variant="outline" className="mb-5" onClick={onOpen}>
        Add Music
      </Button>
      <Modal isOpen={isOpen} size="2xl" onOpenChange={handleModalChange}>
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
                    Choose a image
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
                      <div className="">
                        <audio
                          ref={audioRef}
                          id="audio"
                          src={selectedFile}
                          preload="metadata"
                        ></audio>
                        <div className="flex items-center justify-between border rounded-md p-5">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              className="w-12 h-12 flex items-center justify-center rounded-full border"
                              onClick={handlePlayPause}
                            >
                              {isPlaying ? <PauseIcon /> : <PlayIcon />}
                            </Button>
                            <Button
                              variant="ghost"
                              className="w-12 h-12 flex items-center justify-center rounded-full border"
                              onClick={handleRestart}
                            >
                              <RotateCwIcon size={13} />
                            </Button>
                          </div>
                          <canvas
                            ref={canvasRef}
                            width={300}
                            height={50}
                            className="rounded-sm"
                          />
                          <div className="">
                            <span>
                              {formatTime(currentTime)} /{formatTime(duration)}
                            </span>
                          </div>
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
