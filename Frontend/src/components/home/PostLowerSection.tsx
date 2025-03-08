import {
  faHeart,
  faPaperPlane,
  faComment,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IPostWithUserData } from "@/types/create-post/create-post";
import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";

const PostLowerSection: React.FC<{ postData: IPostWithUserData, setSelectedPost: (item: IPostWithUserData, index: number) => void, index: number }> = ({ postData, setSelectedPost, index }) => {

  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <div className="rounded flex flex-col py-3">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <div className="flex gap-3 text-2xl">
            <FontAwesomeIcon className="hover:cursor-pointer" icon={faHeart} />
            <FontAwesomeIcon onClick={() => {
              setSelectedPost(postData, index)
              window.history.pushState(
                null,
                "",
                `/post/${postData._id}`
              );
            }} className="hover:cursor-pointer" icon={faComment} />
            <FontAwesomeIcon
              className="hover:cursor-pointer"
              icon={faPaperPlane}
            />
          </div>
          {postData.likeCount > 0 ? (
            <div className="flex items-center transition-all">
              {currentUser?._id === postData.userId._id || !postData.hideLikeAndView && (
                <p className="text-xs">
                  {postData.likeCount}{" "}
                  {postData.likeCount <= 1 ? "like" : "likes"}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center transition-all">
              <p className="text-xs">
                Be the first to{" "}
                <span
                  className="hover:text-gray-500 cursor-pointer"
                >
                  like this
                </span>{" "}
              </p>
            </div>
          )}
        </div>
        {
          (postData.commentCount > 0) && (
            <p className="text-xs">
              {postData.commentCount}{" "}
              {postData.commentCount <= 1 ? "comment" : "comments"}
            </p>
          )
        }
      </div>
    </div>
  );
};

export default PostLowerSection;
