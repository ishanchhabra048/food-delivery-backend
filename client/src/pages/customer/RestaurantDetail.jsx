import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Search, ArrowLeft, Store } from "lucide-react";
import { useRestaurant } from "../../hooks/useRestaurant";
import { MenuItemCard } from "../../components/customer/MenuItemCard";
import { MenuItemSkeleton } from "../../components/ui/Skeleton";
import { StatusPill } from "../../components/ui/StatusPill";
import { Input } from "../../components/ui/Input";
import { EmptyState } from "../../components/ui/EmptyState";
import { cn } from "../../lib/utils";

export const RestaurantDetail = () => {
  const { id } = useParams();
  const { restaurant, foods, isLoading, isError } = useRestaurant(id);
  const [menuSearch, setMenuSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const coverUrl =
    restaurant?.image?.url ||
    (typeof restaurant?.image === "string" ? restaurant.image : "") ||
    "/placeholders/restaurant.svg";

  // Filter and group foods by category
  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchSearch =
        food.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
        food.description?.toLowerCase().includes(menuSearch.toLowerCase());
      const matchCat =
        activeCategory === "all" ||
        food.category?.toLowerCase() === activeCategory.toLowerCase();
      return matchSearch && matchCat;
    });
  }, [foods, menuSearch, activeCategory]);

  const categories = useMemo(() => {
    const set = new Set(foods.map((f) => f.category).filter(Boolean));
    return Array.from(set);
  }, [foods]);

  const groupedFoods = useMemo(() => {
    const groups = {};
    filteredFoods.forEach((food) => {
      const cat = food.category || "General";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(food);
    });
    return groups;
  }, [filteredFoods]);

  if (isLoading) {
    return (
      <div className="container max-w-[1180px] mx-auto px-4 py-8 space-y-8">
        <div className="h-64 rounded-xl bg-surface-muted animate-pulse" />
        <div className="space-y-4">
          <div className="h-8 w-1/3 bg-surface-muted animate-pulse rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <MenuItemSkeleton key={idx} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !restaurant) {
    return (
      <div className="container max-w-[1180px] mx-auto px-4 py-16 text-center">
        <EmptyState
          icon={Store}
          title="Restaurant not found"
          description="The restaurant you're looking for may be temporarily closed or no longer available."
          actionText="Back to Restaurants"
          actionTo="/restaurants"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Restaurant Header Hero */}
      <div className="relative w-full bg-surface border-b border-border">
        <div className="container max-w-[1180px] mx-auto px-4 py-6">
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg-2 hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Restaurants</span>
          </Link>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Restaurant Cover Image */}
            <div className="relative w-full md:w-80 aspect-[16/10] rounded-xl overflow-hidden bg-surface-muted border border-border shadow-sm shrink-0">
              <img
                src={coverUrl}
                alt={restaurant.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/placeholders/restaurant.svg";
                }}
              />
            </div>

            {/* Restaurant Details */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-fg">
                  {restaurant.name}
                </h1>
                <StatusPill
                  status={restaurant.isOpen !== false ? "OPEN" : "CLOSED"}
                />
              </div>

              {restaurant.cuisine && (
                <div className="inline-block">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {restaurant.cuisine} Cuisine
                  </span>
                </div>
              )}

              {restaurant.description && (
                <p className="text-sm text-fg-2 leading-relaxed max-w-2xl">
                  {restaurant.description}
                </p>
              )}

              <div className="flex items-center gap-2 text-xs text-fg-3 pt-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>{restaurant.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Area */}
      <div className="container max-w-[1180px] mx-auto px-4 pt-8 space-y-8">
        {/* Menu Search & Category Jump Nav */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sticky top-16 z-30 bg-bg/95 backdrop-blur-md py-3 border-b border-border/80">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors",
                activeCategory === "all"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface text-fg-2 border border-border hover:bg-surface-muted"
              )}
            >
              All Items ({foods.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors",
                  activeCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface text-fg-2 border border-border hover:bg-surface-muted"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Food Items */}
          <div className="relative w-full sm:w-64">
            <Input
              icon={Search}
              placeholder="Search dishes..."
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              className="py-1.5 text-xs"
            />
          </div>
        </div>

        {/* Menu Items List */}
        {Object.keys(groupedFoods).length === 0 ? (
          <EmptyState
            iconType="search"
            title="No dishes found"
            description="Try changing your dish search keywords or select 'All Items'."
            actionText="Clear Search"
            onAction={() => {
              setMenuSearch("");
              setActiveCategory("all");
            }}
          />
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedFoods).map(([catName, foodList]) => (
              <section key={catName} className="space-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="font-display font-bold text-lg sm:text-xl text-fg">
                    {catName}
                  </h2>
                  <span className="text-xs font-medium text-fg-3 bg-surface-muted px-2 py-0.5 rounded-full border border-border">
                    {foodList.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {foodList.map((food) => (
                    <MenuItemCard
                      key={food._id}
                      food={food}
                      restaurant={restaurant}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
