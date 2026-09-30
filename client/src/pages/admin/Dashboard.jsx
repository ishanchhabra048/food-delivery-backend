import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Store,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import api from "../../lib/api";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";

export const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await api.get("/admin/stats");
      return response.data;
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Control Center"
        subtitle="Platform-wide metrics, partner approvals, user directory, and restaurant management."
        badge={
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
            Administrator Mode
          </span>
        }
      />

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface rounded-xl border border-border p-6 shadow-card space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-fg-2">
            <span>Total Registered Users</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          {isLoading ? (
            <Skeleton className="h-9 w-20" />
          ) : (
            <p className="font-display font-extrabold text-3xl text-fg">
              {stats?.users || 0}
            </p>
          )}
          <Link
            to="/admin/users"
            className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1 pt-1"
          >
            <span>View all users</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-surface rounded-xl border border-border p-6 shadow-card space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-fg-2">
            <span>Active Restaurants</span>
            <Store className="w-4 h-4 text-secondary" />
          </div>
          {isLoading ? (
            <Skeleton className="h-9 w-20" />
          ) : (
            <p className="font-display font-extrabold text-3xl text-fg">
              {stats?.restaurants || 0}
            </p>
          )}
          <Link
            to="/admin/restaurants"
            className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1 pt-1"
          >
            <span>Browse restaurants</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-surface rounded-xl border border-border p-6 shadow-card space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-fg-2">
            <span>Pending Owner Requests</span>
            <UserCheck className="w-4 h-4 text-accent" />
          </div>
          {isLoading ? (
            <Skeleton className="h-9 w-20" />
          ) : (
            <p className="font-display font-extrabold text-3xl text-accent">
              {stats?.pendingOwnerRequests || 0}
            </p>
          )}
          <Link
            to="/admin/owner-requests"
            className="text-xs text-accent font-semibold hover:underline inline-flex items-center gap-1 pt-1"
          >
            <span>Review applications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Access Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-3">
          <h3 className="font-display font-bold text-base text-fg">
            Partner Applications
          </h3>
          <p className="text-xs text-fg-2 leading-relaxed">
            Review incoming requests from registered customers wanting to list their kitchens on Tiffino.
          </p>
          <Button to="/admin/owner-requests" variant="primary" size="md" iconRight={ArrowRight}>
            Open Review Queue ({stats?.pendingOwnerRequests || 0})
          </Button>
        </div>

        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-3">
          <h3 className="font-display font-bold text-base text-fg">
            User Directory & Access Controls
          </h3>
          <p className="text-xs text-fg-2 leading-relaxed">
            Search, inspect roles, and audit registered customer and restaurant accounts.
          </p>
          <Button to="/admin/users" variant="outline" size="md" iconRight={ArrowRight}>
            Manage Users
          </Button>
        </div>
      </div>
    </div>
  );
};
