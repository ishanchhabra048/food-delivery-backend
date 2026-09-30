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

    const token = localStorage.getItem("accessToken");

    socketInstance = io(serverUrl, {
      withCredentials: true,
      autoConnect: false,
      auth: { token },
      query: { token },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    socketInstance.on("connect_error", (err) => {
      console.warn("Socket connect_error:", err.message);
    });

    socketInstance.on("connect", () => {
      console.log("⚡ Socket.IO connected successfully to", serverUrl);
    });
  }
  return socketInstance;
};

export const connectSocket = (token) => {
  const socket = getSocket();
  const actualToken = token || localStorage.getItem("accessToken");
  if (actualToken) {
    socket.auth = { token: actualToken };
    socket.io.opts.query = { token: actualToken };
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
