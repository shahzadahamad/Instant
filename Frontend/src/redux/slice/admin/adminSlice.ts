import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Admin, AdminState } from "@/types/redux/adminSlicetypes";

const initialState: AdminState = {
  currentAdmin: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    AdminLoginSuccess(state, action: PayloadAction<Admin>) {
      state.currentAdmin = action.payload;
    },
    AdminLogout(state) {
      state.currentAdmin = null;
    },
  },
});

export const { AdminLoginSuccess, AdminLogout } = adminSlice.actions;

export default adminSlice.reducer;
