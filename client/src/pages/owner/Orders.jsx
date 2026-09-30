import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Receipt, Radio, WifiOff } from "lucide-react";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useOwnerOrders } from "../../hooks/useOwnerOrders";
import { PageHeader } from "../../components/ui/PageHeader";
import { OwnerOrderRow } from "../../components/owner/OwnerOrderRow";
import { EmptyState } from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import { cn } from "../../lib/utils";
import { toast } from "sonner";

const statusFilterTabs = [
  { label: "Active Queue", value: "active" },
  { label: "All Orders", value: "all" },
  { label: "Placed", value: "PLACED" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Preparing", value: "PREPARING" },
  { label: "Out for Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export const OwnerOrders = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("active");

  // Fetch owner restaurant id
  const { data: restList } = useOwnerOrders(null); // or fetch restaurants
  const restaurantId = user?.restaurantId; // or lookup

  const {
    data: ordersData,
    isLoading,
    showDisconnectBanner,
  } = useOwnerOrders(restaurantId || "all");

  const advanceStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      return response.data;
    },
    onSuccess: (updatedOrder) => {
      toast.success(`Order advanced to ${updatedOrder.status}`);
      queryClient.invalidateQueries({ queryKey: ["owner-orders"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to advance order status");
    },
  });

  const allOrders = ordersData?.orders || [];

  const filteredOrders = allOrders.filter((order) => {
    if (selectedTab === "active") {
      return order.status !== "DELIVERED" && order.status !== "CANCELLED";
    }
    if (selectedTab === "all") return true;
    return order.status === selectedTab;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Order Queue"
        subtitle="Manage live orders in real-time. Advance preparation and dispatch statuses with one tap."
        badge={
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold border border-secondary/20">
            <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
            <span>Live Socket Connected</span>
          </div>
        }
      />

      {/* Socket disconnect alert banner */}
      {showDisconnectBanner && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs animate-in fade-in">
          <WifiOff className="w-4 h-4 text-warning shrink-0" />
          <span>
            Socket disconnected. Real-time notifications may be slightly delayed.
          </span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {statusFilterTabs.map((tab) => {
          const isActive = selectedTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setSelectedTab(tab.value)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface text-fg-2 border border-border hover:bg-surface-muted"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No orders found in this view"
          description="Incoming orders will automatically pop into your live queue via WebSockets."
          className="my-8"
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OwnerOrderRow
              key={order._id}
              order={order}
              onAdvanceStatus={(orderId, status) =>
                advanceStatusMutation.mutate({ orderId, status })
              }
              loading={advanceStatusMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
};
