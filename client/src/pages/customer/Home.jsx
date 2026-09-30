import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Clock,
  ShieldCheck,
  Star,
  ChefHat,
  Flame,
  Truck,
  Heart,
  Award,
  CheckCircle2,
} from "lucide-react";
import { useRestaurants } from "../../hooks/useRestaurants";
import { RestaurantCard } from "../../components/customer/RestaurantCard";
import { RestaurantCardSkeleton } from "../../components/ui/Skeleton";
import { CategoryPills } from "../../components/customer/CategoryPills";
import { Button } from "../../components/ui/Button";

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const navigate = useNavigate();

  const { data: featuredData, isLoading: loadingFeatured } = useRestaurants({
    limit: 6,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data: openData, isLoading: loadingOpen } = useRestaurants({
    limit: 4,
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
      {/* Layered Background Depth with Grid Pattern and Gradient Orbs */}
      <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none -z-10" />
      
      {/* Gradient Ambient Orbs */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#FF3811]/25 via-[#FF006E]/20 to-transparent blur-3xl animate-float -z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-72 -right-32 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-[#FF006E]/20 via-[#7928CA]/15 to-[#00B368]/10 blur-3xl animate-float -z-10"
        style={{ animationDelay: "-7s" }}
        aria-hidden="true"
      />

      {/* ========================================================
          1. HERO SECTION (Split Hero with Floating Dish Cards)
      ======================================================== */}
      <section className="container max-w-[1200px] mx-auto px-4 pt-12 pb-20 md:pt-16 md:pb-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-primary/25 shadow-sm backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                ⚡ 30-MIN HOT & FRESH DELIVERY
              </span>
            </div>

            {/* High-Impact Headline with Mixed Weights & Gradients */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-fg tracking-tight leading-[1.08]">
              Authentic meals & <br />
              <span className="text-gradient">chef-made tiffins</span> <br />
              at your doorstep.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-fg-2 font-medium max-w-xl leading-relaxed">
              From aromatic slow-simmered dum biryanis to artisan sourdough pizzas and healthy homemade meal plans. Hot, flavorful, delivered in minutes.
            </p>

            {/* Hero Search Bar with Presence & Glow */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative max-w-xl flex items-center bg-white rounded-2xl p-2 border-2 border-border/80 focus-within:border-primary focus-within:shadow-glow shadow-card transition-all duration-300"
            >
              <div className="pl-3.5 pr-2 text-primary">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Biryani, Truffle Pasta, Ramen, Burgers..."
                className="flex-1 bg-transparent px-2 py-2 text-sm font-semibold text-fg placeholder:text-fg-3 placeholder:font-normal focus:outline-none"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="rounded-xl px-7 text-sm font-black shadow-glow"
              >
                Explore
              </Button>
            </form>

            {/* Quick Keyword Suggestions */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold text-fg-3">
              <span className="font-bold text-fg-2 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-primary" /> Popular:
              </span>
              {["Dum Biryani", "Margherita Pizza", "Tonkotsu Ramen", "Smash Burgers"].map((dish) => (
                <button
                  key={dish}
                  onClick={() => navigate(`/restaurants?search=${encodeURIComponent(dish)}`)}
                  className="px-2.5 py-1 rounded-full bg-white/80 border border-border/70 hover:border-primary hover:text-primary transition-colors text-[11px]"
                >
                  {dish}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right Hero Visual Collage / Floating Glassmorphic Dishes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative flex items-center justify-center min-h-[380px] sm:min-h-[420px]"
          >
            {/* Ambient Backlight Aura */}
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-primary via-accent to-amber-400 opacity-30 blur-2xl animate-pulseGlow" />

            {/* Main Spotlight Dish Card */}
            <div className="relative w-full max-w-[340px] rounded-3xl bg-white/95 p-4 border border-white/60 shadow-floating backdrop-blur-xl">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3.5 bg-surface-muted shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80"
                  alt="Royal Dum Biryani"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-gradient-primary text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                  Bestseller
                </span>
                <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-md">
                  ₹399
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-fg">Dum Gosht Biryani</h3>
                  <div className="flex items-center gap-1 text-xs font-black text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>4.9</span>
                  </div>
                </div>
                <p className="text-xs text-fg-3">Royal Spice Mahal • 25 mins delivery</p>
              </div>
            </div>

            {/* Floating Glassmorphic Mini Card 1 (Top Right) */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-xl p-3 rounded-2xl border border-white/80 shadow-floating flex items-center gap-3 z-20"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-surface-muted">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80"
                  alt="Margherita Pizza"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left pr-2">
                <p className="text-xs font-bold text-fg">Truffle Pizza</p>
                <p className="text-[10px] font-extrabold text-emerald-600">⚡ 18 min prep</p>
              </div>
            </motion.div>

            {/* Floating Glassmorphic Mini Card 2 (Bottom Left) */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -left-4 sm:-left-6 bg-white/95 backdrop-blur-xl p-3.5 rounded-2xl border border-white/80 shadow-floating flex items-center gap-3 z-20"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center font-bold text-lg">
                🛵
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <p className="text-xs font-black text-fg">Live Socket Tracking</p>
                </div>
                <p className="text-[10px] text-fg-3">Instant rider status updates</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ========================================================
          2. STATS & TRUST BAR
      ======================================================== */}
      <section className="border-y border-border/80 bg-white/70 backdrop-blur-md relative z-10 py-8">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x divide-border/60">
            <div className="space-y-1">
              <p className="font-display font-black text-3xl sm:text-4xl text-gradient">500+</p>
              <p className="text-xs sm:text-sm font-bold text-fg-2">Partner Kitchens</p>
            </div>
            <div className="space-y-1">
              <p className="font-display font-black text-3xl sm:text-4xl text-gradient">50k+</p>
              <p className="text-xs sm:text-sm font-bold text-fg-2">Happy Foodies</p>
            </div>
            <div className="space-y-1">
              <p className="font-display font-black text-3xl sm:text-4xl text-gradient">4.8 ★</p>
              <p className="text-xs sm:text-sm font-bold text-fg-2">Avg. Store Rating</p>
            </div>
            <div className="space-y-1">
              <p className="font-display font-black text-3xl sm:text-4xl text-gradient">25 Min</p>
              <p className="text-xs sm:text-sm font-bold text-fg-2">Avg. Delivery Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. CUISINE EXPLORER PILLS
      ======================================================== */}
      <section className="container max-w-[1200px] mx-auto px-4 pt-16 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> CURATED CUISINES
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-fg">
              What are you craving today?
            </h2>
          </div>
          <Link
            to="/restaurants"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            All Categories →
          </Link>
        </div>

        <CategoryPills
          activeCategory={selectedCuisine}
          onSelectCategory={handleCuisineSelect}
        />
      </section>

      {/* ========================================================
          4. FEATURED KITCHENS (Asymmetric / Bento Grid Layout)
      ======================================================== */}
      <section className="container max-w-[1200px] mx-auto px-4 py-12">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> TOP RATED SPOTLIGHT
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-fg">
              Featured Kitchens & Restaurants
            </h2>
          </div>
          <Button to="/restaurants" variant="ghost" size="sm" iconRight={ArrowRight}>
            View All ({featuredRestaurants.length}+)
          </Button>
        </div>

        {loadingFeatured ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <RestaurantCardSkeleton key={i} />
            ))}
          </div>
        ) : featuredRestaurants.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-border p-8">
            <p className="text-sm font-semibold text-fg-2">No restaurants currently available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          5. HOW IT WORKS (Interactive 4-Step Journey)
      ======================================================== */}
      <section className="container max-w-[1200px] mx-auto px-4 py-16">
        <div className="bg-gradient-to-b from-white to-[#FAF6F0] rounded-3xl border border-border p-8 sm:p-12 shadow-card relative overflow-hidden">
          
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-primary">
              SIMPLE & FAST EXPERIENCE
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-fg">
              How Tiffino Works
            </h2>
            <p className="text-xs sm:text-sm text-fg-2 font-medium">
              From your favorite local kitchens to your dining table in 4 effortless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {[
              {
                step: "01",
                title: "Browse Kitchens",
                desc: "Discover certified home kitchens and top local restaurants in your neighborhood.",
                icon: "🔍",
              },
              {
                step: "02",
                title: "Order Dishes",
                desc: "Select wholesome daily tiffins or gourmet à la carte treats with single checkout.",
                icon: "🍲",
              },
              {
                step: "03",
                title: "Live Preparation",
                desc: "Chefs prepare your meal fresh on-demand with sanitized culinary hygiene.",
                icon: "👨‍🍳",
              },
              {
                step: "04",
                title: "Express Delivery",
                desc: "Track real-time rider GPS via WebSockets with contact-free doorstep drop.",
                icon: "🛵",
              },
            ].map((item, idx) => (
              <div
                key={item.step}
                className="relative bg-white/90 rounded-2xl p-6 border border-border/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-full">
                    STEP {item.step}
                  </span>
                </div>
                <h3 className="font-display font-black text-lg text-fg">{item.title}</h3>
                <p className="text-xs text-fg-2 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. SOCIAL PROOF & TESTIMONIALS
      ======================================================== */}
      <section className="container max-w-[1200px] mx-auto px-4 py-12">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-primary">
            COMMUNITY LOVE
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-fg">
            Loved by 50,000+ Food Lovers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Ananya Sharma",
              role: "Software Engineer",
              review: "Tiffino replaced my daily cooking hassle! The Dum Biryani from Royal Spice arrived piping hot in just 22 minutes.",
              rating: 5,
              dish: "Dum Gosht Biryani",
              avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
            },
            {
              name: "Rohan Verma",
              role: "Product Designer",
              review: "The live real-time status tracking is so smooth. You can literally see when the kitchen starts cooking. Best food app UI hands down!",
              rating: 5,
              dish: "Truffle Tagliatelle",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            },
            {
              name: "Pooja Mehta",
              role: "Startup Founder",
              review: "The daily home-style tiffin subscription has authentic homemade flavors without the excess oil. Highly recommended for busy folks.",
              rating: 5,
              dish: "North Indian Thali",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-border/80 p-6 shadow-card hover:shadow-card-hover transition-all duration-300 space-y-4"
            >
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: item.rating }).map((_, r) => (
                  <Star key={r} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-fg-2 leading-relaxed font-medium italic">
                "{item.review}"
              </p>
              <div className="pt-3 border-t border-border/60 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border border-primary/30"
                />
                <div>
                  <h4 className="text-xs font-bold text-fg">{item.name}</h4>
                  <p className="text-[11px] text-fg-3">{item.role} • Fav: {item.dish}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          7. PARTNER ONBOARDING / PROMO BANNER CTA
      ======================================================== */}
      <section className="container max-w-[1200px] mx-auto px-4 py-16">
        <div className="relative rounded-3xl bg-gradient-primary text-white p-8 sm:p-12 shadow-glow overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-black uppercase tracking-wider backdrop-blur-md">
              PARTNER WITH TIFFINO
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-black text-white leading-tight">
              Are you a restaurant or cloud kitchen owner?
            </h2>
            <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed">
              Grow your culinary business with zero upfront setup fees. Reach thousands of local foodies and manage kitchen orders in real-time.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                to="/profile?tab=partner"
                variant="outline"
                size="lg"
                className="bg-white text-fg font-black hover:bg-slate-100 border-none shadow-md"
              >
                Register Your Kitchen
              </Button>
              <Button
                to="/restaurants"
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/20 font-bold"
              >
                Explore Menus
              </Button>
            </div>
          </div>
          {/* Decorative Backdrops */}
          <div className="absolute right-0 bottom-0 text-[180px] opacity-10 leading-none select-none pointer-events-none">
            🍲
          </div>
        </div>
      </section>

    </div>
  );
};
