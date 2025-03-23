import React, { useEffect, useState } from 'react';
import { socket } from "../socket/socket";
import { Socket } from 'socket.io-client';
import { SocketContext } from './SocketContext';
import { RootState } from '@/redux/store/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setCallerState, setGroupCall } from '@/redux/slice/chatSlice';
import CallModal from '@/components/calls/CallModal';
import { SignalData } from 'simple-peer';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { callerDetials, groupCall } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  const excludedRoutes = ["/login", "/signup", "/calls", "group-calls"];

  useEffect(() => {
    if (socket) {
      socket.on("disconnect", (reason) => {
        console.log("Disconnected from server:", reason);
        if (reason === "io server disconnect") {
          socket.connect();
        }
      });
    }

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);


  useEffect(() => {

    if (currentUser) {
      setSocketInstance(socket);

      socket.auth = { token: localStorage.getItem("token") };
      socket.connect();

      const handleCallUser = (data: { from: string, signal: SignalData, userId: string, isVideo: boolean }) => {
        dispatch(setCallerState({
          receivingCall: true,
          callerSocketId: data.from,
          callerSignal: data.signal,
          callerId: data.userId,
          isVideo: data.isVideo,
          isViewModal: true
        }));
      };

      const handleGroupCall = (data: { chatId: string, isVideo: boolean }) => {
        dispatch(setGroupCall({
          receivingCall: true,
          chatId: data.chatId,
          isVideo: data.isVideo,
          isViewModal: true,
        }))
      };

      socket.on("callUser", handleCallUser);
      socket.on("callGroup", handleGroupCall);

      return () => {
        socket.off("callUser", handleCallUser);
        socket.off("callGroup", handleGroupCall);
        socket.disconnect();
      };
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    const handleEndCall = () => {
      dispatch(setCallerState({
        receivingCall: false,
        callerSocketId: "",
        callerSignal: null,
        callerId: "",
        isVideo: false,
        isViewModal: false
      }));
    };

    const handleEndGroupCall = () => {
      dispatch(setGroupCall({
        receivingCall: false,
        chatId: "",
        isVideo: false,
        isViewModal: false
      }));
    };

    socket.on("endCall", handleEndCall);
    socket.on("endCallGroup", handleEndGroupCall);

    return () => {
      socket.off("endCall", handleEndCall);
      socket.off("endCallGroup", handleEndGroupCall);
    };
  }, [dispatch]);

  return <SocketContext.Provider value={socketInstance}>
    {children}
    {!excludedRoutes.includes(location.pathname) && (callerDetials.isViewModal || groupCall.isViewModal) && (
      <CallModal isGroupCall={groupCall.isViewModal} />
    )}
  </SocketContext.Provider>;
};
