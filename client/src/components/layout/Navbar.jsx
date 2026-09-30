import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Button } from "../ui/Button";

export const Navbar = () => {
  const { user, isAuthenticated, isOwner, isAdmin, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-md border-b border-border transition-all">
      <div className="container max-w-[1180px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo & Location */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-md bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              🍽️
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-fg">
              Tiff<span className="text-primary">ino</span>
            </span>
          </Link>

          {/* Location Chip */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-fg-2 bg-surface-muted px-3 py-1.5 rounded-full border border-border">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium text-fg">Metropolis Central</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-fg-2">
          <Link
            to="/restaurants"
            className="hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4" />
            <span>Restaurants</span>
          </Link>
          {isAuthenticated && (
            <Link
              to="/orders"
              className="hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>My Orders</span>
            </Link>
          )}
        </nav>

        {/* Actions & Profile */}
        <div className="flex items-center gap-3">
          {/* Cart Button with spring counter bump */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full bg-surface-muted hover:bg-border/60 text-fg transition-transform active:scale-90"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-in zoom-in-50 duration-200 shadow-sm">
                {itemCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 pr-2 rounded-full border border-border hover:border-primary/40 bg-surface transition-colors"
              >
                <span className="text-xs font-semibold text-fg hidden sm:inline-block max-w-[100px] truncate">
                  {user.fullName || user.name || "My Account"}
                </span>
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  {(user.fullName || user.email || "U")[0].toUpperCase()}
                </div>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-surface rounded-xl shadow-xl border border-border py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-border/60">
                    <p className="text-xs font-semibold text-fg truncate">
                      {user.fullName}
                    </p>
                    <p className="text-[11px] text-fg-3 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-muted text-primary border border-primary/20">
                      {user.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-fg hover:bg-surface-muted transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-fg-2" />
                      <span>Profile & Settings</span>
                    </Link>
                    <Link
                      to="/addresses"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-fg hover:bg-surface-muted transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-fg-2" />
                      <span>Saved Addresses</span>
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-fg hover:bg-surface-muted transition-colors"
                    >
                      <FileText className="w-4 h-4 text-fg-2" />
                      <span>Order History</span>
                    </Link>

                    {/* Role portals */}
                    {isOwner && (
                      <Link
                        to="/owner"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors border-t border-border/60 mt-1"
                      >
                        <ChefHat className="w-4 h-4" />
                        <span>Owner Dashboard</span>
                      </Link>
                    )}

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-accent hover:bg-accent/5 transition-colors border-t border-border/60 mt-1"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    {user.role === "User" && (
                      <Link
                        to="/profile?tab=partner"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-fg-2 hover:bg-surface-muted transition-colors border-t border-border/60 mt-1"
                      >
                        <UserCheck className="w-4 h-4 text-primary" />
                        <span>Become a Restaurant Partner</span>
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-border/60 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-danger hover:bg-red-50 transition-colors text-left"
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
                Log In
              </Button>
              <Button to="/register" variant="primary" size="sm">
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-fg-2 hover:text-fg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-3 space-y-2">
          <Link
            to="/restaurants"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-fg hover:text-primary"
          >
            Explore Restaurants
          </Link>
          {isAuthenticated && (
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-fg hover:text-primary"
            >
              My Orders
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
