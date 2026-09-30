import { io } from "socket.io-client";

let socketInstance = null;

export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(window.location.origin, {
      withCredentials: true,
      autoConnect: false,
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socketInstance;
};

export const connectSocket = (token) => {
  const socket = getSocket();
  if (token) {
    socket.auth = { token };
  }
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};
