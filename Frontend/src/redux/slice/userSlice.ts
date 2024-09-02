import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "../../types/redux/userSlicetypes";
const initialState: UserState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<UserState>) {
      state.currentUser = action.payload.currentUser;
    },
    logout(state) {
      state.currentUser = null;
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;

export default userSlice.reducer;
