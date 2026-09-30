import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, AlertTriangle } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { formatCurrency } from "../../lib/utils";

export const CartDrawer = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    tax,
    total,
    conflictModal,
    resolveConflict,
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />

        {/* Slide-over panel */}
        <div className="relative w-full max-w-md bg-surface h-full shadow-2xl z-10 flex flex-col border-l border-border animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-base text-fg">Your Order Cart</h3>
            </div>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-danger hover:underline px-2 py-1"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-md text-fg-3 hover:text-fg hover:bg-surface-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-border">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center text-primary">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-fg">Cart is empty</h4>
                <p className="text-xs text-fg-2 max-w-xs">
                  Browse through our restaurants to add dishes to your feast!
                </p>
                <Button
                  to="/restaurants"
                  onClick={() => setIsCartOpen(false)}
                  variant="primary"
                  size="sm"
                  className="mt-2"
                >
                  Browse Restaurants
                </Button>
              </div>
            ) : (
              items.map((item) => {
                const food = item.food;
                if (!food) return null;
                return (
                  <div key={food._id} className="py-3.5 flex items-center gap-3">
                    {/* Square Thumbnail */}
                    <div className="w-14 h-14 rounded-md bg-surface-muted border border-border overflow-hidden shrink-0">
                      <img
                        src={food.image?.url || "/placeholders/food.svg"}
                        alt={food.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholders/food.svg";
                        }}
                      />
                    </div>

                    {/* Food Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-fg truncate">
                        {food.name}
                      </h4>
                      <p className="text-xs font-bold text-primary mt-0.5">
                        {formatCurrency(food.price)}
                      </p>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-1.5 bg-surface-muted border border-border rounded-md px-1 py-0.5">
                      <button
                        onClick={() =>
                          updateQuantity(food._id, (item.quantity || 1) - 1)
                        }
                        className="p-1 text-fg-2 hover:text-fg hover:bg-surface rounded transition-colors"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-fg px-1.5 min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(food._id, (item.quantity || 1) + 1)
                        }
                        className="p-1 text-fg-2 hover:text-fg hover:bg-surface rounded transition-colors"
                        title="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(food._id)}
                      className="text-fg-3 hover:text-danger p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Bill & Checkout */}
          {items.length > 0 && (
            <div className="p-4 bg-surface-muted border-t border-border space-y-3">
              <div className="space-y-1.5 text-xs text-fg-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-fg">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Delivery Fee</span>
                  <span className="font-semibold text-fg">
                    {formatCurrency(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & GST (5%)</span>
                  <span className="font-semibold text-fg">
                    {formatCurrency(tax)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border/80 text-sm font-bold text-fg">
                  <span>Total Amount</span>
                  <span className="text-primary font-mono">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate("/checkout");
                }}
                variant="primary"
                size="lg"
                className="w-full font-bold shadow-md"
                iconRight={ArrowRight}
              >
                Proceed to Checkout ({formatCurrency(total)})
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Single-restaurant conflict Modal */}
      <Modal
        open={conflictModal.isOpen}
        onClose={() => resolveConflict(false)}
        title="Replace cart items?"
        description="Your cart already contains items from a different restaurant. Would you like to reset your cart and start a new order with this item?"
      >
        <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs my-4">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
          <span>
            Food delivery platforms require all items in a single order to be prepared by the same restaurant kitchen.
          </span>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            size="md"
            onClick={() => resolveConflict(false)}
          >
            Keep Existing Cart
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => resolveConflict(true)}
          >
            Start Fresh Order
          </Button>
        </div>
      </Modal>
    </>
  );
};
