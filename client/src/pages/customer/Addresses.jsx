import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Plus, Trash2, Edit2, CheckCircle2 } from "lucide-react";
import api from "../../lib/api";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { AddressForm } from "../../components/customer/AddressForm";
import { EmptyState } from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import { toast } from "sonner";

export const Addresses = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const { data: addresses, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const response = await api.get("/addresses");
      return response.data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (formData) => {
      if (editingAddress?._id) {
        const response = await api.patch(`/addresses/${editingAddress._id}`, formData);
        return response.data;
      } else {
        const response = await api.post("/addresses", formData);
        return response.data;
      }
    },
    onSuccess: () => {
      toast.success(editingAddress ? "Address updated" : "Address saved");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setModalOpen(false);
      setEditingAddress(null);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to save address");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/addresses/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Address deleted");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete address");
    },
  });

  const handleEdit = (addr) => {
    setEditingAddress(addr);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setModalOpen(true);
  };

  const addressList = addresses || [];

  return (
    <div className="container max-w-[1180px] mx-auto px-4 py-8 space-y-6">
      <PageHeader
        title="Saved Addresses"
        subtitle="Manage your home, work, and family delivery locations."
        actions={
          <Button variant="primary" size="md" onClick={handleAddNew} iconLeft={Plus}>
            Add New Address
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
        </div>
      ) : addressList.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No saved addresses yet"
          description="Add your delivery address to quickly checkout your orders in future."
          actionText="Add New Address"
          onAction={handleAddNew}
          className="my-8"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addressList.map((addr) => (
            <div
              key={addr._id}
              className="bg-surface rounded-xl border border-border p-5 shadow-card space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-bold text-sm text-fg flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{addr.fullName}</span>
                  </h4>
                  {addr.isDefault && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                      Default
                    </span>
                  )}
                </div>

                <p className="text-xs text-fg-2 leading-relaxed">
                  {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className="text-xs text-fg-3 mt-1">📞 {addr.phoneNumber}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(addr)}
                  iconLeft={Edit2}
                  className="text-xs"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMutation.mutate(addr._id)}
                  loading={deleteMutation.isPending}
                  iconLeft={Trash2}
                  className="text-xs text-danger hover:text-danger hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAddress(null);
        }}
        title={editingAddress ? "Edit Delivery Address" : "Add New Delivery Address"}
        description="Provide complete address information for on-time courier delivery."
      >
        <AddressForm
          initialData={editingAddress}
          onSubmit={(data) => saveMutation.mutate(data)}
          onCancel={() => {
            setModalOpen(false);
            setEditingAddress(null);
          }}
          loading={saveMutation.isPending}
        />
      </Modal>
    </div>
  );
};
