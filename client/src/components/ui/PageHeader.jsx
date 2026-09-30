import React from "react";
import { cn } from "../../lib/utils";

export const PageHeader = ({
  title,
  subtitle,
  actions,
  badge,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80 mb-6",
        className
      )}
    >
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="text-sm sm:text-base text-fg-2 mt-1 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
};
