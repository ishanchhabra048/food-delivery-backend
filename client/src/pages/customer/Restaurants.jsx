import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Sparkles,
  SlidersHorizontal,
  X,
  Star,
  Clock,
  Flame,
  ChefHat,
  ArrowUpDown,
} from "lucide-react";
import { useRestaurants } from "../../hooks/useRestaurants";
import { RestaurantCard } from "../../components/customer/RestaurantCard";
import { RestaurantCardSkeleton } from "../../components/ui/Skeleton";
import { Pagination } from "../../components/ui/Pagination";
import { EmptyState } from "../../components/ui/EmptyState";
import { CategoryPills } from "../../components/customer/CategoryPills";
import { Button } from "../../components/ui/Button";
import { cn } from "../../lib/utils";

export const Restaurants = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const cuisine = searchParams.get("cuisine") || "";
  const isOpen = searchParams.get("isOpen") || "all";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const page = Number(searchParams.get("page")) || 1;

  const { data, isLoading } = useRestaurants({
    search,
    cuisine,
    isOpen: isOpen === "all" ? undefined : isOpen,
    sortBy,
    sortOrder,
    page,
    limit: 9,
  });

  const updateParam = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value || value === "all") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      next.set("page", "1");
      return next;
    });
  };

  const handleReset = () => {
    setSearchParams({});
  };

  const restaurants = data?.restaurants || [];
  const pagination = data?.pagination || { totalPages: 1, page: 1, total: restaurants.length };

  const hasActiveFilters = Boolean(search || cuisine || isOpen !== "all" || sortBy !== "createdAt");

  return (
    <div className="min-h-screen pb-16">
      {/* Background Depth */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none -z-10" />

      <div className="container max-w-[1200px] mx-auto px-4 pt-8 pb-12 space-y-8">
        {/* Page Header with Eyebrow */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/70 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-black uppercase tracking-wider">
              <ChefHat className="w-3.5 h-3.5" /> CURATED DINING & TIFFINS
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-fg tracking-tight">
              Explore Kitchens & Restaurants
            </h1>
            <p className="text-xs sm:text-sm text-fg-2 font-medium">
              Order authentic meals, slow-cooked regional delicacies, and artisan tiffins delivered fresh.
            </p>
          </div>

          <div className="text-xs font-bold text-fg-3 bg-white px-3.5 py-2 rounded-xl border border-border/80 shadow-subtle self-start md:self-auto">
            Showing <span className="text-fg font-black">{restaurants.length}</span> kitchens in <span className="text-primary font-black">Metropolis Central</span>
          </div>
        </div>

        {/* Cuisines Horizontal Bar */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-fg-3 uppercase tracking-wider block">
            Filter by Cuisine:
          </span>
          <CategoryPills
            activeCategory={cuisine}
            onSelectCategory={(val) => updateParam("cuisine", val)}
          />
        </div>

        {/* Sticky Filter & Search Control Panel */}
        <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-xl border border-border/90 rounded-2xl p-3 sm:p-4 shadow-card space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-between">
            {/* Live Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-fg-3 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => updateParam("search", e.target.value)}
                placeholder="Search by restaurant name or dish..."
                className="w-full pl-10 pr-4 py-2 bg-surface-muted/60 border border-border/70 rounded-xl text-xs sm:text-sm font-semibold text-fg placeholder:text-fg-3 placeholder:font-normal focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
              {search && (
                <button
                  onClick={() => updateParam("search", "")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-3 hover:text-fg"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Toggle Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {/* Open Now Pill */}
              <button
                onClick={() => updateParam("isOpen", isOpen === "true" ? "all" : "true")}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap border transition-all flex items-center gap-1.5",
                  isOpen === "true"
                    ? "bg-emerald-500 text-white border-emerald-600 shadow-sm"
                    : "bg-white text-fg-2 border-border/80 hover:border-emerald-500/50"
                )}
              >
                <span className={cn("w-2 h-2 rounded-full", isOpen === "true" ? "bg-white" : "bg-emerald-500")} />
                Open Now
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [sb, so] = e.target.value.split("-");
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);
                      next.set("sortBy", sb);
                      next.set("sortOrder", so);
                      return next;
                    });
                  }}
                  className="px-3.5 py-2 bg-white text-fg border border-border/80 rounded-xl text-xs font-bold focus:outline-none focus:border-primary appearance-none pr-8 cursor-pointer shadow-subtle hover:border-primary/40 transition-all"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="createdAt-asc">Oldest First</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-fg-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Clear All Reset */}
              {hasActiveFilters && (
                <button
                  onClick={handleReset}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-danger hover:bg-red-50 transition-colors shrink-0 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Restaurants Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {Array.from({ length: 6 }).map((_, idx) => (
              <RestaurantCardSkeleton key={idx} />
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <EmptyState
            iconType="search"
            title="No kitchens found matching your filters"
            description="Try changing your search terms, clearing cuisine filters, or adjusting availability settings."
            actionText="Clear All Filters"
            onAction={handleReset}
            className="my-12 py-12"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2"
          >
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pt-6">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(p) => {
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  next.set("page", p.toString());
                  return next;
                });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
