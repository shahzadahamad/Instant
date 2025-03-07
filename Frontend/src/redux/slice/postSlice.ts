import { PostState } from "@/types/create-post/create-post";
import { createSlice } from "@reduxjs/toolkit";

const initialState: PostState = {
  post: [],
  postIndex: -1,
  musicId: "",
  aspectRatio: null,
  postHoverFilterClass: "",
  postType: "",
  reels: [],
  reelTotalPage: 1,
  isStory: false,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPost(state, action) {
      state.post = action.payload;
    },
    onHoverUpFilter(state, action) {
      state.postHoverFilterClass = action.payload;
    },
    onHoverOutFilter(state, action) {
      state.postHoverFilterClass = action.payload;
    },
    setPostFilterClass(state, action) {
      state.post[action.payload.postIndex].filterClass =
        action.payload.filter;
    },
    setCustomFilters(state, action) {
      state.post[action.payload.postIndex].customFilter[
        action.payload.index
      ].value = action.payload.newValue;
    },
    setStateDefualt(state) {
      state.post = [];
      state.postIndex = -1;
      state.musicId = "";
      state.aspectRatio = null;
      state.postHoverFilterClass = "";
      state.isStory = false;
    },
    setPostMusic(state, action) {
      state.musicId = action.payload.music;
    },
    removePostMusic(state) {
      state.musicId = "";
    },
    removePost(state, action) {
      state.post.splice(action.payload, 1);
    },
    pushPost(state, action) {
      state.post.push(action.payload);
    },
    setAspectRatios(state, action) {
      state.aspectRatio = action.payload;
    },
    setPostType(state, action) {
      state.postType = action.payload;
    },
    pushTagUser(state, action) {
      const { index, id } = action.payload;
      state.post[index].tagUsers.push(id);
    },
    removeTagUser(state, action) {
      const { index, id } = action.payload;
      const newTaggedArray = state.post[index].tagUsers.filter(
        (item) => item !== id
      );
      state.post[index].tagUsers = newTaggedArray;
    },
    setPostIndex(state, action) {
      state.postIndex = action.payload;
    },
    setReels(state, action) {
      state.reels = action.payload;
    },
    setReelTotalPage(state, action) {
      state.reelTotalPage = action.payload;
    },
    newReelsPush(state, action) {
      state.reels = [...state.reels, ...action.payload];
    },
    updateLikeCount(state, action) {
      const { index, actionType } = action.payload;
      if (index >= 0 && index < state.reels.length) {
        if (actionType === 'like') {
          state.reels[index].likeCount++;
        } else {
          state.reels[index].likeCount--;
        }
      }
    },
    setStory(state) {
      state.isStory = true;
    },
  },
});

export const {
  onHoverUpFilter,
  removeTagUser,
  setPostType,
  setPostFilterClass,
  onHoverOutFilter,
  setAspectRatios,
  setPost,
  setCustomFilters,
  setPostIndex,
  pushTagUser,
  setPostMusic,
  removePostMusic,
  removePost,
  pushPost,
  setStateDefualt,
  setReels,
  newReelsPush,
  updateLikeCount,
  setReelTotalPage,
  setStory
} = postSlice.actions;

export default postSlice.reducer;
