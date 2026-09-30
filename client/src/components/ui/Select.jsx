import React from "react";
import { cn } from "../../lib/utils";

export const Select = React.forwardRef(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          ref={ref}
          className={cn(
            "w-full bg-surface text-fg border border-border rounded-md px-3.5 py-2.5 text-sm transition-all duration-200",
            "focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none",
            error && "border-danger focus:border-danger focus:ring-danger",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="mt-1 text-xs text-danger font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
