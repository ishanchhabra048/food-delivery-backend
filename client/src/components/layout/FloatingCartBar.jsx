import React from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../lib/utils";

export const FloatingCartBar = () => {
  const { itemCount, subtotal, isCartOpen, setIsCartOpen } = useCart();

  if (itemCount === 0 || isCartOpen) return null;

  return (
    <aside aria-label="Cart summary" className="fixed bottom-4 right-4 sm:right-8 z-30 animate-in slide-in-from-bottom-5 duration-300">
      <button
        onClick={() => setIsCartOpen(true)}
        className="flex items-center gap-3 bg-surface/95 backdrop-blur-md border-2 border-primary text-fg px-5 py-3 rounded-full shadow-floating hover:shadow-card-hover transition-all hover:scale-105 active:scale-95"
      >
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
          {itemCount}
        </div>
        <div className="text-left">
          <p className="text-[11px] font-medium text-fg-2 uppercase tracking-wider">
            Cart Subtotal
          </p>
          <p className="text-sm font-bold text-primary font-mono leading-none">
            {formatCurrency(subtotal)}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-primary ml-1">
          <ArrowRight className="w-4 h-4" />
        </div>
      </button>
    </aside>
  );
};
