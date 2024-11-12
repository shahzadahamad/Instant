import React, { useEffect, useState } from 'react';
import { socket } from "../socket/socket";
import { Socket } from 'socket.io-client';
import { SocketContext } from './SocketContext';
import { RootState } from '@/redux/store/store';
import { useSelector } from 'react-redux';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {

    if (currentUser) {
      setSocketInstance(socket);

      socket.auth = { token: localStorage.getItem("token") };
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, [currentUser]);

  return <SocketContext.Provider value={socketInstance}>{children}</SocketContext.Provider>;
};
