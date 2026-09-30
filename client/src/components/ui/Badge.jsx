import React from "react";
import { cn } from "../../lib/utils";

export const Badge = ({
  className,
  variant = "default",
  children,
  ...props
}) => {
  const variants = {
    default: "bg-surface-muted text-fg-2 border border-border",
    primary: "bg-primary/10 text-primary border border-primary/20",
    secondary: "bg-secondary/10 text-secondary border border-secondary/20",
    accent: "bg-gradient-to-r from-primary to-accent text-white",
    warning: "bg-warning/10 text-warning border border-warning/20",
    danger: "bg-danger/10 text-danger border border-danger/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
