import {
  faHeart,
  faPaperPlane,
  faComment,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IPostWithUserData } from "@/types/create-post/create-post";
import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { useRef, useState } from "react";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import SharePostModal from "../common/SharePostModal";

const PostLowerSection: React.FC<{ postData: IPostWithUserData, setSelectedPost: (item: IPostWithUserData, index: number) => void, index: number, handleLikeAndUnlikePost: (postId: string) => void }> = ({ postData, setSelectedPost, index, handleLikeAndUnlikePost }) => {

  const { currentUser } = useSelector((state: RootState) => state.user);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const postRef = useRef<HTMLDivElement>(null);

  const handleShareModal = () => {
    setShareModalOpen((prev) => !prev);
  };

  return (
    <>
      {shareModalOpen && (
        <SharePostModal
          postId={postData._id}
          shareModalOpen={shareModalOpen}
          handleShareModal={handleShareModal}
        />
      )}
      <div ref={postRef} className="rounded flex flex-col py-3">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <div className="flex gap-3 text-2xl">
              <FontAwesomeIcon
                onClick={() => handleLikeAndUnlikePost(postData._id)}
                className={`${postData.isLiked ? "text-[#ff3040]" : "text-white hover:opacity-70"
                  } hover:cursor-pointer transition-colors`}
                icon={postData.isLiked ? faHeartSolid : faHeart}
              />
              <FontAwesomeIcon onClick={() => {
                setSelectedPost(postData, index);
                window.history.pushState(null, "", `/post/${postData._id}`);
              }} className="hover:cursor-pointer" icon={faComment} />
              <FontAwesomeIcon
                onClick={() => setShareModalOpen(true)}
                className="hover:cursor-pointer"
                icon={faPaperPlane}
              />
            </div>
            {postData.likeCount > 0 ? (
              <div className="flex items-center transition-all">
                {(currentUser?._id.toString() === postData.userId._id.toString() || !postData.hideLikeAndView) && (
                  <p className="text-xs">
                    {postData.likeCount} {postData.likeCount <= 1 ? "like" : "likes"}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center transition-all">
                <p className="text-xs">
                  Be the first to{" "}
                  <span className="hover:text-gray-500 cursor-pointer">like this</span>{" "}
                </p>
              </div>
            )}
          </div>
          {postData.commentCount > 0 && (
            <p className="text-xs">
              {postData.commentCount} {postData.commentCount <= 1 ? "comment" : "comments"}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default PostLowerSection;
