import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export const useRestaurants = (params = {}) => {
  return useQuery({
    queryKey: ["restaurants", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.search) searchParams.append("search", params.search);
      if (params.cuisine && params.cuisine !== "all" && params.cuisine !== "All") {
        searchParams.append("cuisine", params.cuisine);
      }
      if (params.isOpen !== undefined) searchParams.append("isOpen", params.isOpen);
      if (params.page) searchParams.append("page", params.page);
      if (params.limit) searchParams.append("limit", params.limit);
      if (params.sortBy) searchParams.append("sortBy", params.sortBy);
      if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);

      const response = await api.get(`/restaurants?${searchParams.toString()}`);
      return response.data;
    },
  });
};
