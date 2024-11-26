import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../slice/userSlice";
import adminReducer from "../slice/admin/adminSlice";
import postReducer from "../slice/postSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const userPersistConfig = {
  key: "user",
  storage,
  version: 1,
  blacklist: ["followDetials"],
};

const adminPersistConfig = {
  key: "admin",
  storage,
  version: 1,
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedAdminReducer = persistReducer(adminPersistConfig, adminReducer);

const rootReducer = combineReducers({
  user: persistedUserReducer, // This will be persisted
  admin: persistedAdminReducer, // This will be persisted
  post: postReducer, // This will not be persisted
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
export const persister = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
