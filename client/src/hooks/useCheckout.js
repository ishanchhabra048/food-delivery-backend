import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../lib/api";

export const useCheckout = () => {
  const checkoutSummaryQuery = useQuery({
    queryKey: ["checkout-summary"],
    queryFn: async () => {
      const response = await api.get("/checkout");
      return response.data;
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async ({ addressId }) => {
      const response = await api.post("/orders", { addressId });
      return response.data;
    },
  });

  const createPaymentMutation = useMutation({
    mutationFn: async ({ orderId }) => {
      const response = await api.post("/payments/create", { orderId });
      return response.data;
    },
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: async ({ orderId }) => {
      const response = await api.get(`/payments/verify/${orderId}`);
      return response.data;
    },
  });

  return {
    summary: checkoutSummaryQuery.data,
    isLoadingSummary: checkoutSummaryQuery.isLoading,
    refetchSummary: checkoutSummaryQuery.refetch,
    createOrder: createOrderMutation.mutateAsync,
    isCreatingOrder: createOrderMutation.isPending,
    createPayment: createPaymentMutation.mutateAsync,
    isCreatingPayment: createPaymentMutation.isPending,
    verifyPayment: verifyPaymentMutation.mutateAsync,
    isVerifyingPayment: verifyPaymentMutation.isPending,
  };
};
