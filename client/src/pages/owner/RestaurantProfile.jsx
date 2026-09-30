import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { PageHeader } from "../../components/ui/PageHeader";
import { RestaurantProfileForm } from "../../components/owner/RestaurantProfileForm";
import { Skeleton } from "../../components/ui/Skeleton";
import { toast } from "sonner";

export const RestaurantProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: restData, isLoading } = useQuery({
    queryKey: ["owner-restaurants"],
    queryFn: async () => {
      const response = await api.get("/restaurants?limit=100");
      const list = response.data?.restaurants || [];
      return list.filter((r) => (r.owner?._id || r.owner) === user?._id);
    },
    enabled: !!user?._id,
  });

  const restaurant = (restData || [])[0];

  const saveMutation = useMutation({
    mutationFn: async (formData) => {
      if (restaurant?._id) {
        const response = await api.patch(`/restaurants/${restaurant._id}`, formData);
        return response.data;
      } else {
        const response = await api.post("/restaurants", formData);
        return response.data;
      }
    },
    onSuccess: (saved) => {
      toast.success(
        restaurant ? "Restaurant profile updated" : "Restaurant created successfully!"
      );
      queryClient.invalidateQueries({ queryKey: ["owner-restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      navigate("/owner");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to save restaurant details");
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title={restaurant ? "Edit Restaurant Profile" : "Create Restaurant Profile"}
        subtitle="Configure your restaurant branding, cuisine specialty, address, and operating hours."
      />

      <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-card">
        <RestaurantProfileForm
          initialData={restaurant}
          onSubmit={(data) => saveMutation.mutate(data)}
          loading={saveMutation.isPending}
        />
      </div>
    </div>
  );
};
