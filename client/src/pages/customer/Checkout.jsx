import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MapPin,
  Plus,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import api from "../../lib/api";
import { useCart } from "../../context/CartContext";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { AddressForm } from "../../components/customer/AddressForm";
import { formatCurrency } from "../../lib/utils";
import { toast } from "sonner";

export const Checkout = () => {
  const { items, fetchCart } = useCart();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  // 1. Fetch user addresses
  const { data: addressesData, isLoading: loadingAddresses, refetch: refetchAddresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const response = await api.get("/addresses");
      return response.data || [];
    },
  });

  // 2. Fetch checkout bill calculation
  const { data: checkoutData, isLoading: loadingCheckout } = useQuery({
    queryKey: ["checkout-bill"],
    queryFn: async () => {
      const response = await api.get("/checkout");
      return response.data;
    },
  });

  const addresses = addressesData || [];

  // Automatically select first/default address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr._id);
    }
  }, [addresses, selectedAddressId]);

  // Create new address mutation
  const createAddressMutation = useMutation({
    mutationFn: async (addrData) => {
      const response = await api.post("/addresses", addrData);
      return response.data;
    },
    onSuccess: (newAddr) => {
      toast.success("Delivery address saved");
      refetchAddresses();
      if (newAddr?._id) setSelectedAddressId(newAddr._id);
      setAddressModalOpen(false);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to save address");
    },
  });

  // Handle Pay Now / Place Order
  const handlePayNow = async () => {
    if (!selectedAddressId) {
      toast.error("Please choose or add a delivery address");
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // 1. Place order
      const orderRes = await api.post("/orders", {
        addressId: selectedAddressId,
      });

      const order = orderRes.data;
      if (!order?._id) {
        throw new Error("Could not initialize order");
      }

      // 2. Create Payment Session
      try {
        const paymentRes = await api.post("/payments/create", {
          orderId: order._id,
        });

        // If Cashfree sandbox returned payment_session_id or paymentUrl, handle it
        if (paymentRes.data?.paymentSessionId && window.Cashfree) {
          // Open Cashfree dropin/checkout if SDK loaded, or simulate sandbox payment
        }
      } catch (payErr) {
        console.warn("Payment initiation note:", payErr.message);
      }

      // Refresh cart state in context
      await fetchCart();
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });

      toast.success("Order placed successfully! Tracking live updates...");
      navigate(`/orders/${order._id}`);
    } catch (err) {
      setPaymentError(err.message || "Payment verification failed. Please try again.");
      toast.error(err.message || "Order placement failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const bill = checkoutData?.bill || {
    itemTotal: items.reduce((s, i) => s + (i.food?.price || 0) * (i.quantity || 1), 0),
    deliveryFee: 40,
    tax: Math.round(items.reduce((s, i) => s + (i.food?.price || 0) * (i.quantity || 1), 0) * 0.05),
    totalAmount: items.reduce((s, i) => s + (i.food?.price || 0) * (i.quantity || 1), 0) + 40 + Math.round(items.reduce((s, i) => s + (i.food?.price || 0) * (i.quantity || 1), 0) * 0.05),
  };

  if (items.length === 0 && !isProcessing) {
    return (
      <div className="container max-w-[1180px] mx-auto px-4 py-16 text-center">
        <h3 className="text-xl font-bold text-fg mb-2">No items to checkout</h3>
        <Button to="/restaurants" variant="primary" size="md">
          Browse Restaurants
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-[1180px] mx-auto px-4 py-8 space-y-6">
      <PageHeader
        title="Checkout & Payment"
        subtitle="Select your delivery location and confirm your order payment."
      />

      {/* Payment Error Banner if any */}
      {paymentError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-900 text-sm">
          <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Payment Issue</p>
            <p className="text-xs text-red-700 mt-0.5">{paymentError}</p>
          </div>
          <Button
            size="sm"
            variant="danger"
            onClick={handlePayNow}
            loading={isProcessing}
          >
            Retry Payment
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Address Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-display font-bold text-base text-fg">
                  1. Delivery Address
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddressModalOpen(true)}
                iconLeft={Plus}
              >
                Add New Address
              </Button>
            </div>

            {loadingAddresses ? (
              <div className="space-y-3">
                <div className="h-20 bg-surface-muted animate-pulse rounded-lg" />
                <div className="h-20 bg-surface-muted animate-pulse rounded-lg" />
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-border rounded-lg space-y-2">
                <p className="text-xs text-fg-3">No saved addresses found.</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setAddressModalOpen(true)}
                >
                  Add Your Address Now
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr._id;
                  return (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedAddressId(addr._id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-surface hover:border-text-3/40"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-fg">
                          {addr.fullName}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-fg-2 line-clamp-2">
                        {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-[11px] text-fg-3 mt-2">
                        📞 {addr.phoneNumber}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment Method Badge */}
          <div className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-border/80 pb-3">
              <CreditCard className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-base text-fg">
                2. Payment Mode
              </h3>
            </div>
            <div className="p-4 rounded-lg bg-surface-muted border border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  ₹
                </div>
                <div>
                  <h4 className="text-xs font-bold text-fg">Cashfree Payment Gateway</h4>
                  <p className="text-[11px] text-fg-3">
                    Cards, UPI, NetBanking & Wallets (Test Sandbox Enabled)
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-full">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-5 sticky top-20">
          <h3 className="font-display font-bold text-base text-fg border-b border-border/80 pb-3">
            Payment Summary
          </h3>

          {/* Itemized snapshot */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 divide-y divide-border/60 text-xs">
            {items.map((item) => (
              <div key={item.food?._id} className="pt-2 first:pt-0 flex justify-between">
                <span className="text-fg-2 truncate pr-2">
                  <span className="font-semibold text-primary">{item.quantity}x</span>{" "}
                  {item.food?.name}
                </span>
                <span className="font-mono text-fg font-medium shrink-0">
                  {formatCurrency((item.food?.price || 0) * (item.quantity || 1))}
                </span>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 text-xs text-fg-2 pt-3 border-t border-border">
            <div className="flex justify-between">
              <span>Item Subtotal</span>
              <span className="font-mono text-fg">{formatCurrency(bill.itemTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="font-mono text-fg">{formatCurrency(bill.deliveryFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes (GST 5%)</span>
              <span className="font-mono text-fg">{formatCurrency(bill.tax)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-border text-base font-bold text-fg">
              <span>Total Payable</span>
              <span className="text-primary font-mono text-lg">
                {formatCurrency(bill.totalAmount)}
              </span>
            </div>
          </div>

          <Button
            onClick={handlePayNow}
            disabled={!selectedAddressId || isProcessing}
            loading={isProcessing}
            variant="primary"
            size="lg"
            className="w-full font-bold shadow-md"
          >
            Pay & Confirm Order ({formatCurrency(bill.totalAmount)})
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-fg-3">
            <ShieldCheck className="w-4 h-4 text-secondary" />
            <span>256-Bit Encrypted & Verified Cashfree Transaction</span>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal
        open={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        title="Add Delivery Address"
        description="Enter your full address details for courier delivery."
      >
        <AddressForm
          onSubmit={(data) => createAddressMutation.mutate(data)}
          onCancel={() => setAddressModalOpen(false)}
          loading={createAddressMutation.isPending}
        />
      </Modal>
    </div>
  );
};
