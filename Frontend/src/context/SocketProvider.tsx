import React, { useEffect, useState } from 'react';
import { socket } from "../socket/socket";
import { Socket } from 'socket.io-client';
import { SocketContext } from './SocketContext';
import { RootState } from '@/redux/store/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setCallerState } from '@/redux/slice/chatSlice';
import CallModal from '@/components/calls/CallModal';
import { SignalData } from 'simple-peer';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { callerDetials } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  const excludedRoutes = ["/login", "/signup", "/calls"];

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

      socket.on("callUser", handleCallUser);

      return () => {
        socket.off("callUser", handleCallUser);
        socket.disconnect();
      };
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    socket.on("endCall", () => {
      dispatch(setCallerState({ receivingCall: false, callerSocketId: "", callerSignal: null, callerId: "", isVideo: false, isViewModal: false }))
    })
  }, [dispatch]);

  return <SocketContext.Provider value={socketInstance}>
    {children}
    {callerDetials.isViewModal && !excludedRoutes.includes(location.pathname) && (
      <CallModal />
    )}
  </SocketContext.Provider>;
};
