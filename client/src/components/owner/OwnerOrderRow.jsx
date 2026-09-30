import React from "react";
import { ChevronRight, Clock, User, Phone, MapPin } from "lucide-react";
import { StatusPill } from "../ui/StatusPill";
import { Button } from "../ui/Button";
import { formatCurrency, formatDate } from "../../lib/utils";

const nextStatusMap = {
  PLACED: "CONFIRMED",
  CONFIRMED: "PREPARING",
  PREPARING: "OUT_FOR_DELIVERY",
  OUT_FOR_DELIVERY: "DELIVERED",
};

const nextStatusLabels = {
  PLACED: "Confirm Order",
  CONFIRMED: "Start Preparing",
  PREPARING: "Send Out For Delivery",
  OUT_FOR_DELIVERY: "Mark as Delivered",
};

export const OwnerOrderRow = ({ order, onAdvanceStatus, loading = false }) => {
  if (!order) return null;

  const nextStatus = nextStatusMap[order.status];
  const nextLabel = nextStatusLabels[order.status];

  return (
    <div className="bg-surface rounded-xl border border-border p-5 shadow-card space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-primary">
              #{order._id.slice(-6).toUpperCase()}
            </span>
            <span>•</span>
            <span className="text-xs text-fg-3 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(order.createdAt)}
            </span>
          </div>
          <p className="text-xs font-semibold text-fg mt-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-primary" />
            <span>{order.user?.fullName || "Guest Customer"}</span>
            {order.user?.phoneNumber && (
              <>
                <span>•</span>
                <span className="text-fg-3 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {order.user.phoneNumber}
                </span>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusPill status={order.status} />
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-1.5 text-xs text-fg-2 bg-surface-muted/60 p-3 rounded-lg border border-border/40">
        {order.items?.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="font-medium text-fg">
              <span className="text-primary font-bold">{item.quantity}x</span>{" "}
              {item.food?.name || "Dish Item"}
            </span>
            <span className="font-mono text-fg-3">
              {formatCurrency((item.price || 0) * (item.quantity || 1))}
            </span>
          </div>
        ))}

        <div className="pt-2 mt-2 border-t border-border/80 flex justify-between items-center text-xs font-bold text-fg">
          <span>Total Order Value:</span>
          <span className="text-primary font-mono text-sm">
            {formatCurrency(order.totalAmount)}
          </span>
        </div>
      </div>

      {/* Delivery Address Snapshot */}
      {order.deliveryAddress && (
        <div className="flex items-start gap-1.5 text-xs text-fg-3">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
          <span className="line-clamp-1">{order.deliveryAddress}</span>
        </div>
      )}

      {/* Action to advance status */}
      {nextStatus && (
        <div className="flex justify-end pt-1">
          <Button
            size="sm"
            variant="primary"
            onClick={() => onAdvanceStatus(order._id, nextStatus)}
            loading={loading}
            iconRight={ChevronRight}
          >
            {nextLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
