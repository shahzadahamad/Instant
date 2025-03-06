import { PostUpdateFormData } from "@/types/profile/profile";
import apiClient from "../apiClient";
import { SubscriptionData } from "@/types/admin/subscription";

export const checkHasUserLikedThePost = async (postId: string) => {
  const response = await apiClient.get(
    `/user/post/has-user-liked-post/${postId}`
  );
  return response.data;
};

export const checkHasUserLikedTheComment = async (
  postId: string,
  commentIds: string
) => {
  const response = await apiClient.get(
    `/user/post/has-user-liked-comment/${postId}`,
    {
      params: {
        commentIds,
      },
    }
  );
  return response.data;
};

export const likeAndDisLikePost = async (postId: string, status: string) => {
  const response = await apiClient.patch(
    `/user/post/like-or-unlike/${postId}/${status}`
  );
  return response.data;
};

export const likeAndDisLikeComment = async (
  postId: string,
  commentId: string,
  status: string
) => {
  const response = await apiClient.patch(
    `/user/post/comment/like-or-unlike/${postId}/${commentId}/${status}`
  );
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get(`/user/get-current-user`);
  return response.data;
};

export const deletePost = async (postId: string) => {
  const response = await apiClient.delete(`/user/post/delete-post/${postId}`);
  return response.data;
};

export const archivePost = async (postId: string) => {
  const response = await apiClient.patch(`/user/post/archive/${postId}`);
  return response.data;
};

export const getPostData = async (postId: string) => {
  const response = await apiClient.get(`/user/post/get-post-data/${postId}`);
  return response.data;
};

export const editPostApi = async (
  postId: string,
  formData: PostUpdateFormData
) => {
  const response = await apiClient.patch(
    `/user/post/update-post/${postId}`,
    formData
  );
  return response.data;
};

export const getUserProfileDates = async (username: string) => {
  const response = await apiClient.get(
    `/user/get-user-data-by-username/${username}`
  );
  return response.data;
};

export const getUserDataById = async (userId: string) => {
  const response = await apiClient.get(
    `/user/data/${userId}`
  );
  return response.data;
};

export const commentPost = async (postId: string, comment: string) => {
  const response = await apiClient.post(`/user/post/comment/${postId}`, {
    comment,
  });
  return response.data.data;
};

export const commentReplyPost = async (
  postId: string,
  commentId: string,
  comment: string
) => {
  console.log(postId, commentId, comment);
  const response = await apiClient.post(
    `/user/post/reply-to-comment/${commentId}/${postId}`,
    {
      comment,
    }
  );
  return response.data.data;
};

export const getComments = async (postId: string) => {
  const response = await apiClient.get(`/user/post/get-comments/${postId}`);
  return response.data.commentData;
};

export const reportPost = async (reason: string, postId: string) => {
  const response = await apiClient.patch(
    `/user/post/report-post/${postId}`,
    null,
    {
      params: { reason },
    }
  );
  return response.data.message;
};

export const userExist = async (username: string) => {
  const response = await apiClient.get(`/user/check-user/${username}`);
  return response.data;
};

export const deleteComment = async (
  commentOrReplyId: string,
  actionFor: string
) => {
  const response = await apiClient.delete(
    `/user/post/comment-or-reply/${commentOrReplyId}/${actionFor}`
  );
  return response.data;
};

export const followUser = async (username: string) => {
  const response = await apiClient.post(`/user/follow/${username}`);
  return response.data;
};

export const acceptRequest = async (username: string) => {
  const response = await apiClient.patch(`/user/accept-equest/${username}`);
  return response.data;
};

export const unfollowUser = async (userId: string) => {
  const response = await apiClient.delete(`/user/unfollow/${userId}`);
  return response.data;
};

export const deleteRequest = async (username: string) => {
  const response = await apiClient.delete(`/user/friend-request/${username}`);
  return response.data;
};

export const followData = async (username: string) => {
  const response = await apiClient.get(`/user/follow-detials/${username}`);
  return response.data;
};

export const getUnreadNotificationCount = async () => {
  const response = await apiClient.get(`/user/notification-count`);
  return response.data.count;
};

export const getNotificationData = async () => {
  const response = await apiClient.get(`/user/notification`);
  return response.data;
};

export const getChatData = async (chatId: string) => {
  const response = await apiClient.get(`/user/chats/data/${chatId}`);
  return response.data;
}

export const createNewChat = async (formData: FormData) => {
  const response = await apiClient.post(`/user/chats/create`, formData);
  return response.data;
}

export const getChatList = async (type: string) => {
  const response = await apiClient.get(`/user/chats/list/${type}`);
  return response.data;
}

export const getSubsriptionPlans = async () => {
  const response = await apiClient.get(`/user/subscription`);
  return response.data;
}

export const createCheckoutSession = async (plan: SubscriptionData) => {
  const response = await apiClient.post(`/user/subscription/create-checkout-session`, plan);
  return response.data;
}

export const searchUser = async (search: string) => {
  const response = await apiClient.get(`/user/search-history/${search}`);
  return response.data;
}

export const searchHistory = async () => {
  const response = await apiClient.get(`/user/search-history`);
  return response.data;
}

export const addNewSearch = async (id: string) => {
  const response = await apiClient.post(`/user/search-history/add/${id}`);
  return response.data;
}

export const removeFromSearchHistory = async (id: string) => {
  const response = await apiClient.delete(`/user/search-history/${id}`);
  return response.data;
}

export const clearHistory = async () => {
  const response = await apiClient.delete(`/user/search-history/all`);
  return response.data;
}

export const getSinglePost = async (postId: string) => {
  const response = await apiClient.get(`/user/post/single/${postId}`);
  return response.data;
}

export const getReels = async (reelId: string, page: number, load: boolean) => {
  const response = await apiClient.get(`/user/post/reels-all`, {
    params: {
      reelId,
      page,
      load,
    }
  });
  return response.data;
}

export const getUserSeggestions = async (_id: string, user: boolean) => {
  const response = await apiClient.get(`/user/suggestion/${user}`, {
    params: {
      _id
    }
  });
  return response.data;
}

export const watchedPostAdd = async (postId: string) => {
  const response = await apiClient.patch(`/user/watched-post/${postId}`);
  return response.data;
}