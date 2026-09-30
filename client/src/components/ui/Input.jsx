import React from "react";
import { cn } from "../../lib/utils";

export const Input = React.forwardRef(
  ({ className, type = "text", error, icon: Icon, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-3.5 pointer-events-none text-fg-3">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              "w-full bg-surface text-fg placeholder:text-fg-3 border border-border rounded-md px-3.5 py-2.5 text-sm transition-all duration-200",
              "focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none",
              Icon && "pl-10",
              error && "border-danger focus:border-danger focus:ring-danger",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs text-danger font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
