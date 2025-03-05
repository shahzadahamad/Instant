import { getReels } from "@/apis/api/userApi";
import { setReels } from "@/redux/slice/postSlice";
import { RootState } from "@/redux/store/store";
import { faComment, faHeart, faPaperPlane } from "@fortawesome/free-regular-svg-icons"
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AxiosError } from "axios";
import { Volume2, VolumeOff } from "lucide-react"
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const ReelsDetials = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { reelId } = useParams();
  const [muted, setMuted] = useState(true);
  const [play, setPlay] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [scrolling, setScrolling] = useState(false);
  const { reels } = useSelector((state: RootState) => state.post);

  useEffect(() => {

    const fetchReels = async () => {
      try {
        const reelData = await getReels(reelId as string, 0);
        dispatch(setReels(reelData));
        navigate(`/reels/${reelData[0]._id}`)
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          console.error(error.response.data?.error || "An error occurred");
          toast.error(error.response.data?.error || "An error occurred");
        } else {
          console.error("Unexpected error:", error);
          toast.error("An unexpected error occurred");
        }
      }
    };

    if (reels.length <= 0) {
      fetchReels();
    }
  }, [reelId, reels.length, dispatch, navigate]);


  const handleVideoClick = () => {
    const video = videoRefs.current[currentVideoIndex];
    if (video) {
      if (video.paused) {
        video.play();
        setPlay(true);
      } else {
        video.pause();
        setPlay(false);
      }
    }
  };

  const handleMuteToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setMuted((prev) => !prev);
  };

  useEffect(() => {

    const handleScroll = (event: WheelEvent) => {
      if (scrolling) return;
      setScrolling(true);

      const newIndex = event.deltaY > 0
        ? Math.min(currentVideoIndex + 1, reels.length - 1)
        : Math.max(currentVideoIndex - 1, 0);

      if (newIndex !== currentVideoIndex) {
        const prevVideo = videoRefs.current[currentVideoIndex];
        if (prevVideo) {
          prevVideo.pause();
          prevVideo.currentTime = 0;
        }
        setCurrentVideoIndex(newIndex);
      }

      const newReelId = reels[newIndex]._id;
      navigate(`/reels/${newReelId}`);

      if (newIndex === reels.length - 1) {
        dispatch(setReels([]))
      }

      setTimeout(() => setScrolling(false), 300);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleScroll);

      const preventPageScroll = (e: Event) => e.preventDefault();
      document.body.style.overflow = "hidden";
      container.addEventListener("touchmove", preventPageScroll, { passive: false });

      return () => {
        container.removeEventListener("wheel", handleScroll);
        container.removeEventListener("touchmove", preventPageScroll);
        document.body.style.overflow = "auto";
      };
    }
  }, [reels, scrolling, currentVideoIndex, reels.length, navigate, dispatch]);

  useEffect(() => {
    if (videoRefs.current[currentVideoIndex]) {
      setPlay(true);
      videoRefs.current[currentVideoIndex].play();
    }
  }, [currentVideoIndex]);

  return (
    <div ref={containerRef} className='w-full h-screen scrollbar-hidden'>
      <div
        className="w-full h-full flex flex-col transition-transform duration-500 ease-in-out"
        style={{ transform: `translateY(-${currentVideoIndex * 100}%)` }}
      >
        {reels.map((reel, index) => (
          <div key={index} className="w-full h-full flex items-center justify-center gap-4">
            <div onClick={handleVideoClick} className="w-1/3 h-[95%] border rounded-lg relative cursor-pointer">
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                muted={muted}
                src={reel.post[0].url}
                autoPlay
                playsInline
                className={`object-contain w-full h-full`}
              />
              <button onClick={handleMuteToggle} className="absolute right-2 top-2 w-8 h-8 rounded-full flex items-center justify-center bg-[#2c2c2c] bg-opacity-75 cursor-pointer z-10">
                {
                  muted ? <VolumeOff size={20} strokeWidth={3} /> : <Volume2 size={20} strokeWidth={3} />
                }
              </button>
              {
                !play && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlay(true);
                      if (videoRefs.current[currentVideoIndex]) {
                        videoRefs.current[currentVideoIndex].play();
                      }
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-20 h-20 text-3xl rounded-full flex items-center justify-center bg-[#000000] bg-opacity-30 cursor-pointer">
                      <FontAwesomeIcon className="hover:cursor-pointer" icon={faPlay} />
                    </div>
                  </button>
                )
              }
            </div>
            <div className="text-white flex flex-col gap-8 text-[28px] h-[95%] justify-end pb-10">
              <div className="flex flex-col gap-1 items-center">
                <FontAwesomeIcon className="hover:cursor-pointer" icon={faHeart} />
                <p className="text-sm font-semibold">{reel.likeCount}</p>
              </div>
              <div className="flex flex-col gap-1 items-center">
                <FontAwesomeIcon className="hover:cursor-pointer" icon={faComment} />
                <p className="text-sm font-semibold">{reel.commentCount}</p>
              </div>
              <div className="pt-2">
                <FontAwesomeIcon
                  className="hover:cursor-pointer"
                  icon={faPaperPlane}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReelsDetials
