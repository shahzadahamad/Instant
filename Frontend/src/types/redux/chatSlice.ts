import { SignalData } from "simple-peer";
import { ChatData } from "../chat/chat";

export interface ChatDatas {
  chatList: ChatData[] | [],
  callerDetials: {
    receivingCall: boolean,
    callerSocketId: string,
    callerSignal: null | SignalData
    callerId: string;
    isVideo: boolean;
    isViewModal: boolean;
  }
}