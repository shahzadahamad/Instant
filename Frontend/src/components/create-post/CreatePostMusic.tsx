import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import { useRef, useState } from "react";

const CreatePostMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (audio.paused) {
        audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div>
      <audio id="audio" ref={audioRef} src="./way-down-we-go.mp3"></audio>
      <div className="w-[22.8rem] object-cover rounded-md border p-2 flex items-center justify-between">
        <div className="w-14 h-14 mr-10">
          <img
            src="./ney.jpg"
            className="w-full rounded-md h-full object-cover"
            alt=""
          />
        </div>
        <div className="flex items-center">
          <h1 className="mr-10">Way down we go</h1>
        </div>
        <div className="border p-2 rounded-full content-center cursor-pointer" onClick={handlePlay}>
          {isPlaying ? (
            <PauseIcon className="" />
          ) : (
            <PlayIcon className="" />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePostMusic;
