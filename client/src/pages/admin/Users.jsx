import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users as UsersIcon, Shield, Search } from "lucide-react";
import api from "../../lib/api";
import { PageHeader } from "../../components/ui/PageHeader";
import { Table } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { Pagination } from "../../components/ui/Pagination";
import { formatDate } from "../../lib/utils";

export const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", { search, role, page }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (search) searchParams.append("search", search);
      if (role) searchParams.append("role", role);
      searchParams.append("page", page.toString());
      searchParams.append("limit", "10");

      const response = await api.get(`/users?${searchParams.toString()}`);
      return response.data;
    },
  });

  const users = data?.users || [];
  const pagination = data?.pagination || { totalPages: 1, page: 1 };

  const columns = [
    {
      header: "User Details",
      render: (row) => (
        <div>
          <p className="font-bold text-fg">{row.fullName || row.name || "User"}</p>
          <p className="text-xs text-fg-3">{row.email}</p>
        </div>
      ),
    },
    {
      header: "Phone",
      accessor: (row) => row.phoneNumber || "—",
    },
    {
      header: "Account Role",
      render: (row) => {
        const isOwner = row.role === "restaurantOwner";
        const isAdmin = row.role === "admin";
        return (
          <span
            className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
              isAdmin
                ? "bg-accent/10 text-accent border-accent/30"
                : isOwner
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-surface-muted text-fg-2 border-border"
            }`}
          >
            {row.role}
          </span>
        );
      },
    },
    {
      header: "Joined Date",
      render: (row) => (
        <span className="text-xs text-fg-3">{formatDate(row.createdAt)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Directory"
        subtitle="Manage customer, restaurant owner, and administrator accounts registered on AnyFeast."
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Input
            icon={Search}
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
          className="bg-surface text-fg text-sm border border-border rounded-md px-3 py-2.5 focus:border-primary focus:outline-none"
        >
          <option value="">All Roles</option>
          <option value="User">Customers (User)</option>
          <option value="restaurantOwner">Restaurant Owners</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      <Table
        columns={columns}
        data={users}
        loading={isLoading}
        emptyTitle="No users found"
        emptyDescription="Try adjusting your search criteria or role filters."
      />

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
};
