import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Store, Search } from "lucide-react";
import api from "../../lib/api";
import { PageHeader } from "../../components/ui/PageHeader";
import { Table } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { StatusPill } from "../../components/ui/StatusPill";
import { Pagination } from "../../components/ui/Pagination";
import { formatDate } from "../../lib/utils";

export const AdminRestaurants = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-restaurants", { search, page }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (search) searchParams.append("search", search);
      searchParams.append("page", page.toString());
      searchParams.append("limit", "10");

      const response = await api.get(`/restaurants?${searchParams.toString()}`);
      return response.data;
    },
  });

  const restaurants = data?.restaurants || [];
  const pagination = data?.pagination || { totalPages: 1, page: 1 };

  const columns = [
    {
      header: "Restaurant Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-surface-muted border border-border overflow-hidden shrink-0">
            <img
              src={row.image?.url || "/placeholders/restaurant.svg"}
              alt={row.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-bold text-fg">{row.name}</p>
            <p className="text-xs text-fg-3 line-clamp-1">{row.address}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Cuisine Specialty",
      render: (row) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-muted border border-border text-fg-2">
          {row.cuisine || "General"}
        </span>
      ),
    },
    {
      header: "Owner Contact",
      render: (row) => (
        <div>
          <p className="text-xs font-medium text-fg">{row.owner?.fullName || "Owner"}</p>
          <p className="text-[11px] text-fg-3">{row.owner?.email || "—"}</p>
        </div>
      ),
    },
    {
      header: "Store Status",
      render: (row) => (
        <StatusPill status={row.isOpen !== false ? "OPEN" : "CLOSED"} />
      ),
    },
    {
      header: "Registered On",
      render: (row) => (
        <span className="text-xs text-fg-3">{formatDate(row.createdAt)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Restaurants Directory"
        subtitle="Manage all verified kitchens, cuisines, and operating availability on the platform."
      />

      <div className="relative w-full sm:w-72">
        <Input
          icon={Search}
          placeholder="Search restaurant names..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <Table
        columns={columns}
        data={restaurants}
        loading={isLoading}
        emptyTitle="No restaurants found"
        emptyDescription="Try adjusting your search terms."
      />

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
};
