import React, { useEffect, useState } from 'react';
import { socket } from "../socket/socket";
import { Socket } from 'socket.io-client';
import { SocketContext } from './SocketContext';
import { RootState } from '@/redux/store/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setCallerState } from '@/redux/slice/chatSlice';
import CallModal from '@/components/calls/CallModal';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { callerDetials } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  useEffect(() => {

    if (currentUser) {
      setSocketInstance(socket);

      socket.auth = { token: localStorage.getItem("token") };
      socket.connect();

      socket.on("callUser", (data) => {
        dispatch(setCallerState({ receivingCall: true, callerSocketId: data.from, callerSignal: data.signal, callerId: data.userId, isVideo: data.isVideo, isViewModal: true }))
      });
    }

    return () => {
      socket.off("callUser");
      socket.disconnect();
    };
  }, [currentUser, dispatch]);

  return <SocketContext.Provider value={socketInstance}>
    {children}
    {/* Render the CallModal if receiving a call */}
    {callerDetials.isViewModal && (
      <CallModal />
    )}
  </SocketContext.Provider>;
};
