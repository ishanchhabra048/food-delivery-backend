import { io } from "socket.io-client";

let socketInstance = null;

export const getSocket = () => {
  if (!socketInstance) {
    let serverUrl = window.location.origin;
    if (import.meta.env.VITE_SOCKET_URL) {
      serverUrl = import.meta.env.VITE_SOCKET_URL;
    } else if (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.startsWith("http")) {
      try {
        serverUrl = new URL(import.meta.env.VITE_API_BASE_URL).origin;
      } catch (e) {
        serverUrl = window.location.origin;
      }
    }

    socketInstance = io(serverUrl, {
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
