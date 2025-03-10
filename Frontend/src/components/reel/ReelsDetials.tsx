import { checkHasUserLikedThePost, getReels, likeAndDisLikePost, watchedPostAdd } from "@/apis/api/userApi";
import { newReelsPush, setReels, setReelTotalPage, updateLikeCount } from "@/redux/slice/postSlice";
import { RootState } from "@/redux/store/store";
import { faComment, faHeart, faPaperPlane } from "@fortawesome/free-regular-svg-icons"
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons"
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AxiosError } from "axios";
import { Volume2, VolumeOff } from "lucide-react"
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PostModal from "../common/PostViewModal/PostModal";
import VerificationIcon from "../common/svg/VerificationIcon";
import SharePostModal from "../common/SharePostModal";

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
  const { reels, reelTotalPage } = useSelector((state: RootState) => state.post);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [page, setPage] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [mainPost, setMainPost] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);

  const fetchReels = async (load: boolean, page: number, status: boolean) => {
    try {
      const reelData = await getReels(reelId as string, page, status);
      if (load) {
        dispatch(setReels(reelData.reels));
        dispatch(setReelTotalPage(reelData.totalPage));
        setPage(1);
        navigate(`/reels/${reelData.reels[0]._id}`);
      } else {
        return reelData;
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error.response.data?.error || "An error occurred");
        navigate('/error?message=Page not found.&statusCode=404');
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    let watchTimer: NodeJS.Timeout | null = null;

    const markReelAsWatched = async (reelId: string) => {
      try {
        await watchedPostAdd(reelId);
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          console.error(error.response.data?.error || "An error occurred");
        } else {
          console.error("Unexpected error:", error);
          toast.error("An unexpected error occurred");
        }
      }
    };

    if (reels.length > 0 && reels[currentVideoIndex]) {
      watchTimer = setTimeout(() => {
        markReelAsWatched(reels[currentVideoIndex]._id);
      }, 3000);
    }

    return () => {
      if (watchTimer) {
        clearTimeout(watchTimer);
      }
    };
  }, [currentVideoIndex, reels]);

  useEffect(() => {
    if (reels.length <= 0) {
      fetchReels(true, page, false);
    }
  }, [reelId, page, dispatch, navigate, reels.length]);

  useEffect(() => {
    const checkHasuserLikedCurrentPost = async (id: string) => {
      const response = await checkHasUserLikedThePost(id);
      setIsLiked(response);
    };
    if (reels.length > 0 && reels[currentVideoIndex]) {
      checkHasuserLikedCurrentPost(reels[currentVideoIndex]._id);
    }
    return () => { };
  }, [reels, currentVideoIndex]);


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
    const handleSpacebar = (event: KeyboardEvent) => {

      if (mainPost) {
        return;
      }

      if (event.key === " " || event.code === "Space") {
        event.preventDefault();

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
      }
    };

    window.addEventListener("keydown", handleSpacebar);
    return () => {
      window.removeEventListener("keydown", handleSpacebar);
    };
  }, [currentVideoIndex, play, mainPost]);


  useEffect(() => {

    const handleNavigation = async (direction: "up" | "down") => {

      if (mainPost) {
        return;
      }

      if (scrolling) return;
      setScrolling(true);

      const newIndex = direction === "down"
        ? Math.min(currentVideoIndex + 1, reels.length - 1)
        : Math.max(currentVideoIndex - 1, 0);

      if (newIndex !== currentVideoIndex) {
        const prevVideo = videoRefs.current[currentVideoIndex];
        if (prevVideo) {
          prevVideo.pause();
          prevVideo.currentTime = 0;
        }

        setCurrentVideoIndex(newIndex);
        navigate(`/reels/${reels[newIndex]._id}`);

        if (newIndex === reels.length - 1 && page < reelTotalPage) {
          const newReels = await fetchReels(false, page + 1, true);
          if (newReels.reels && newReels.reels.length > 0) {
            dispatch(newReelsPush(newReels.reels));
            dispatch(setReelTotalPage(newReels.totalPage));
            setPage(prev => prev + 1);
          }
        }
      }

      setTimeout(() => setScrolling(false), 300);
    };

    const handleScroll = (event: WheelEvent) => {
      if (event.deltaY > 0) {
        handleNavigation("down");
      } else {
        handleNavigation("up");
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        handleNavigation("down");
      } else if (event.key === "ArrowUp") {
        handleNavigation("up");
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleScroll);
      window.addEventListener("keydown", handleKeyDown);

      const preventPageScroll = (e: Event) => e.preventDefault();
      document.body.style.overflow = "hidden";
      container.addEventListener("touchmove", preventPageScroll, { passive: false });

      return () => {
        container.removeEventListener("wheel", handleScroll);
        window.removeEventListener("keydown", handleKeyDown);
        container.removeEventListener("touchmove", preventPageScroll);
        document.body.style.overflow = "auto";
      };
    }
  }, [reels, scrolling, currentVideoIndex, reelTotalPage, page, navigate, dispatch, mainPost]);

  useEffect(() => {
    setShowFullCaption(false);
    if (videoRefs.current[currentVideoIndex]) {
      setPlay(true);
      videoRefs.current[currentVideoIndex].play();
    }
  }, [currentVideoIndex]);

  const handleLikeAndUnlikePost = async () => {
    const reelId = reels[currentVideoIndex]._id;
    const action = isLiked ? "dislike" : "like";
    await likeAndDisLikePost(reelId, action);
    setIsLiked(!isLiked);
    const index = reels.findIndex(reel => reel._id === reelId);
    if (index !== -1) {
      dispatch(updateLikeCount({ index, actionType: action }));
    }
  };

  const closeModal = (status: boolean = false) => {
    setMainPost(false);
    if (status) {
      navigate(`/reels/${reels[currentVideoIndex]._id}`);
    } else {
      navigate(`/reels/${reels[currentVideoIndex]._id}`);
    }
  };

  const closeWhileTouchOutsideModal = () => {
    setMainPost(false);
    navigate(`/reels/${reels[currentVideoIndex]._id}`);
  }

  const toggleCaption = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowFullCaption(!showFullCaption);
  };

  const handleShareModal = () => {
    setShareModalOpen((prev) => !prev);
  };

  return (
    <>
      {(mainPost) && (
        <PostModal
          post={[reels[currentVideoIndex]]}
          imageIndex={0}
          close={closeModal}
          closeWhileTouchOutsideModal={closeWhileTouchOutsideModal}
        />
      )}
      {
        shareModalOpen && (
          <SharePostModal
            postId={reels[currentVideoIndex]._id}
            shareModalOpen={shareModalOpen}
            handleShareModal={handleShareModal}
          />
        )
      }
      <div ref={containerRef} className='w-full h-screen scrollbar-hidden'>
        {reels.map((reel, index) => (
          <div
            className="w-full h-full flex flex-col transition-transform duration-500 ease-in-out"
            style={{ transform: `translateY(-${currentVideoIndex * 100}%)` }}
          >
            <div key={reel._id} className="w-full h-full flex items-center justify-center gap-4">
              <div onClick={handleVideoClick} className="w-1/3 h-[95%] border rounded-lg relative cursor-pointer" style={{
                filter: `
                  contrast(${reel.post[0].customFilter.contrast}%)
                  brightness(${reel.post[0].customFilter.brightness}%)
                  saturate(${reel.post[0].customFilter.saturation}%)
                  sepia(${reel.post[0].customFilter.sepia}%)
                  grayscale(${reel.post[0].customFilter.grayScale}%)
                `,
              }}>
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  muted={muted}
                  src={reel.post[0].url}
                  autoPlay={index === currentVideoIndex}
                  playsInline
                  className={`${reel.post[0].filterClass} object-contain w-full h-full`}
                />
                <button onClick={handleMuteToggle} className="absolute right-2 top-2 w-8 h-8 rounded-full flex items-center justify-center text-white bg-[#2c2c2c] bg-opacity-75 cursor-pointer z-10">
                  {
                    muted ? <VolumeOff size={20} strokeWidth={3} /> : <Volume2 size={20} strokeWidth={3} />
                  }
                </button>
                {
                  !play && (
                    <button
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-20 h-20 text-3xl rounded-full flex items-center justify-center bg-[#000000] bg-opacity-30 cursor-pointer">
                        <FontAwesomeIcon className="hover:cursor-pointer" icon={faPlay} />
                      </div>
                    </button>
                  )
                }

                <div className="absolute bottom-5 left-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div onClick={() => {
                      if (currentUser?._id === reel.userId._id) {
                        navigate('/profile')
                      } else {
                        navigate(`/user/${reel.userId.username}`)
                      }
                    }} className="w-8 h-8">
                      <img
                        src={reel.userId.profilePicture.toString()}
                        className="w-full h-full rounded-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <p onClick={() => {
                        if (currentUser?._id === reel.userId._id) {
                          navigate('/profile')
                        } else {
                          navigate(`/user/${reel.userId.username}`)
                        }
                      }} className="font-semibold text-sm text-white">{reel.userId.username}</p>
                      {
                        reel.userId.isVerified.status && (
                          <VerificationIcon size={'16'} />
                        )
                      }
                    </div>
                  </div>
                  <p className="text-white text-sm w-[90%] font-normal">
                    {showFullCaption ? reel.caption : reel.caption.length > 0 ? `${reel.caption.slice(0, 30)}` : ""}
                    {reel.caption.length > 20 && (
                      <button onClick={(e) => toggleCaption(e)} className="text-[#c8c2c2] font-semibold">
                        {showFullCaption ? "less" : "... more"}
                      </button>
                    )}
                  </p>
                </div>
              </div>
              <div className="dark:text-white text-black flex flex-col gap-8 text-[28px] h-[95%] justify-end pb-10">
                <div className="flex flex-col gap-1 items-center">
                  <FontAwesomeIcon
                    onClick={handleLikeAndUnlikePost}
                    className={`${isLiked ? "text-[#ff3040]" : "text-white hover:opacity-70"
                      } hover:cursor-pointer transition-colors`}
                    icon={isLiked ? faHeartSolid : faHeart}
                  />
                  {
                    (currentUser?._id.toString() === reels[currentVideoIndex].userId._id.toString() || !reels[currentVideoIndex].hideLikeAndView) && (
                      <p className="text-sm font-semibold">{reel.likeCount}</p>
                    )
                  }
                </div>
                <div onClick={() => {
                  setPlay(false);
                  const video = videoRefs.current[currentVideoIndex];
                  video?.pause();
                  setMainPost(true);
                  window.history.pushState(
                    null,
                    "",
                    `/post/${reel._id}`
                  );
                }} className="flex flex-col gap-1 items-center">
                  <FontAwesomeIcon className="hover:cursor-pointer" icon={faComment} />
                  <p className="text-sm font-semibold">{reel.commentCount}</p>
                </div>
                {
                  !reels[currentVideoIndex].userId.isPrivateAccount && (
                    <div className="pt-1">
                      <FontAwesomeIcon
                        onClick={() => setShareModalOpen(true)}
                        className="hover:cursor-pointer"
                        icon={faPaperPlane}
                      />
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default ReelsDetials
