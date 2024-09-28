import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Admin, AdminState } from "@/types/redux/adminSlicetypes";

const initialState: AdminState = {
  currentAdmin: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    adminLoginSuccess(state, action: PayloadAction<Admin>) {
      state.currentAdmin = action.payload;
    },
    adminLogout(state) {
      state.currentAdmin = null;
    },
  },
});

export const { adminLoginSuccess, adminLogout } = adminSlice.actions;

export default adminSlice.reducer;
