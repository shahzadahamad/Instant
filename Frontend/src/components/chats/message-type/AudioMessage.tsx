import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import { Slider } from "@mui/material";
import MessageProfile from "../MessageProfile";
import MessageMenu from "./MessageMenu";
import { MessageData } from "@/types/chat/chat";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

const AudioMessage: React.FC<{ message: MessageData }> = ({ message }) => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (isFinite(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
      }
    };

    const endedHandler = () => {
      audio.currentTime = 0;
      setIsPlaying(false);
      audio.pause();
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", endedHandler);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", endedHandler);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (!audioRef.current) return;
    const newTime = Array.isArray(newValue) ? newValue[0] : newValue;
    if (isFinite(newTime)) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className={`relative flex items-center group ${message.senderId._id === currentUser?._id ? "justify-end gap-3 px-3 pb-7" : "gap-2 px-3 pb-7"}`}>
      {message.senderId._id !== currentUser?._id && <MessageProfile user={message.senderId} />}
      {message.senderId._id === currentUser?._id && (
        <MessageMenu data={{ messageId: message._id, date: message.createdAt }} value={message.senderId._id !== currentUser?._id} />
      )}

      <div className="w-48 flex items-center justify-start gap-5 border rounded-2xl p-3">
        <audio ref={audioRef} src={message.message} />
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="w-8 h-8 p-0 flex items-center justify-center rounded-full border" onClick={togglePlay}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </Button>
          <span className="text-sm">
            {formatTime(currentTime)}
          </span>
        </div>
        <div className="flex flex-col w-20">
          <Slider
            size="small"
            value={currentTime || 0}
            min={0}
            max={audioRef.current?.duration}
            valueLabelDisplay="off"
            onChange={handleSliderChange}
          />
        </div>
      </div>

      {message.senderId._id !== currentUser?._id && (
        <MessageMenu data={{ messageId: message._id, date: message.createdAt }} value={message.senderId._id !== currentUser?._id} />
      )}
    </div>
  );
};

export default AudioMessage;
