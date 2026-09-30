import React from "react";
import { cn } from "../../lib/utils";

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-surface-muted", className)}
      {...props}
    />
  );
};

export const RestaurantCardSkeleton = () => (
  <div className="bg-surface rounded-lg border border-border overflow-hidden p-0 shadow-card">
    <Skeleton className="aspect-[4/3] w-full rounded-none" />
    <div className="p-4 space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  </div>
);

export const MenuItemSkeleton = () => (
  <div className="bg-surface rounded-lg border border-border p-4 flex gap-4 shadow-card">
    <Skeleton className="w-24 h-24 rounded-md shrink-0 aspect-square" />
    <div className="flex-1 space-y-2 py-1">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  </div>
);
