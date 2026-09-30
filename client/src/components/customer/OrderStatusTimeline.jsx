import React from "react";
import {
  Clock,
  CheckCircle2,
  ChefHat,
  Bike,
  PackageCheck,
  XCircle,
  WifiOff,
} from "lucide-react";
import { useSocketOrder } from "../../hooks/useSocketOrder";
import { cn } from "../../lib/utils";

const steps = [
  { key: "PLACED", label: "Placed", icon: Clock },
  { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle2 },
  { key: "PREPARING", label: "Preparing", icon: ChefHat },
  { key: "OUT_FOR_DELIVERY", label: "On the way", icon: Bike },
  { key: "DELIVERED", label: "Delivered", icon: PackageCheck },
];

export const OrderStatusTimeline = ({ order, className }) => {
  const { showDisconnectBanner } = useSocketOrder(order?._id);

  if (!order) return null;

  const currentStatus = order.status || "PLACED";
  const isCancelled = currentStatus === "CANCELLED";

  const currentIndex = steps.findIndex((s) => s.key === currentStatus);
  const activeStepIdx = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Socket disconnect fallback warning banner */}
      {showDisconnectBanner && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs animate-in fade-in">
          <WifiOff className="w-4 h-4 text-warning shrink-0" />
          <span>
            Real-time connection paused. Falling back to background sync every 10 seconds.
          </span>
        </div>
      )}

      {isCancelled ? (
        <div className="p-6 bg-red-50 rounded-xl border border-red-200 text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-red-100 text-danger flex items-center justify-center mx-auto">
            <XCircle className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-red-900">Order Cancelled</h4>
          <p className="text-xs text-red-700 max-w-sm mx-auto">
            This order has been cancelled and cannot be fulfilled. If you paid online, your refund will be processed automatically.
          </p>
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
          {/* Timeline progress wrapper */}
          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0">
            {/* Horizontal Line on Desktop */}
            <div className="hidden sm:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-border rounded-full z-0">
              <div
                className="h-full bg-secondary rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${(activeStepIdx / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Vertical Line on Mobile */}
            <div className="sm:hidden absolute left-5 top-5 bottom-5 w-1 bg-border rounded-full z-0">
              <div
                className="w-full bg-secondary rounded-full transition-all duration-700 ease-out"
                style={{
                  height: `${(activeStepIdx / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>

            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isPast = idx < activeStepIdx;
              const isCurrent = idx === activeStepIdx;
              const isFuture = idx > activeStepIdx;

              return (
                <div
                  key={step.key}
                  className="relative z-10 flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center w-full sm:w-auto"
                >
                  {/* Node Circle */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shrink-0",
                      isPast && "bg-secondary text-white shadow-sm",
                      isCurrent &&
                        "bg-primary text-white ring-4 ring-primary/20 shadow-md animate-pulseDot",
                      isFuture && "bg-surface border-2 border-border text-fg-3"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Label */}
                  <div>
                    <p
                      className={cn(
                        "text-xs font-semibold whitespace-nowrap",
                        isCurrent ? "text-primary font-bold" : isPast ? "text-fg" : "text-fg-3"
                      )}
                    >
                      {step.label}
                    </p>
                    {isCurrent && (
                      <span className="text-[10px] text-primary font-medium block sm:hidden">
                        Current Status
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
