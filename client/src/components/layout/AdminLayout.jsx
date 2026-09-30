import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  UserCheck,
  LogOut,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard, end: true },
    { label: "Owner Requests", href: "/admin/owner-requests", icon: UserCheck },
    { label: "Users Directory", href: "/admin/users", icon: Users },
    { label: "Restaurants", href: "/admin/restaurants", icon: Store },
  ];

  return (
    <div className="min-h-screen flex bg-bg text-fg">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col shrink-0 hidden md:flex">
        {/* Brand */}
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <div>
              <span className="font-display font-bold text-lg text-fg block leading-tight">
                Any<span className="text-primary">Feast</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> System Admin
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-white shadow-sm"
                      : "text-fg-2 hover:text-fg hover:bg-surface-muted"
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Info & Back Link */}
        <div className="p-4 border-t border-border space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-fg-2 hover:text-primary rounded-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Switch to Customer App</span>
          </Link>

          <div className="flex items-center justify-between p-2 rounded-lg bg-surface-muted border border-border/60">
            <div className="truncate pr-2">
              <p className="text-xs font-bold text-fg truncate">
                {user?.fullName}
              </p>
              <p className="text-[10px] text-fg-3 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-fg-3 hover:text-danger rounded-md hover:bg-surface"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-surface border-b border-border p-4 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            <span className="font-bold text-base text-fg">Admin Console</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xs text-primary font-medium">
              Customer View
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex border-b border-border bg-surface-muted overflow-x-auto p-2 gap-2 text-xs">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "px-3 py-1.5 rounded-full font-medium whitespace-nowrap",
                  isActive ? "bg-accent text-white" : "text-fg-2 bg-surface"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
