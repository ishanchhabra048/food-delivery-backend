import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSocket } from "../lib/socket";
import api from "../lib/api";
import { toast } from "sonner";

export const useOwnerOrders = (restaurantId, params = {}) => {
  const queryClient = useQueryClient();
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [showDisconnectBanner, setShowDisconnectBanner] = useState(false);

  const ordersQuery = useQuery({
    queryKey: ["owner-orders", { restaurantId, ...params }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.status) searchParams.append("status", params.status);
      if (params.page) searchParams.append("page", params.page);
      if (params.limit) searchParams.append("limit", params.limit || 50);

      const response = await api.get(`/orders/restaurant?${searchParams.toString()}`);
      return response.data;
    },
    enabled: !!restaurantId,
  });

  useEffect(() => {
    if (!restaurantId) return;

    const socket = getSocket();
    let disconnectTimer = null;

    const handleConnect = () => {
      setIsSocketConnected(true);
      setShowDisconnectBanner(false);
      if (disconnectTimer) clearTimeout(disconnectTimer);
      socket.emit("join:restaurant", { restaurantId });
    };

    const handleDisconnect = () => {
      setIsSocketConnected(false);
      disconnectTimer = setTimeout(() => {
        setShowDisconnectBanner(true);
      }, 8000);
    };

    const handleNewOrder = (newOrder) => {
      toast.info(`🔔 New order #${newOrder._id.slice(-6).toUpperCase()} received!`);
      queryClient.setQueriesData({ queryKey: ["owner-orders"] }, (oldData) => {
        if (!oldData || !oldData.orders) return oldData;
        const exists = oldData.orders.some((o) => o._id === newOrder._id);
        if (exists) return oldData;
        return {
          ...oldData,
          orders: [newOrder, ...oldData.orders],
        };
      });
    };

    const handleStatusUpdate = (payload) => {
      queryClient.setQueriesData({ queryKey: ["owner-orders"] }, (oldData) => {
        if (!oldData || !oldData.orders) return oldData;
        return {
          ...oldData,
          orders: oldData.orders.map((order) =>
            order._id === payload.orderId ? { ...order, status: payload.status } : order
          ),
        };
      });
    };

    if (socket.connected) {
      handleConnect();
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("order:new", handleNewOrder);
    socket.on("order:status", handleStatusUpdate);

    return () => {
      if (disconnectTimer) clearTimeout(disconnectTimer);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("order:new", handleNewOrder);
      socket.off("order:status", handleStatusUpdate);
    };
  }, [restaurantId, queryClient]);

  return {
    ...ordersQuery,
    isSocketConnected,
    showDisconnectBanner,
  };
};
