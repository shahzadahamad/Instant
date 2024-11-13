import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FollowDeitals, User, UserState } from "../../types/redux/userSlicetypes";
const initialState: UserState = {
  currentUser: null,
  followDetials: { follow: false, request: false },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
    },
    logout(state) {
      state.currentUser = null;
    },
    setFollowDetials(state, action: PayloadAction<FollowDeitals>) {
      state.followDetials = action.payload
    }
  },
});

export const { loginSuccess, logout, setFollowDetials } = userSlice.actions;

export default userSlice.reducer;
