import React from "react";
import { Utensils, ShoppingBag, Search, Sparkles } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../../lib/utils";

const defaultIcons = {
  food: Utensils,
  cart: ShoppingBag,
  search: Search,
  default: Sparkles,
};

export const EmptyState = ({
  icon: CustomIcon,
  iconType = "default",
  title,
  description,
  actionText,
  onAction,
  actionTo,
  className,
}) => {
  const Icon = CustomIcon || defaultIcons[iconType] || defaultIcons.default;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-xl border border-dashed border-border bg-surface/50",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center text-primary mb-4 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-fg mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-fg-2 max-w-md mb-6">{description}</p>
      )}
      {(actionText && (onAction || actionTo)) && (
        <Button
          onClick={onAction}
          to={actionTo}
          variant="primary"
          size="md"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};
