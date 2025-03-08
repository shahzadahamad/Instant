import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PostLowerSection from "./PostLowerSection";
import { faEllipsis, faPlay } from "@fortawesome/free-solid-svg-icons";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { getLoadingPagePostData } from "@/apis/api/userApi";
import { IPostWithUserData } from "@/types/create-post/create-post";
import { Dot, Volume2, VolumeOff } from "lucide-react";
import { timeSince } from "@/helperFuntions/dateFormat";
import PostModal from "../common/PostViewModal/PostModal";
import { useNavigate } from "react-router-dom";

const Posts = () => {
  const [page, setPage] = useState(0);
  const [postData, setPostData] = useState<IPostWithUserData[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const navigate = useNavigate();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [muted, setMuted] = useState(true);
  const [play, setPlay] = useState(true);
  const [selectedPost, setSelectedPost] = useState<IPostWithUserData | null>(null);

  const fetchNotificationData = async (page: number) => {
    try {
      const postData = await getLoadingPagePostData(page);
      setPostData(postData.post);
      setTotalPage(postData.totalPage);
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

  useEffect(() => {
    if (postData.length <= 0) {
      fetchNotificationData(page);
    }
  }, [page, postData.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            setPlay(true);
            video.play();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [postData]);

  const handleMuteToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setMuted((prev) => !prev);
  };

  const handleVideoClick = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
      setPlay(!play)
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const closeModal = (status: boolean = false) => {
    setSelectedPost(null);
    if (status) {
      navigate("/");
    } else {
      navigate(`/`);
    }
  };

  const closeWhileTouchOutsideModal = () => {
    setSelectedPost(null);
    navigate(`/`);
  }

  const handleSelectedPost = (item: IPostWithUserData, index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
      setPlay(false);
    }
    setSelectedPost(item);
  }

  return (
    <div className="w-full h-[80vh] scrollbar-hidden">
      <div className="flex flex-col items-center justify-start gap-4 p-4">
        {postData.map((item, index) => (
          <div key={item._id} className={`w-[40%] flex items-center flex-col justify-center rounded-xl-lg ${index !== 0 && "border-t"}`}>
            <div className="w-full">
              {/* Post Header */}
              <div className="px-1 py-3 rounded flex gap-3 items-center">
                <div className="relative flex justify-between w-full items-center">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={item.userId.profilePicture.toString()}
                        alt="avatar"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <h2 className="font-bold text-medium">{item.userId.username}</h2>
                      <Dot />
                      <p className="text-gray-500 text-sm">{timeSince(item.createdAt)}</p>
                    </div>
                  </div>
                  <FontAwesomeIcon onClick={() => {
                    handleSelectedPost(item, index)
                    window.history.pushState(
                      null,
                      "",
                      `/post/${item._id}`
                    );
                  }} icon={faEllipsis} className="text-2xl cursor-pointer" />
                </div>
              </div>

              {(selectedPost) && (
                <PostModal
                  post={[selectedPost]}
                  imageIndex={0}
                  close={closeModal}
                  closeWhileTouchOutsideModal={closeWhileTouchOutsideModal}
                />
              )}

              {/* Post Content */}
              <div className="w-full border rounded-md">
                {item.post[0].type === "video" || item.post[0].type === "reel" ? (
                  <div
                    onClick={() => handleVideoClick(index)}
                    className={`relative w-full ${item.post[0].type === "reel" ? "h-[540px]" : "h-full"} border rounded-md`}
                    style={{
                      filter: `
                        contrast(${item.post[0].customFilter.contrast}%)
                        brightness(${item.post[0].customFilter.brightness}%)
                        saturate(${item.post[0].customFilter.saturation}%)
                        sepia(${item.post[0].customFilter.sepia}%)
                        grayscale(${item.post[0].customFilter.grayScale}%)
                      `,
                    }}
                  >
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      muted={muted}
                      src={item.post[0].url}
                      className={`${item.post[0].filterClass} object-contain rounded-md w-full h-full`}
                      loop
                      playsInline
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
                  </div>
                ) : (
                  <div
                    className="w-full h-full border-r rounded-md"
                    style={{
                      filter: `
                        contrast(${item.post[0].customFilter.contrast}%)
                        brightness(${item.post[0].customFilter.brightness}%)
                        saturate(${item.post[0].customFilter.saturation}%)
                        sepia(${item.post[0].customFilter.sepia}%)
                        grayscale(${item.post[0].customFilter.grayScale}%)
                      `,
                    }}
                  >
                    <img
                      src={item.post[0].url}
                      alt="Post"
                      className={`${item.post[0].filterClass} object-contain rounded-md w-full h-full`}
                    />
                  </div>
                )}
              </div>
              <PostLowerSection postData={item} setSelectedPost={handleSelectedPost} index={index} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
