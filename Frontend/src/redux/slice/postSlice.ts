import { PostState } from "@/types/create-post/create-post";
import { createSlice } from "@reduxjs/toolkit";

const initialState: PostState = {
  post: [],
  postIndex: -1,
  postHoverFilterClass: "",
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
    setPostIndex(state, action) {
      state.postIndex = action.payload;
    },
  },
});

export const {
  onHoverUpFilter,
  setPostFilterClass,
  onHoverOutFilter,
  setPost,
  setCustomFilters,
  setPostIndex,
} = postSlice.actions;

export default postSlice.reducer;
