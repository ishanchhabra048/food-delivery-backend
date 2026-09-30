import React from "react";
import { cn } from "../../lib/utils";

export const Card = ({
  className,
  interactive = false,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-surface rounded-lg border border-border overflow-hidden shadow-card transition-all duration-300",
        interactive &&
          "hover:-translate-y-1 hover:shadow-card-hover cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
