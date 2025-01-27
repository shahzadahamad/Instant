import { ChatDatas } from "@/types/redux/chatSlice";
import { createSlice } from "@reduxjs/toolkit";
const initialState: ChatDatas = {
  chatList: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatList(state, action) {
      state.chatList = action.payload;
    },
    updatelastMessage(state, action) {
      const { _id, lastMessage } = action.payload;
      const chat = state.chatList.find((chat) => chat._id.toString() === _id.toString());
      if (chat) {
        chat.lastMessage = lastMessage;
      }
    },
    updateUserOnlineStatus(state, action) {
      const { userId, status } = action.payload;
      const chat = state.chatList.find((chat) =>
        chat.members.some(member => member._id.toString() === userId.toString())
      );
      if (chat) {
        const memberIndex = chat.members.find(
          member => member._id.toString() === userId.toString()
        );

        if (memberIndex) {
          memberIndex.isOnline = status;
        }
      }
    }
  },
});

export const { setChatList, updatelastMessage, updateUserOnlineStatus } = chatSlice.actions;

export default chatSlice.reducer;
