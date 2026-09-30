import React from "react";
import { cn } from "../../lib/utils";

export const Textarea = React.forwardRef(
  ({ className, error, rows = 3, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            "w-full bg-surface text-fg placeholder:text-fg-3 border border-border rounded-md px-3.5 py-2.5 text-sm transition-all duration-200",
            "focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-y",
            error && "border-danger focus:border-danger focus:ring-danger",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-danger font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
