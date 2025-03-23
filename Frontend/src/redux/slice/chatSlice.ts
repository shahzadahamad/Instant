import { ChatDatas } from "@/types/redux/chatSlice";
import { createSlice } from "@reduxjs/toolkit";
const initialState: ChatDatas = {
  chatList: [],
  callerDetials: {
    receivingCall: false,
    callerSocketId: "",
    callerSignal: null,
    callerId: "",
    isVideo: false,
    isViewModal: false,
  },
  groupCall: {
    receivingCall: false,
    chatId: "",
    isVideo: false,
    isViewModal: false,
  }
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
        chat.updatedAt = new Date();
        state.chatList.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      }
    },
    updateUserOnlineStatus(state, action) {
      const { userId, isOnline } = action.payload;
      const chat = state.chatList.find((chat) =>
        chat.members.some(member => member._id.toString() === userId.toString())
      );
      if (chat) {
        const memberIndex = chat.members.find(
          member => member._id.toString() === userId.toString()
        );

        if (memberIndex) {
          memberIndex.isOnline = isOnline;
        }
      }
    },
    setCallerState(state, action) {
      state.callerDetials = action.payload;
    },
    setGroupCall(state, action) {
      state.groupCall = action.payload;
    },
    changeViewModal(state) {
      state.callerDetials.isViewModal = false;
    },
    changeViewModalGroup(state) {
      state.groupCall.isViewModal = false;
    }
  },
});

export const { setChatList, updatelastMessage, updateUserOnlineStatus, setCallerState, changeViewModal, setGroupCall, changeViewModalGroup } = chatSlice.actions;

export default chatSlice.reducer;
