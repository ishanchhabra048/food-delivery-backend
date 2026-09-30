import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Calendar, Store } from "lucide-react";
import { StatusPill } from "../ui/StatusPill";
import { formatCurrency, formatDate } from "../../lib/utils";
import { cn } from "../../lib/utils";

export const OrderCard = ({ order, className }) => {
  if (!order) return null;

  const totalItems = order.items?.reduce((sum, i) => sum + (i.quantity || 1), 0) || 0;
  const restaurantName = order.restaurant?.name || "Local Kitchen";

  return (
    <Link
      to={`/orders/${order._id}`}
      className={cn(
        "block bg-surface rounded-lg border border-border p-4 sm:p-5 shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 group",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3.5 mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-md bg-surface-muted border border-border flex items-center justify-center text-primary shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm sm:text-base text-fg group-hover:text-primary transition-colors truncate">
              {restaurantName}
            </h3>
            <p className="text-[11px] text-fg-3 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(order.createdAt)}</span>
              <span>•</span>
              <span className="font-mono">#{order._id.slice(-6).toUpperCase()}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <StatusPill status={order.status} />
        </div>
      </div>

      {/* Items summary */}
      <div className="flex items-center justify-between text-xs text-fg-2">
        <div className="truncate pr-4">
          <span className="font-medium text-fg">{totalItems} {totalItems === 1 ? "item" : "items"}: </span>
          <span className="text-fg-3 truncate">
            {order.items?.map((i) => `${i.food?.name || "Dish"} (x${i.quantity})`).join(", ")}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-sm text-primary font-mono">
            {formatCurrency(order.totalAmount)}
          </span>
          <ChevronRight className="w-4 h-4 text-fg-3 group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
};
