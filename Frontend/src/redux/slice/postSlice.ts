import { PostState } from "@/types/create-post/create-post";
import { createSlice } from "@reduxjs/toolkit";

const initialState: PostState = {
  post: [],
  postIndex: -1,
  musicId: "",
  aspectRatio: null,
  postHoverFilterClass: "",
  postType: "",
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
      state.post[action.payload.postIndex].postFilterClass =
        action.payload.filter;
    },
    setCustomFilters(state, action) {
      state.post[action.payload.postIndex].customFilter[
        action.payload.index
      ].value = action.payload.newValue;
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
    setPostIndex(state, action) {
      state.postIndex = action.payload;
    },
  },
});

export const {
  onHoverUpFilter,
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
} = postSlice.actions;

export default postSlice.reducer;
