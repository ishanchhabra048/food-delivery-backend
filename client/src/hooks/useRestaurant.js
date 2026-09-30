import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export const useRestaurant = (restaurantId) => {
  const restaurantQuery = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: async () => {
      const response = await api.get(`/restaurants/${restaurantId}`);
      return response.data;
    },
    enabled: !!restaurantId,
  });

  const foodsQuery = useQuery({
    queryKey: ["foods", { restaurantId }],
    queryFn: async () => {
      const response = await api.get(`/foods?restaurantId=${restaurantId}&limit=100`);
      return response.data?.foods || [];
    },
    enabled: !!restaurantId,
  });

  return {
    restaurant: restaurantQuery.data,
    foods: foodsQuery.data || [],
    isLoading: restaurantQuery.isLoading || foodsQuery.isLoading,
    isError: restaurantQuery.isError || foodsQuery.isError,
    error: restaurantQuery.error || foodsQuery.error,
  };
};
