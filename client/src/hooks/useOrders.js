import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export const useOrders = (params = {}) => {
  return useQuery({
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
};
