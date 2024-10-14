import apiClient from "@/apis/apiClient";
import { GetUserPostData } from "@/types/profile/profile";
import {
  faUserCircle,
  faHeart as faHeartRegular,
} from "@fortawesome/free-regular-svg-icons";
import {
  faBorderAll,
  faComment,
  faHeart,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLayoutEffect, useState } from "react";
import PostModal from "../common/PostModal";
import { useNavigate } from "react-router-dom";

const ProfilePostSection = () => {
  const navigate = useNavigate();
  const [postData, setPostData] = useState<GetUserPostData[] | []>([]);
  const [activeTab, setActiveTab] = useState<"POSTS" | "TAGGED" | "LIKED">(
    "POSTS"
  );
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  useLayoutEffect(() => {
    const fetchUserData = async () => {
      const res = await apiClient.get(`/user/post/get-user-post-data`);
      setPostData(res.data);
    };
    fetchUserData();
  }, []);

  const closeModal = () => {
    setSelectedPost(null);
    navigate("/profile");
  };

  return (
    <div className="w-full">
      <div className="flex gap-10 transition-all text-xs p-4 items-center justify-center">
        <div
          className={`flex items-center gap-1 cursor-pointer ${
            activeTab === "POSTS"
              ? "font-bold border-b-1 py-1 dark:border-white border-black"
              : ""
          }`}
          onClick={() => setActiveTab("POSTS")}
        >
          <FontAwesomeIcon icon={faBorderAll} />
          <h1>POSTS</h1>
        </div>

        <div
          className={`flex items-center gap-1 cursor-pointer ${
            activeTab === "TAGGED"
              ? "font-bold border-b-1 py-1 dark:border-white border-black"
              : ""
          }`}
          onClick={() => setActiveTab("TAGGED")}
        >
          <FontAwesomeIcon icon={faUserCircle} />
          <h1>TAGGED</h1>
        </div>

        <div
          className={`flex items-center gap-1 cursor-pointer ${
            activeTab === "LIKED"
              ? "font-bold border-b-1 py-1 dark:border-white border-black"
              : ""
          }`}
          onClick={() => setActiveTab("LIKED")}
        >
          <FontAwesomeIcon icon={faHeartRegular} />
          <h1>LIKED</h1>
        </div>
      </div>
      {(selectedPost || selectedPost === 0) && (
        <PostModal
          post={postData}
          imageIndex={selectedPost}
          close={closeModal}
        />
      )}
      {postData.length > 0 ? (
        <div className="flex flex-wrap items-center justify-start gap-2 px-[82px] pb-5">
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
                {item.post[0].type === "video" ? (
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
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-5 p-10">
          <svg
            aria-label="When you share photos, they will appear on your profile."
            className="x1lliihq x1n2onr6 x5n08af"
            fill="currentColor"
            height="62"
            role="img"
            viewBox="0 0 96 96"
            width="62"
          >
            <title>
              When you share photos, they will appear on your profile.
            </title>
            <circle
              cx="48"
              cy="48"
              fill="none"
              r="47"
              stroke="currentColor"
              stroke-miterlimit="10"
              stroke-width="2"
            ></circle>
            <ellipse
              cx="48.002"
              cy="49.524"
              fill="none"
              rx="10.444"
              ry="10.476"
              stroke="currentColor"
              stroke-linejoin="round"
              stroke-width="2.095"
            ></ellipse>
            <path
              d="M63.994 69A8.02 8.02 0 0 0 72 60.968V39.456a8.023 8.023 0 0 0-8.01-8.035h-1.749a4.953 4.953 0 0 1-4.591-3.242C56.61 25.696 54.859 25 52.469 25h-8.983c-2.39 0-4.141.695-5.181 3.178a4.954 4.954 0 0 1-4.592 3.242H32.01a8.024 8.024 0 0 0-8.012 8.035v21.512A8.02 8.02 0 0 0 32.007 69Z"
              fill="none"
              stroke="currentColor"
              stroke-linejoin="round"
              stroke-width="2"
            ></path>
          </svg>
          <h1 className="font-extrabold text-3xl">Share photos</h1>
          <p>When you share photos, they will appear on your profile.</p>
          <p
            onClick={() => navigate("/create-post/image")}
            className="text-[#0085d4] cursor-pointer"
          >
            Share your first photo
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfilePostSection;
