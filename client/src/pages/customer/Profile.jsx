import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Lock, Store, Sparkles, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import { PageHeader } from "../../components/ui/PageHeader";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Button } from "../../components/ui/Button";
import { StatusPill } from "../../components/ui/StatusPill";
import { toast } from "sonner";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").trim(),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit phone number"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export const Profile = () => {
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [partnerReason, setPartnerReason] = useState("");

  // 1. Fetch user's own owner request if exists
  const { data: requestData, refetch: refetchRequests } = useQuery({
    queryKey: ["my-owner-requests"],
    queryFn: async () => {
      try {
        const response = await api.get("/owner-requests");
        return response.data || [];
      } catch {
        return [];
      }
    },
  });

  const requests = Array.isArray(requestData) ? requestData : requestData?.requests || [];
  const latestRequest = requests[0];

  // 2. Profile update form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: updatingProfile },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || user?.name || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  // 3. Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors, isSubmitting: changingPassword },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onUpdateProfile = async (data) => {
    try {
      await api.patch("/users/update-account", data);
      await refreshUser();
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    }
  };

  const onChangePassword = async (data) => {
    try {
      await api.post("/users/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      resetPasswordForm();
      toast.success("Password changed successfully");
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    }
  };

  const partnerMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/owner-requests", {
        reason: partnerReason,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Restaurant partner application submitted!");
      setPartnerReason("");
      refetchRequests();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit request");
    },
  });

  return (
    <div className="container max-w-[1180px] mx-auto px-4 py-8 space-y-8">
      <PageHeader
        title="Profile & Settings"
        subtitle="Manage your personal details, security credentials, and partner status."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Details */}
        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-border/80 pb-3">
            <User className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-base text-fg">
              Personal Information
            </h3>
          </div>

          <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-fg mb-1">
                Full Name
              </label>
              <Input
                {...registerProfile("fullName")}
                error={profileErrors.fullName?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-fg mb-1">
                Email Address
              </label>
              <Input value={user?.email || ""} disabled className="bg-surface-muted opacity-80" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-fg mb-1">
                Phone Number
              </label>
              <Input
                {...registerProfile("phoneNumber")}
                error={profileErrors.phoneNumber?.message}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" size="md" loading={updatingProfile}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-border/80 pb-3">
            <Lock className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-base text-fg">
              Security & Password
            </h3>
          </div>

          <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-fg mb-1">
                Current Password
              </label>
              <Input
                type="password"
                {...registerPassword("currentPassword")}
                error={passwordErrors.currentPassword?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-fg mb-1">
                New Password
              </label>
              <Input
                type="password"
                {...registerPassword("newPassword")}
                error={passwordErrors.newPassword?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-fg mb-1">
                Confirm New Password
              </label>
              <Input
                type="password"
                {...registerPassword("confirmPassword")}
                error={passwordErrors.confirmPassword?.message}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="outline" size="md" loading={changingPassword}>
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Become an Owner Card (LLD Section 5.1) */}
      {user?.role === "User" && (
        <div className="bg-gradient-to-r from-orange-50 via-pink-50 to-amber-50 rounded-xl border border-orange-200 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" /> Partner with AnyFeast
              </div>
              <h3 className="text-xl font-bold font-display text-fg">
                Become a Restaurant Partner
              </h3>
              <p className="text-xs sm:text-sm text-fg-2 leading-relaxed">
                Reach thousands of hungry food lovers across the city. List your kitchen, customize your menu items, and manage live incoming orders.
              </p>
            </div>

            {latestRequest ? (
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-border space-y-2 min-w-[260px]">
                <span className="text-xs text-fg-3 block">Current Application Status:</span>
                <StatusPill status={latestRequest.status} />
                <p className="text-[11px] text-fg-2 mt-1">
                  {latestRequest.status === "PENDING"
                    ? "Our admin team is reviewing your application."
                    : latestRequest.status === "APPROVED"
                    ? "Congratulations! You can now access your Owner Dashboard."
                    : "Your request was not approved at this time."}
                </p>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-border space-y-3 min-w-[300px]">
                <label className="block text-xs font-semibold text-fg">
                  Tell us about your restaurant:
                </label>
                <Textarea
                  value={partnerReason}
                  onChange={(e) => setPartnerReason(e.target.value)}
                  placeholder="e.g. Italian pizzeria with 20 seats in downtown..."
                  rows={2}
                  className="text-xs"
                />
                <Button
                  onClick={() => partnerMutation.mutate()}
                  loading={partnerMutation.isPending}
                  disabled={!partnerReason.trim()}
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  Submit Application
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
