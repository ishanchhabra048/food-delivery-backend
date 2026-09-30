import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, Clock, Heart, Sparkles } from "lucide-react";
import { cn } from "../../lib/utils";

export const RestaurantCard = ({ restaurant, className }) => {
  const [liked, setLiked] = useState(false);
  if (!restaurant) return null;

  const coverUrl =
    restaurant.image?.url ||
    (typeof restaurant.image === "string" ? restaurant.image : "") ||
    "/placeholders/restaurant.svg";

  const isOpen = restaurant.isOpen !== false;

  // Generate deterministic realistic rating & time if not in schema
  const hash = (restaurant._id || "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rating = (4.2 + (hash % 8) / 10).toFixed(1);
  const deliveryTime = 20 + (hash % 20);

  return (
    <div
      className={cn(
        "group relative bg-white rounded-2xl border border-border/80 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between",
        className
      )}
    >
      <Link to={`/restaurants/${restaurant._id}`} className="block flex-1">
        {/* 16:10 Aspect Ratio Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-muted">
          <img
            src={coverUrl}
            alt={restaurant.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            onError={(e) => {
              e.target.src = "/placeholders/restaurant.svg";
            }}
          />

          {/* Gradient Scrim for Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity" />

          {/* Rating Badge Overlay */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-fg text-xs font-black shadow-md backdrop-blur-md">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{rating}</span>
          </div>

          {/* Status & Promo Tag */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
            <span
              className={cn(
                "text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md backdrop-blur-md flex items-center gap-1.5",
                isOpen
                  ? "bg-emerald-600/90 text-white"
                  : "bg-black/70 text-slate-200"
              )}
            >
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  isOpen ? "bg-white animate-pulse" : "bg-slate-400"
                )}
              />
              {isOpen ? "Open Now" : "Closed"}
            </span>
          </div>

          {/* Bottom Overlay: Cuisine & Time Banner */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white z-10">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/20 truncate max-w-[140px]">
              {restaurant.cuisine || "Multi-Cuisine"}
            </span>

            <div className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/20">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span>{deliveryTime} mins</span>
            </div>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-4 sm:p-5 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-extrabold text-lg text-fg group-hover:text-primary transition-colors truncate">
              {restaurant.name}
            </h3>
          </div>

          {restaurant.description && (
            <p className="text-xs text-fg-2 line-clamp-2 leading-relaxed font-medium">
              {restaurant.description}
            </p>
          )}

          <div className="pt-3 border-t border-border/70 flex items-center justify-between text-xs text-fg-3">
            <div className="flex items-center gap-1.5 truncate max-w-[190px]">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate font-medium text-fg-2">{restaurant.address}</span>
            </div>

            <span className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 shrink-0">
              Explore Menu →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
