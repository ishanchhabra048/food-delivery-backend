import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Sparkles } from "lucide-react";
import { StatusPill } from "../ui/StatusPill";
import { Badge } from "../ui/Badge";
import { cn } from "../../lib/utils";

export const RestaurantCard = ({ restaurant, className }) => {
  if (!restaurant) return null;

  const coverUrl =
    restaurant.image?.url ||
    (typeof restaurant.image === "string" ? restaurant.image : "") ||
    "/placeholders/restaurant.svg";

  return (
    <Link
      to={`/restaurants/${restaurant._id}`}
      className={cn(
        "group block bg-surface rounded-lg border border-border overflow-hidden shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover",
        className
      )}
    >
      {/* 4:3 Aspect Ratio Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-muted">
        <img
          src={coverUrl}
          alt={restaurant.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "/placeholders/restaurant.svg";
          }}
        />

        {/* Status Badge Overlay */}
        <div className="absolute top-3 right-3 shadow-md">
          <StatusPill
            status={restaurant.isOpen !== false ? "OPEN" : "CLOSED"}
            showIcon={true}
          />
        </div>

        {/* Cuisine Tag Overlay */}
        {restaurant.cuisine && (
          <div className="absolute bottom-3 left-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-sm shadow-sm">
              {restaurant.cuisine}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-base text-fg group-hover:text-primary transition-colors truncate">
            {restaurant.name}
          </h3>
        </div>

        {restaurant.description && (
          <p className="text-xs text-fg-2 line-clamp-2 leading-relaxed">
            {restaurant.description}
          </p>
        )}

        <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-fg-3">
          <div className="flex items-center gap-1 truncate max-w-[200px]">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">{restaurant.address}</span>
          </div>

          <span className="text-[11px] font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
            View Menu →
          </span>
        </div>
      </div>
    </Link>
  );
};
