import React from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Store,
  UtensilsCrossed,
  Receipt,
  Plus,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { StatusPill } from "../../components/ui/StatusPill";
import { EmptyState } from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import { formatCurrency } from "../../lib/utils";
import { toast } from "sonner";

export const OwnerDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. Fetch owner's restaurants
  const { data: restData, isLoading: loadingRest } = useQuery({
    queryKey: ["owner-restaurants"],
    queryFn: async () => {
      const response = await api.get("/restaurants?limit=100");
      // Find restaurants where owner is current user
      const list = response.data?.restaurants || [];
      return list.filter((r) => (r.owner?._id || r.owner) === user?._id);
    },
    enabled: !!user?._id,
  });

  const restaurants = restData || [];
  const primaryRestaurant = restaurants[0];

  // 2. Fetch owner's live orders
  const { data: ordersData, isLoading: loadingOrders } = useQuery({
    queryKey: ["owner-orders", { restaurantId: primaryRestaurant?._id }],
    queryFn: async () => {
      const response = await api.get("/orders/restaurant?limit=100");
      return response.data?.orders || [];
    },
    enabled: !!primaryRestaurant?._id,
  });

  // Toggle open/closed status
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isOpen }) => {
      const response = await api.patch(`/restaurants/${id}`, { isOpen });
      return response.data;
    },
    onSuccess: (updated) => {
      toast.success(
        updated.isOpen ? "Restaurant is now Open" : "Restaurant is now Closed"
      );
      queryClient.invalidateQueries({ queryKey: ["owner-restaurants"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update status");
    },
  });

  const orders = ordersData || [];
  const activeOrders = orders.filter(
    (o) => o.status !== "DELIVERED" && o.status !== "CANCELLED"
  );
  const totalRevenue = orders
    .filter((o) => o.status === "DELIVERED")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  if (loadingRest) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
      </div>
    );
  }

  // If owner has no restaurant yet -> Prominent empty state (LLD Section 5.2)
  if (restaurants.length === 0) {
    return (
      <div className="space-y-6 py-6">
        <PageHeader
          title="Kitchen Management Portal"
          subtitle="Welcome to your restaurant management dashboard."
        />

        <div className="bg-surface rounded-2xl border-2 border-dashed border-primary/30 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-sm">
            <Store className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-2xl text-fg">
            You haven't listed a restaurant yet
          </h3>
          <p className="text-sm text-fg-2 leading-relaxed max-w-md mx-auto">
            Set up your restaurant name, cuisine specialty, location, and upload a delicious banner image to start taking customer orders.
          </p>
          <Button
            to="/owner/restaurant"
            variant="primary"
            size="lg"
            iconLeft={Plus}
            className="shadow-md"
          >
            Create Your Restaurant Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Dashboard: ${primaryRestaurant.name}`}
        subtitle={`Specialty: ${primaryRestaurant.cuisine || "Multi-cuisine"} • ${primaryRestaurant.address}`}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant={primaryRestaurant.isOpen ? "secondary" : "outline"}
              size="sm"
              onClick={() =>
                toggleStatusMutation.mutate({
                  id: primaryRestaurant._id,
                  isOpen: !primaryRestaurant.isOpen,
                })
              }
              loading={toggleStatusMutation.isPending}
            >
              {primaryRestaurant.isOpen ? "🟢 Store Open" : "🔴 Store Closed"}
            </Button>

            <Button to="/owner/orders" variant="primary" size="sm" iconRight={ArrowRight}>
              Live Order Queue
            </Button>
          </div>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-surface rounded-xl border border-border p-5 shadow-card space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-fg-2">
            <span>Active Incoming Orders</span>
            <Receipt className="w-4 h-4 text-primary" />
          </div>
          <p className="font-display font-extrabold text-3xl text-fg">
            {activeOrders.length}
          </p>
          <p className="text-[11px] text-fg-3">Need preparation or dispatch</p>
        </div>

        <div className="bg-surface rounded-xl border border-border p-5 shadow-card space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-fg-2">
            <span>Delivered Feasts</span>
            <TrendingUp className="w-4 h-4 text-secondary" />
          </div>
          <p className="font-display font-extrabold text-3xl text-fg">
            {orders.filter((o) => o.status === "DELIVERED").length}
          </p>
          <p className="text-[11px] text-fg-3">Total fulfilled orders</p>
        </div>

        <div className="bg-surface rounded-xl border border-border p-5 shadow-card space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-fg-2">
            <span>Total Delivered Volume</span>
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <p className="font-display font-extrabold text-2xl sm:text-3xl text-primary font-mono">
            {formatCurrency(totalRevenue)}
          </p>
          <p className="text-[11px] text-fg-3">Gross fulfilled earnings</p>
        </div>
      </div>

      {/* Quick Actions & Recent Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <h3 className="font-display font-bold text-base text-fg">
              Recent Incoming Orders
            </h3>
            <Link to="/owner/orders" className="text-xs text-primary font-semibold hover:underline">
              View all ({orders.length}) →
            </Link>
          </div>

          {activeOrders.length === 0 ? (
            <div className="py-8 text-center text-xs text-fg-3">
              No active orders currently pending. New customer orders will chime here live!
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {activeOrders.slice(0, 4).map((order) => (
                <div key={order._id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-mono font-bold text-xs text-primary">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <p className="text-xs text-fg-2 mt-0.5">
                      {order.items?.length} items • {order.user?.fullName || "Customer"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusPill status={order.status} />
                    <span className="font-mono font-bold text-xs text-fg">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Management Shortcuts */}
        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-base text-fg border-b border-border/80 pb-3">
            Quick Actions
          </h3>

          <div className="space-y-3">
            <Link
              to="/owner/menu"
              className="flex items-center justify-between p-3 rounded-lg bg-surface-muted hover:bg-border/60 transition-colors border border-border"
            >
              <div className="flex items-center gap-2.5 text-xs font-semibold text-fg">
                <UtensilsCrossed className="w-4 h-4 text-primary" />
                <span>Manage Food Menu</span>
              </div>
              <ArrowRight className="w-4 h-4 text-fg-3" />
            </Link>

            <Link
              to="/owner/restaurant"
              className="flex items-center justify-between p-3 rounded-lg bg-surface-muted hover:bg-border/60 transition-colors border border-border"
            >
              <div className="flex items-center gap-2.5 text-xs font-semibold text-fg">
                <Store className="w-4 h-4 text-primary" />
                <span>Update Store Profile</span>
              </div>
              <ArrowRight className="w-4 h-4 text-fg-3" />
            </Link>

            <Link
              to={`/restaurants/${primaryRestaurant._id}`}
              className="flex items-center justify-between p-3 rounded-lg bg-surface-muted hover:bg-border/60 transition-colors border border-border"
            >
              <div className="flex items-center gap-2.5 text-xs font-semibold text-fg">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Preview Customer View</span>
              </div>
              <ArrowRight className="w-4 h-4 text-fg-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
