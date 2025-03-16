import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_SOCKET_URL!;

console.log(URL);

export const socket = io(URL, {
  auth: { token: localStorage.getItem("token") },
  reconnection: true,
  withCredentials: true,
  autoConnect: false,
  reconnectionAttempts: 10,
  reconnectionDelay: 5000
});