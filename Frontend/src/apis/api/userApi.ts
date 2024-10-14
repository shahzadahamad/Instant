import apiClient from "../apiClient";

export const checkHasUserLikedThePost = async (postId: string) => {
  const response = await apiClient.get(
    `/user/post/has-user-liked-post/${postId}`
  );
  return response.data;
};

export const likeAndDisLikePost = async (postId: string, status: string) => {
  const response = await apiClient.patch(
    `/user/post/like-or-unlike/${postId}/${status}`
  );
  return response.data;
};
