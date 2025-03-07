import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';

export const socket = io(URL, {
  auth: { token: localStorage.getItem("token") },
  reconnection: true,
  withCredentials: true,
  autoConnect: false,
  reconnectionAttempts: 10,
  reconnectionDelay: 5000
});