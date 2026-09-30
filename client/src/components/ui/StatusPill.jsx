import React from "react";
import {
  Clock,
  CheckCircle2,
  ChefHat,
  Bike,
  PackageCheck,
  XCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "../../lib/utils";

const statusConfig = {
  PLACED: {
    label: "Order Placed",
    color: "#F59E0B",
    bgClass: "bg-[#F59E0B]/12 text-[#B45309] border-[#F59E0B]/30",
    dotClass: "bg-[#F59E0B]",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "#3B82F6",
    bgClass: "bg-[#3B82F6]/12 text-[#1D4ED8] border-[#3B82F6]/30",
    dotClass: "bg-[#3B82F6]",
    icon: CheckCircle2,
  },
  PREPARING: {
    label: "Preparing",
    color: "#8B5CF6",
    bgClass: "bg-[#8B5CF6]/12 text-[#6D28D9] border-[#8B5CF6]/30",
    dotClass: "bg-[#8B5CF6]",
    icon: ChefHat,
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    color: "#FF5A1F",
    bgClass: "bg-[#FF5A1F]/12 text-[#C2410C] border-[#FF5A1F]/30",
    dotClass: "bg-[#FF5A1F]",
    icon: Bike,
  },
  DELIVERED: {
    label: "Delivered",
    color: "#16A34A",
    bgClass: "bg-[#16A34A]/12 text-[#15803D] border-[#16A34A]/30",
    dotClass: "bg-[#16A34A]",
    icon: PackageCheck,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "#EF4444",
    bgClass: "bg-[#EF4444]/12 text-[#B91C1C] border-[#EF4444]/30",
    dotClass: "bg-[#EF4444]",
    icon: XCircle,
  },
  // Request / Payment statuses
  PENDING: {
    label: "Pending",
    color: "#F59E0B",
    bgClass: "bg-[#F59E0B]/12 text-[#B45309] border-[#F59E0B]/30",
    dotClass: "bg-[#F59E0B]",
    icon: Clock,
  },
  APPROVED: {
    label: "Approved",
    color: "#16A34A",
    bgClass: "bg-[#16A34A]/12 text-[#15803D] border-[#16A34A]/30",
    dotClass: "bg-[#16A34A]",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejected",
    color: "#EF4444",
    bgClass: "bg-[#EF4444]/12 text-[#B91C1C] border-[#EF4444]/30",
    dotClass: "bg-[#EF4444]",
    icon: XCircle,
  },
  PAID: {
    label: "Paid",
    color: "#16A34A",
    bgClass: "bg-[#16A34A]/12 text-[#15803D] border-[#16A34A]/30",
    dotClass: "bg-[#16A34A]",
    icon: CheckCircle2,
  },
  FAILED: {
    label: "Payment Failed",
    color: "#EF4444",
    bgClass: "bg-[#EF4444]/12 text-[#B91C1C] border-[#EF4444]/30",
    dotClass: "bg-[#EF4444]",
    icon: AlertCircle,
  },
  OPEN: {
    label: "Open Now",
    color: "#16A34A",
    bgClass: "bg-[#16A34A]/12 text-[#15803D] border-[#16A34A]/30",
    dotClass: "bg-[#16A34A]",
    icon: Sparkles,
  },
  CLOSED: {
    label: "Closed",
    color: "#6B5A4E",
    bgClass: "bg-[#6B5A4E]/12 text-[#6B5A4E] border-[#6B5A4E]/30",
    dotClass: "bg-[#6B5A4E]",
    icon: Clock,
  },
};

export const StatusPill = ({ status, className, showIcon = true }) => {
  const normKey = (status || "").toString().toUpperCase();
  const config = statusConfig[normKey] || {
    label: status || "Unknown",
    bgClass: "bg-surface-muted text-fg-2 border-border",
    dotClass: "bg-fg-3",
    icon: Clock,
  };

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border tracking-wide",
        config.bgClass,
        className
      )}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
};
