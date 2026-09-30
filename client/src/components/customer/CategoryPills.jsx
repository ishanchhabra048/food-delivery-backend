import React from "react";
import { cuisineCategories } from "../../content/cuisineCategories";
import { cn } from "../../lib/utils";

export const CategoryPills = ({
  activeCategory = "all",
  onSelectCategory,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar",
        className
      )}
    >
      {cuisineCategories.map((cat) => {
        const isActive =
          activeCategory.toLowerCase() === cat.id.toLowerCase() ||
          (cat.id === "all" && (!activeCategory || activeCategory === "all"));

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id === "all" ? "" : cat.id)}
            className={cn(
              "relative px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0",
              isActive
                ? "bg-gradient-primary text-white shadow-glow scale-105"
                : "bg-surface text-fg-2 border border-border hover:border-primary/40 hover:text-fg hover:bg-surface-muted hover:shadow-sm"
            )}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
};
