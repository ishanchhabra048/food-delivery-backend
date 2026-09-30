import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "../lib/socket";
import api from "../lib/api";

export const useSocketOrder = (orderId) => {
  const queryClient = useQueryClient();
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [showDisconnectBanner, setShowDisconnectBanner] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const socket = getSocket();
    let disconnectTimer = null;
    let fallbackPollInterval = null;

    const handleConnect = () => {
      setIsSocketConnected(true);
      setShowDisconnectBanner(false);
      if (disconnectTimer) clearTimeout(disconnectTimer);
      if (fallbackPollInterval) clearInterval(fallbackPollInterval);
      socket.emit("join:order", { orderId });
    };

    const handleDisconnect = () => {
      setIsSocketConnected(false);
      disconnectTimer = setTimeout(() => {
        setShowDisconnectBanner(true);
        // Start 10s fallback polling
        fallbackPollInterval = setInterval(async () => {
          try {
            const res = await api.get(`/orders/${orderId}`);
            if (res.data) {
              queryClient.setQueryData(["order", orderId], res.data);
            }
          } catch {}
        }, 10000);
      }, 8000);
    };

    const handleStatusUpdate = (payload) => {
      if (payload.orderId === orderId) {
        queryClient.setQueryData(["order", orderId], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            status: payload.status,
            updatedAt: payload.updatedAt || new Date().toISOString(),
          };
        });
      }
    };

    if (socket.connected) {
      handleConnect();
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("order:status", handleStatusUpdate);

    return () => {
      if (disconnectTimer) clearTimeout(disconnectTimer);
      if (fallbackPollInterval) clearInterval(fallbackPollInterval);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("order:status", handleStatusUpdate);
    };
  }, [orderId, queryClient]);

  return { isSocketConnected, showDisconnectBanner };
};
