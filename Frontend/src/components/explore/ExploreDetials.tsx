import { getHomePagePostData } from "@/apis/api/userApi";
import { IPostWithUserData } from "@/types/create-post/create-post";
import { faComment, faHeart, faPlay } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Reel from "../common/svg/Reel";
import PostModal from "../common/PostViewModal/PostModal";
import { useNavigate } from "react-router-dom";

const ExploreDetials = () => {

  const [page, setPage] = useState(1);
  const [postData, setPostData] = useState<IPostWithUserData[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const navigate = useNavigate();
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const fetchPostData = async (page: number, status: boolean) => {
    try {
      const postData = await getHomePagePostData(page);
      if (status) {
        setPostData(postData.post);
        setTotalPage(postData.totalPage);
        setPage(1);
      } else {
        return postData
      }
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
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && page < totalPage) {
          const newPosts = await fetchPostData(page + 1, false);
          if (newPosts.post && newPosts.post.length > 0) {
            setPostData((prevData) => [...prevData, ...newPosts.post]);
            setTotalPage(newPosts.totalPage);
            setPage(prev => prev + 1);
          }
        }
      },
      { threshold: 1.0 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [page, totalPage]);

  useEffect(() => {
    if (postData.length <= 0) {
      fetchPostData(page, true);
    }
  }, [page, postData.length]);

  const closeModal = (status: boolean = false) => {
    setSelectedPost(null);
    if (status) {
      navigate("/explore");
    }
  };

  const closeWhileTouchOutsideModal = () => {
    setSelectedPost(null);
    navigate('/explore');
  }

  return (
    <div className='w-full overflow-auto scrollbar-hidden'>
      <div className="flex flex-wrap items-center justify-start gap-2 px-[82px] p-10">
        {(selectedPost || selectedPost === 0) && (
          <PostModal
            post={postData}
            imageIndex={selectedPost}
            close={closeModal}
            closeWhileTouchOutsideModal={closeWhileTouchOutsideModal}
          />
        )}
        {postData.map((item, index) => (
          <>
            <div
              key={item._id}
              className="relative group"
              onClick={() => {
                setSelectedPost(index);
                if (item.post.length > 1) {
                  window.history.pushState(
                    null,
                    "",
                    `/post/${item._id}/?img_index=0`
                  );
                } else {
                  window.history.pushState(null, "", `/post/${item._id}`);
                }
              }}
            >
              {item.post[0].type === "video" || item.post[0].type === 'reel' ? (
                <div
                  key={item._id}
                  className=" w-80 h-80 cursor-pointer transition-opacity hover:opacity-60"
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
                    src={item.post[0].url}
                    className={`rounded w-full h-full object-cover ${item.post[0].filterClass}`}
                  />
                </div>
              ) : (
                <div
                  key={item._id}
                  className=" w-80 h-80 cursor-pointer transition-opacity hover:opacity-60"
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
                    alt={`Post`}
                    className={`rounded w-full h-full object-cover ${item.post[0].filterClass}`}
                  />
                </div>
              )}

              {item.post.length > 1 && (
                <div className="absolute top-1 right-1 group-hover:opacity-60 transition-opacity text-white p-1">
                  <svg
                    aria-label="Carousel"
                    className="x1lliihq x1n2onr6 x9bdzbf"
                    fill="currentColor"
                    height="20"
                    role="img"
                    viewBox="0 0 48 48"
                    width="20"
                  >
                    <title>Carousel</title>
                    <path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1 1.1 2.4 1.8 4.1 1.8h13.4c5.7 0 10.3-4.6 10.3-10.3V18.5c0-1.6-.7-3.1-1.8-4.1-.5-.4-1.2 0-1.2.6z"></path>
                  </svg>
                </div>
              )}

              {item.post[0].type === "video" && (
                <div className="absolute top-1 right-1 group-hover:opacity-60 transition-opacity text-white px-1">
                  <FontAwesomeIcon icon={faPlay} />
                </div>
              )}

              {item.post[0].type === "reel" && (
                <div className="absolute top-2 right-1 group-hover:opacity-60 transition-opacity text-white px-1">
                  <Reel size={"17"} />
                </div>
              )}

              <div className="absolute flex gap-5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                <div className="flex gap-2 text-white">
                  <FontAwesomeIcon icon={faHeart} className="text-xl" />
                  <h1 className="font-bold text-sm">{item.likeCount}</h1>
                </div>
                <div className="flex gap-2 text-white">
                  <FontAwesomeIcon icon={faComment} className="text-xl" />
                  <h1 className="font-bold text-sm">{item.commentCount}</h1>
                </div>
              </div>
            </div>
          </>
        ))}
        {page < totalPage && (
          <div ref={loadingRef} className="text-center my-4">
            <p className="spinner"></p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExploreDetials
