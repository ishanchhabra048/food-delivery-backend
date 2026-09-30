import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Store,
  MapPin,
  Calendar,
  AlertTriangle,
  Receipt,
  Phone,
  Mail,
} from "lucide-react";
import { useOrder } from "../../hooks/useOrder";
import api from "../../lib/api";
import { PageHeader } from "../../components/ui/PageHeader";
import { OrderStatusTimeline } from "../../components/customer/OrderStatusTimeline";
import { StatusPill } from "../../components/ui/StatusPill";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Skeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import { formatCurrency, formatDate } from "../../lib/utils";
import { toast } from "sonner";

export const OrderDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data: order, isLoading, isError } = useOrder(id);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // Cancel order mutation
  const cancelMutation = useMutation({
    mutationFn: async () => {
      const response = await api.patch(`/orders/${id}/cancel`);
      return response.data;
    },
    onSuccess: (updatedOrder) => {
      toast.success("Order cancelled successfully");
      queryClient.setQueryData(["order", id], updatedOrder);
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      setCancelModalOpen(false);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to cancel order");
    },
  });

  if (isLoading) {
    return (
      <div className="container max-w-[1180px] mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container max-w-[1180px] mx-auto px-4 py-16 text-center">
        <EmptyState
          icon={Receipt}
          title="Order not found"
          description="We couldn't locate details for this order reference."
          actionText="Back to Orders"
          actionTo="/orders"
        />
      </div>
    );
  }

  const canCancel = order.status === "PLACED" || order.status === "CONFIRMED";
  const restaurantName = order.restaurant?.name || "Kitchen";

  return (
    <div className="container max-w-[1180px] mx-auto px-4 py-8 space-y-6">
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg-2 hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Orders</span>
      </Link>

      <PageHeader
        title={`Order #${order._id.slice(-6).toUpperCase()}`}
        subtitle={`Placed on ${formatDate(order.createdAt)} at ${restaurantName}`}
        badge={<StatusPill status={order.status} />}
        actions={
          canCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCancelModalOpen(true)}
              className="text-danger hover:text-danger hover:bg-red-50 border-danger/30 text-xs font-semibold"
            >
              Cancel Order
            </Button>
          )
        }
      />

      {/* Real-time Order Status Timeline */}
      <OrderStatusTimeline order={order} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pt-2">
        {/* Ordered Items Details */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border p-6 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-base text-fg border-b border-border/80 pb-3 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            <span>Items in Your Order</span>
          </h3>

          <div className="divide-y divide-border/60">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md bg-surface-muted border border-border overflow-hidden shrink-0">
                    <img
                      src={item.food?.image?.url || "/placeholders/food.svg"}
                      alt={item.food?.name || "Dish"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-fg">
                      {item.food?.name || "Dish Item"}
                    </h4>
                    <p className="text-xs text-fg-3">
                      Qty: {item.quantity} × {formatCurrency(item.price || item.food?.price || 0)}
                    </p>
                  </div>
                </div>

                <span className="font-mono font-bold text-sm text-fg">
                  {formatCurrency((item.price || item.food?.price || 0) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery & Summary Column */}
        <div className="space-y-6">
          {/* Delivery Address Card */}
          <div className="bg-surface rounded-xl border border-border p-5 shadow-sm space-y-3">
            <h4 className="font-display font-bold text-sm text-fg flex items-center gap-2 border-b border-border/60 pb-2.5">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Delivery Details</span>
            </h4>
            <p className="text-xs text-fg-2 leading-relaxed">
              {order.deliveryAddress || "Address details on file"}
            </p>
          </div>

          {/* Bill Calculation */}
          <div className="bg-surface rounded-xl border border-border p-5 shadow-sm space-y-3">
            <h4 className="font-display font-bold text-sm text-fg border-b border-border/60 pb-2.5">
              Payment Breakdown
            </h4>

            <div className="space-y-2 text-xs text-fg-2">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono font-medium text-fg">
                  {formatCurrency(order.itemTotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-mono font-medium text-fg">
                  {formatCurrency(order.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & GST (5%)</span>
                <span className="font-mono font-medium text-fg">
                  {formatCurrency(order.tax)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border/80 text-sm font-bold text-fg">
                <span>Total Paid</span>
                <span className="text-primary font-mono text-base">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel this order?"
        description="Are you sure you want to cancel your order? This action cannot be reversed."
      >
        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg text-red-900 text-xs my-4 border border-red-200">
          <AlertTriangle className="w-5 h-5 text-danger shrink-0" />
          <span>
            Orders can only be cancelled before kitchen preparation starts.
          </span>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            size="md"
            onClick={() => setCancelModalOpen(false)}
          >
            Keep Order
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => cancelMutation.mutate()}
            loading={cancelMutation.isPending}
          >
            Confirm Cancellation
          </Button>
        </div>
      </Modal>
    </div>
  );
};
