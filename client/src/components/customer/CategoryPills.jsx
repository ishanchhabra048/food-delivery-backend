import React from "react";
import { motion } from "framer-motion";
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
        "flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth",
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
              "relative px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-colors duration-200 shrink-0 z-10",
              isActive ? "text-white" : "text-fg-2 hover:text-fg"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeCuisinePill"
                className="absolute inset-0 bg-gradient-primary rounded-full shadow-glow -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {!isActive && (
              <div className="absolute inset-0 bg-white/90 border border-border/80 rounded-full shadow-subtle hover:border-primary/40 transition-colors -z-10" />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span>{cat.name}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};
