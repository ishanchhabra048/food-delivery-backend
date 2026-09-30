import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { formatCurrency } from "../../lib/utils";

export const Cart = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    tax,
    total,
  } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container max-w-[1180px] mx-auto px-4 py-16">
        <EmptyState
          iconType="cart"
          title="Your cart is currently empty"
          description="Explore our handpicked local kitchens and fill your cart with delicious meals."
          actionText="Browse Restaurants"
          actionTo="/restaurants"
        />
      </div>
    );
  }

  return (
    <div className="container max-w-[1180px] mx-auto px-4 py-8 space-y-6">
      <PageHeader
        title="Review Your Cart"
        subtitle="Confirm dishes, quantities, and proceed to choose your delivery address."
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-danger hover:text-danger hover:bg-red-50"
          >
            Clear Entire Cart
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart items list */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border divide-y divide-border shadow-sm p-2 sm:p-6">
          {items.map((item) => {
            const food = item.food;
            if (!food) return null;
            return (
              <div
                key={food._id}
                className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-md bg-surface-muted border border-border overflow-hidden shrink-0">
                    <img
                      src={food.image?.url || "/placeholders/food.svg"}
                      alt={food.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-fg">{food.name}</h4>
                    <p className="text-xs font-bold text-primary font-mono mt-0.5">
                      {formatCurrency(food.price)} each
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                  {/* Stepper */}
                  <div className="flex items-center gap-1.5 bg-surface-muted border border-border rounded-md px-1.5 py-1">
                    <button
                      onClick={() =>
                        updateQuantity(food._id, (item.quantity || 1) - 1)
                      }
                      className="p-1 text-fg-2 hover:text-fg hover:bg-surface rounded transition-colors"
                      title="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-fg px-2 min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(food._id, (item.quantity || 1) + 1)
                      }
                      className="p-1 text-fg-2 hover:text-fg hover:bg-surface rounded transition-colors"
                      title="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-mono font-bold text-sm text-fg min-w-[70px] text-right">
                    {formatCurrency(food.price * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeFromCart(food._id)}
                    className="p-1.5 text-fg-3 hover:text-danger hover:bg-red-50 rounded transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Bill */}
        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-5 sticky top-20">
          <h3 className="font-display font-bold text-base text-fg border-b border-border/80 pb-3">
            Order Bill Summary
          </h3>

          <div className="space-y-2 text-xs text-fg-2">
            <div className="flex justify-between">
              <span>Food Items Subtotal</span>
              <span className="font-semibold text-fg font-mono">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Standard Delivery</span>
              <span className="font-semibold text-fg font-mono">
                {formatCurrency(deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & GST (5%)</span>
              <span className="font-semibold text-fg font-mono">
                {formatCurrency(tax)}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-border/80 text-base font-bold text-fg">
              <span>Total Payable</span>
              <span className="text-primary font-mono text-lg">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          <Button
            onClick={() => navigate("/checkout")}
            variant="primary"
            size="lg"
            className="w-full font-bold shadow-md"
            iconRight={ArrowRight}
          >
            Proceed to Checkout
          </Button>

          <p className="text-[11px] text-fg-3 text-center">
            🔒 Safe & encrypted Cashfree sandbox payment checkout
          </p>
        </div>
      </div>
    </div>
  );
};
