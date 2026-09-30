import React from "react";
import { useSearchParams } from "react-router-dom";
import { useRestaurants } from "../../hooks/useRestaurants";
import { RestaurantCard } from "../../components/customer/RestaurantCard";
import { RestaurantCardSkeleton } from "../../components/ui/Skeleton";
import { PageHeader } from "../../components/ui/PageHeader";
import { FilterBar } from "../../components/ui/FilterBar";
import { Pagination } from "../../components/ui/Pagination";
import { EmptyState } from "../../components/ui/EmptyState";
import { CategoryPills } from "../../components/customer/CategoryPills";

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
    limit: 8,
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
  const pagination = data?.pagination || { totalPages: 1, page: 1 };

  return (
    <div className="container max-w-[1180px] mx-auto px-4 py-8 space-y-6">
      <PageHeader
        title="Explore Restaurants"
        subtitle="Discover curated menus, wood-fired pizzas, delicious biryanis, and chef specials near you."
      />

      {/* Category Pills */}
      <CategoryPills
        activeCategory={cuisine}
        onSelectCategory={(val) => updateParam("cuisine", val)}
      />

      {/* Filter Bar */}
      <FilterBar
        searchQuery={search}
        onSearchChange={(val) => updateParam("search", val)}
        searchPlaceholder="Search restaurant names..."
        filters={[
          {
            label: "Availability",
            value: isOpen,
            options: [
              { label: "All Availability", value: "all" },
              { label: "Open Now", value: "true" },
              { label: "Closed", value: "false" },
            ],
            onChange: (val) => updateParam("isOpen", val),
          },
          {
            label: "Sort By",
            value: `${sortBy}-${sortOrder}`,
            options: [
              { label: "Newest First", value: "createdAt-desc" },
              { label: "Oldest First", value: "createdAt-asc" },
              { label: "Name (A-Z)", value: "name-asc" },
            ],
            onChange: (val) => {
              const [sb, so] = val.split("-");
              setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                next.set("sortBy", sb);
                next.set("sortOrder", so);
                return next;
              });
            },
          },
        ]}
        onReset={handleReset}
      />

      {/* Restaurants Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pt-2">
          {Array.from({ length: 8 }).map((_, idx) => (
            <RestaurantCardSkeleton key={idx} />
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        <EmptyState
          iconType="search"
          title="No restaurants match your filters"
          description="Try clearing your search keyword or selecting a different cuisine."
          actionText="Clear All Filters"
          onAction={handleReset}
          className="my-8"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pt-2">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      )}

      {/* Pagination */}
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
  );
};
