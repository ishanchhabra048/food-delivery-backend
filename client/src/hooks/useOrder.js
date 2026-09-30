import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export const useOrder = (orderId) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    },
    enabled: !!orderId,
  });
};
