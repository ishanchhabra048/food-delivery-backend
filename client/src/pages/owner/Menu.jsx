import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, UtensilsCrossed, AlertTriangle } from "lucide-react";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { MenuItemForm } from "../../components/owner/MenuItemForm";
import { EmptyState } from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import { formatCurrency } from "../../lib/utils";
import { toast } from "sonner";

export const Menu = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // 1. Fetch owner's restaurant
  const { data: restData } = useQuery({
    queryKey: ["owner-restaurants"],
    queryFn: async () => {
      const response = await api.get("/restaurants?limit=100");
      const list = response.data?.restaurants || [];
      return list.filter((r) => (r.owner?._id || r.owner) === user?._id);
    },
    enabled: !!user?._id,
  });

  const restaurant = (restData || [])[0];

  // 2. Fetch food items for this restaurant
  const { data: foodsData, isLoading } = useQuery({
    queryKey: ["foods", { restaurantId: restaurant?._id }],
    queryFn: async () => {
      const response = await api.get(`/foods?restaurantId=${restaurant._id}&limit=100`);
      return response.data?.foods || [];
    },
    enabled: !!restaurant?._id,
  });

  const foods = foodsData || [];

  // 3. Save / Update Food Mutation
  const saveFoodMutation = useMutation({
    mutationFn: async (data) => {
      if (editingItem?._id) {
        const response = await api.patch(`/foods/${editingItem._id}`, data);
        return response.data;
      } else {
        const response = await api.post("/foods", {
          ...data,
          restaurantId: restaurant._id,
        });
        return response.data;
      }
    },
    onSuccess: () => {
      toast.success(editingItem ? "Menu item updated" : "Menu item added");
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      setModalOpen(false);
      setEditingItem(null);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to save item");
    },
  });

  // 4. Toggle Availability Mutation
  const toggleAvailableMutation = useMutation({
    mutationFn: async ({ id, isAvailable }) => {
      const response = await api.patch(`/foods/${id}`, { isAvailable });
      return response.data;
    },
    onSuccess: (updated) => {
      toast.success(
        updated.isAvailable ? "Item marked In-Stock" : "Item marked Sold Out"
      );
      queryClient.invalidateQueries({ queryKey: ["foods"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update item availability");
    },
  });

  // 5. Delete Food Mutation
  const deleteFoodMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/foods/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Dish deleted from menu");
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      setDeleteConfirmId(null);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete item");
    },
  });

  if (!restaurant) {
    return (
      <div className="py-12 text-center">
        <EmptyState
          title="Create a restaurant first"
          description="You must list your restaurant before configuring its food menu."
          actionText="Create Restaurant"
          actionTo="/owner/restaurant"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Menu Manager"
        subtitle={`Manage dishes, pricing, photos, and live availability for ${restaurant.name}.`}
        actions={
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setEditingItem(null);
              setModalOpen(true);
            }}
            iconLeft={Plus}
          >
            Add Menu Item
          </Button>
        }
      />

      {/* Food Items Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
      ) : foods.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="Your menu is currently empty"
          description="Add your first specialty dish with photo and pricing to start taking orders."
          actionText="Add Menu Item"
          onAction={() => {
            setEditingItem(null);
            setModalOpen(true);
          }}
          className="my-8"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {foods.map((food) => (
            <div
              key={food._id}
              className="bg-surface rounded-xl border border-border p-4 shadow-sm flex items-start justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-surface-muted border border-border overflow-hidden shrink-0">
                  <img
                    src={food.image?.url || "/placeholders/food.svg"}
                    alt={food.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-fg">{food.name}</h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-muted text-fg-2 border border-border">
                      {food.category}
                    </span>
                  </div>
                  <p className="font-bold text-primary text-xs font-mono mt-0.5">
                    {formatCurrency(food.price)}
                  </p>
                  <p className="text-[11px] text-fg-3 line-clamp-1 max-w-xs mt-1">
                    {food.description || "No description provided"}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditingItem(food);
                      setModalOpen(true);
                    }}
                    className="p-1.5 rounded-md text-fg-2 hover:text-fg hover:bg-surface-muted"
                    title="Edit item"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(food._id)}
                    className="p-1.5 rounded-md text-fg-3 hover:text-danger hover:bg-red-50"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* In Stock toggle */}
                <button
                  onClick={() =>
                    toggleAvailableMutation.mutate({
                      id: food._id,
                      isAvailable: food.isAvailable === false ? true : false,
                    })
                  }
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                    food.isAvailable !== false
                      ? "bg-secondary/10 text-secondary border-secondary/30"
                      : "bg-red-50 text-danger border-red-200"
                  }`}
                >
                  {food.isAvailable !== false ? "In Stock" : "Sold Out"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        title={editingItem ? "Edit Dish Details" : "Add New Dish to Menu"}
        description="Enter recipe name, price in INR, category, and upload a tempting dish photo."
      >
        <MenuItemForm
          initialData={editingItem}
          onSubmit={(data) => saveFoodMutation.mutate(data)}
          onCancel={() => {
            setModalOpen(false);
            setEditingItem(null);
          }}
          loading={saveFoodMutation.isPending}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Remove dish from menu?"
        description="Are you sure you want to delete this menu item? Customers will no longer be able to order it."
      >
        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg text-red-900 text-xs my-4 border border-red-200">
          <AlertTriangle className="w-5 h-5 text-danger shrink-0" />
          <span>This action cannot be undone.</span>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            size="md"
            onClick={() => setDeleteConfirmId(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => deleteFoodMutation.mutate(deleteConfirmId)}
            loading={deleteFoodMutation.isPending}
          >
            Delete Item
          </Button>
        </div>
      </Modal>
    </div>
  );
};
