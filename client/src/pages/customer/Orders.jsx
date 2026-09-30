import React from "react";
import { useSearchParams } from "react-router-dom";
import { useOrders } from "../../hooks/useOrders";
import { PageHeader } from "../../components/ui/PageHeader";
import { OrderCard } from "../../components/customer/OrderCard";
import { Pagination } from "../../components/ui/Pagination";
import { EmptyState } from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import { cn } from "../../lib/utils";

const statusFilterOptions = [
  { label: "All Orders", value: "" },
  { label: "Placed", value: "PLACED" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Preparing", value: "PREPARING" },
  { label: "Out For Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export const Orders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") || "";
  const page = Number(searchParams.get("page")) || 1;

  const { data, isLoading } = useOrders({ status, page, limit: 10 });

  const orders = data?.orders || [];
  const pagination = data?.pagination || { totalPages: 1, page: 1 };

  const handleStatusChange = (val) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!val) {
        next.delete("status");
      } else {
        next.set("status", val);
      }
      next.set("page", "1");
      return next;
    });
  };

  return (
    <div className="container max-w-[1180px] mx-auto px-4 py-8 space-y-6">
      <PageHeader
        title="My Orders"
        subtitle="Track current meals in real-time or view past culinary feasts."
      />

      {/* Status Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {statusFilterOptions.map((opt) => {
          const isActive = status === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => handleStatusChange(opt.value)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface text-fg-2 border border-border hover:bg-surface-muted"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="p-5 rounded-lg bg-surface border border-border space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          iconType="orders"
          title="No orders found"
          description={
            status
              ? `You don't have any orders with status "${status}".`
              : "You haven't placed any orders yet. Treat yourself to a delicious meal!"
          }
          actionText="Explore Restaurants"
          actionTo="/restaurants"
          className="my-8"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(p) => {
          setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("page", p.toString());
            return next;
          });
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
};
