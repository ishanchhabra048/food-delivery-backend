import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  User as UserIcon,
  MapPin,
  LogOut,
  ChefHat,
  ShieldAlert,
  Menu as MenuIcon,
  X,
  Compass,
  FileText,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

export const Navbar = () => {
  const { user, isAuthenticated, isOwner, isAdmin, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-border shadow-[0_4px_25px_-5px_rgba(13,19,31,0.07)]"
          : "bg-surface/80 backdrop-blur-sm border-b border-border/50"
      )}
    >
      <div className="container max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo & Location */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-black text-xl shadow-glow group-hover:scale-105 transition-transform duration-200">
              🍲
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-2xl tracking-tight text-fg leading-none">
                Tiff<span className="text-gradient">ino</span>
              </span>
              <span className="text-[10px] font-bold text-fg-3 tracking-widest uppercase mt-0.5">
                Fresh & Fast
              </span>
            </div>
          </Link>

          {/* Location Chip */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-fg-2 bg-surface-muted/80 px-3.5 py-1.5 rounded-full border border-border/70 hover:border-primary/40 transition-colors cursor-pointer">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="font-semibold text-fg">Metropolis Central</span>
            <span className="text-[10px] text-primary font-bold px-1.5 py-0.5 bg-primary/10 rounded-full ml-1">
              Live
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-semibold text-fg-2">
          <Link
            to="/restaurants"
            className={cn(
              "px-3.5 py-2 rounded-lg transition-all flex items-center gap-2",
              isActive("/restaurants")
                ? "text-primary bg-primary/10 font-bold"
                : "hover:text-fg hover:bg-surface-muted"
            )}
          >
            <Compass className="w-4 h-4" />
            <span>Explore Kitchens</span>
          </Link>

          {isAuthenticated && (
            <Link
              to="/orders"
              className={cn(
                "px-3.5 py-2 rounded-lg transition-all flex items-center gap-2",
                isActive("/orders")
                  ? "text-primary bg-primary/10 font-bold"
                  : "hover:text-fg hover:bg-surface-muted"
              )}
            >
              <FileText className="w-4 h-4" />
              <span>My Orders</span>
            </Link>
          )}

          {isOwner && (
            <Link
              to="/owner"
              className={cn(
                "px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 text-primary font-bold bg-primary/10",
                isActive("/owner") && "ring-2 ring-primary/30"
              )}
            >
              <ChefHat className="w-4 h-4" />
              <span>Kitchen Portal</span>
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                "px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 text-violet font-bold bg-purple-50",
                isActive("/admin") && "ring-2 ring-violet/30"
              )}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin HQ</span>
            </Link>
          )}
        </nav>

        {/* Actions & Profile */}
        <div className="flex items-center gap-3">
          {/* Cart Button with spring counter bump */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-surface-muted hover:bg-border/70 text-fg transition-all hover:scale-105 active:scale-95 border border-border/80 shadow-sm"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-5 h-5 text-fg" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-gradient-primary text-white text-[11px] font-black rounded-full flex items-center justify-center animate-in zoom-in-50 duration-200 shadow-glow">
                {itemCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1 pl-3 pr-1 rounded-full border border-border bg-surface hover:border-primary/40 transition-all shadow-sm"
              >
                <span className="text-xs font-bold text-fg hidden sm:inline-block max-w-[120px] truncate">
                  {user.fullName || user.name || "Account"}
                </span>
                <div className="w-8 h-8 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {(user.fullName || user.email || "U")[0].toUpperCase()}
                </div>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-floating border border-border py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-border/60">
                    <p className="text-xs font-bold text-fg truncate">
                      {user.fullName || user.name}
                    </p>
                    <p className="text-[11px] text-fg-3 truncate">{user.email}</p>
                    <span className="inline-block mt-1.5 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {user.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-fg hover:bg-surface-muted transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-fg-2" />
                      <span>My Profile & Settings</span>
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-fg hover:bg-surface-muted transition-colors"
                    >
                      <FileText className="w-4 h-4 text-fg-2" />
                      <span>Order History</span>
                    </Link>

                    {isOwner && (
                      <Link
                        to="/owner"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/10 transition-colors"
                      >
                        <ChefHat className="w-4 h-4" />
                        <span>Kitchen Dashboard</span>
                      </Link>
                    )}

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-violet hover:bg-purple-50 transition-colors"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        <span>Admin Console</span>
                      </Link>
                    )}
                  </div>

                  <div className="pt-1 border-t border-border/60">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-danger hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button to="/login" variant="ghost" size="sm">
                Sign In
              </Button>
              <Button to="/register" variant="primary" size="sm">
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-fg hover:bg-surface-muted"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-white px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <Link
            to="/restaurants"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-fg hover:bg-surface-muted"
          >
            Explore Kitchens
          </Link>
          {isAuthenticated && (
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-fg hover:bg-surface-muted"
            >
              My Orders
            </Link>
          )}
          {isOwner && (
            <Link
              to="/owner"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-primary bg-primary/10"
            >
              Kitchen Dashboard
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-violet bg-purple-50"
            >
              Admin HQ
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
