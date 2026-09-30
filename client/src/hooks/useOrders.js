import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { getSocket } from "../lib/socket";

export const useOrders = (params = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["my-orders", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.status) searchParams.append("status", params.status);
      if (params.page) searchParams.append("page", params.page);
      if (params.limit) searchParams.append("limit", params.limit);

      const response = await api.get(`/orders?${searchParams.toString()}`);
      return response.data;
    },
  });

  useEffect(() => {
    const socket = getSocket();

    const handleStatusUpdate = (payload) => {
      queryClient.setQueriesData({ queryKey: ["my-orders"] }, (oldData) => {
        if (!oldData || !oldData.orders) return oldData;
        return {
          ...oldData,
          orders: oldData.orders.map((order) =>
            order._id === payload.orderId
              ? { ...order, status: payload.status, updatedAt: payload.updatedAt }
              : order
          ),
        };
      });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    };

    socket.on("order:status", handleStatusUpdate);

    return () => {
      socket.off("order:status", handleStatusUpdate);
    };
  }, [queryClient]);

  return query;
};
