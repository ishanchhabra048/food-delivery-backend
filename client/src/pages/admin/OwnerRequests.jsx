import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import { PageHeader } from "../../components/ui/PageHeader";
import { OwnerRequestRow } from "../../components/admin/OwnerRequestRow";
import { EmptyState } from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import { cn } from "../../lib/utils";
import { toast } from "sonner";

const statusFilterTabs = [
  { label: "All Requests", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

export const OwnerRequests = () => {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState("PENDING");

  const { data: requestList, isLoading } = useQuery({
    queryKey: ["admin-owner-requests"],
    queryFn: async () => {
      const response = await api.get("/owner-requests");
      return response.data || [];
    },
  });

  const requests = Array.isArray(requestList) ? requestList : requestList?.requests || [];

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.patch(`/owner-requests/${id}/approve`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Owner request approved! User promoted to restaurantOwner.");
      queryClient.invalidateQueries({ queryKey: ["admin-owner-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err) => {
      toast.error(err.message || "Approval failed");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }) => {
      const response = await api.patch(`/owner-requests/${id}/reject`, { reason });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Owner request rejected");
      queryClient.invalidateQueries({ queryKey: ["admin-owner-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err) => {
      toast.error(err.message || "Rejection failed");
    },
  });

  const filteredRequests = requests.filter((req) => {
    if (!selectedStatus) return true;
    return req.status === selectedStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Restaurant Partner Applications"
        subtitle="Approve or decline partner requests to grant restaurant owner privileges."
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {statusFilterTabs.map((tab) => {
          const isActive = selectedStatus === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setSelectedStatus(tab.value)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors",
                isActive
                  ? "bg-accent text-white shadow-sm"
                  : "bg-surface text-fg-2 border border-border hover:bg-surface-muted"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      ) : filteredRequests.length === 0 ? (
        <EmptyState
          title="No requests in this category"
          description="There are currently no partner applications matching the selected filter."
          className="my-8"
        />
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <OwnerRequestRow
              key={req._id}
              request={req}
              onApprove={(id) => approveMutation.mutate(id)}
              onReject={(id, reason) => rejectMutation.mutate({ id, reason })}
              loading={approveMutation.isPending || rejectMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
};
