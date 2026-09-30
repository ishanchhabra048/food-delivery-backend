import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, TrendingUp, Compass, ArrowRight } from "lucide-react";
import { useRestaurants } from "../../hooks/useRestaurants";
import { RestaurantCard } from "../../components/customer/RestaurantCard";
import { RestaurantCardSkeleton } from "../../components/ui/Skeleton";
import { CategoryPills } from "../../components/customer/CategoryPills";
import { Button } from "../../components/ui/Button";
import { demoCopy } from "../../content/demoCopy";

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const navigate = useNavigate();

  const { data: featuredData, isLoading: loadingFeatured } = useRestaurants({
    limit: 4,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data: openData, isLoading: loadingOpen } = useRestaurants({
    limit: 6,
    isOpen: "true",
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/restaurants");
    }
  };

  const handleCuisineSelect = (cuisine) => {
    setSelectedCuisine(cuisine);
    if (cuisine) {
      navigate(`/restaurants?cuisine=${encodeURIComponent(cuisine)}`);
    } else {
      navigate("/restaurants");
    }
  };

  const featuredRestaurants = featuredData?.restaurants || [];
  const openRestaurants = openData?.restaurants || [];

  return (
    <div className="relative overflow-hidden">
      {/* Warm Gradient Blobs (Section 3.5: only on Home) */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-primary to-accent opacity-20 blur-3xl animate-float"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-60 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary via-accent to-yellow-400 opacity-15 blur-3xl animate-float"
        style={{ animationDelay: "-10s" }}
        aria-hidden="true"
      />

      {/* Hero Section */}
      <section className="container max-w-[1180px] mx-auto px-4 pt-14 pb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-primary/20 text-xs font-bold text-primary mb-6 shadow-sm backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-accent animate-spin-slow" />
          <span>{demoCopy.hero.badge}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-fg tracking-tight max-w-3xl mx-auto leading-[1.12]">
          Crave it? Get <span className="text-gradient">hot & fresh meals</span> delivered.
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-fg-2 max-w-2xl mx-auto mt-4 font-medium leading-relaxed">
          {demoCopy.hero.subheadline}
        </p>

        {/* Hero Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="mt-8 max-w-xl mx-auto flex items-center bg-white/95 backdrop-blur-md border-2 border-border focus-within:border-primary focus-within:shadow-glow rounded-full p-2 shadow-card transition-all duration-300"
        >
          <div className="pl-4 text-fg-3">
            <Search className="w-5 h-5 text-primary" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={demoCopy.hero.searchPlaceholder}
            className="flex-1 bg-transparent px-3 py-2 text-sm font-medium text-fg placeholder:text-fg-3 focus:outline-none"
          />
          <Button type="submit" variant="primary" size="md" className="rounded-full px-7">
            Search
          </Button>
        </form>

        {/* Category Pills Navigation */}
        <div className="mt-10 max-w-3xl mx-auto">
          <CategoryPills
            activeCategory={selectedCuisine}
            onSelectCategory={handleCuisineSelect}
          />
        </div>
      </section>

      {/* Featured Restaurants Section */}
      <section className="container max-w-[1180px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl sm:text-2xl font-bold font-display text-fg">
              Featured Kitchens
            </h2>
          </div>
          <Button to="/restaurants" variant="ghost" size="sm" iconRight={ArrowRight}>
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {loadingFeatured ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <RestaurantCardSkeleton key={idx} />
            ))
          ) : featuredRestaurants.length === 0 ? (
            <div className="col-span-full py-12 text-center text-fg-3">
              No featured kitchens found right now.
            </div>
          ) : (
            featuredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))
          )}
        </div>
      </section>

      {/* Open Near You Section */}
      <section className="container max-w-[1180px] mx-auto px-4 py-8 pb-16">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-secondary" />
            <h2 className="text-xl sm:text-2xl font-bold font-display text-fg">
              Open Near You
            </h2>
          </div>
          <Button to="/restaurants?isOpen=true" variant="ghost" size="sm" iconRight={ArrowRight}>
            Explore All Open
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {loadingOpen ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <RestaurantCardSkeleton key={idx} />
            ))
          ) : openRestaurants.length === 0 ? (
            <div className="col-span-full py-12 text-center text-fg-3">
              No open restaurants at this hour. Check back soon!
            </div>
          ) : (
            openRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))
          )}
        </div>
      </section>
    </div>
  );
};
