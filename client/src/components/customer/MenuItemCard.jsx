import React, { useState } from "react";
import { Plus, Minus, Check, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../lib/utils";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

export const MenuItemCard = ({ food, restaurant, className }) => {
  const { items, addToCart, updateQuantity } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  if (!food) return null;

  const cartItem = items.find((item) => (item.food?._id || item.food) === food._id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = async () => {
    const success = await addToCart(food, restaurant);
    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 900);
    }
  };

  const imageUrl =
    food.image?.url ||
    (typeof food.image === "string" ? food.image : "") ||
    "/placeholders/food.svg";

  const isAvailable = food.isAvailable !== false;

  return (
    <div
      className={cn(
        "bg-surface rounded-lg border border-border p-4 flex gap-4 shadow-card hover:shadow-card-hover transition-all duration-200",
        !isAvailable && "opacity-60 grayscale-[40%]",
        className
      )}
    >
      {/* Square Thumbnail */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-md bg-surface-muted border border-border overflow-hidden shrink-0">
        <img
          src={imageUrl}
          alt={food.name}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/placeholders/food.svg";
          }}
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-wider text-center p-1">
            Sold Out
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-display font-bold text-sm sm:text-base text-fg truncate">
              {food.name}
            </h4>
          </div>

          {food.description && (
            <p className="text-xs text-fg-2 line-clamp-2 mt-1 leading-relaxed">
              {food.description}
            </p>
          )}
        </div>

        {/* Price & Stepper / Add Action */}
        <div className="flex items-center justify-between gap-2 pt-3 mt-2 border-t border-border/60">
          <span className="font-bold text-primary text-base font-mono">
            {formatCurrency(food.price)}
          </span>

          {isAvailable ? (
            quantity > 0 ? (
              <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/30 rounded-md p-0.5">
                <button
                  onClick={() => updateQuantity(food._id, quantity - 1)}
                  className="p-1 text-primary hover:bg-primary/20 rounded transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-primary px-2 min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(food._id, quantity + 1)}
                  className="p-1 text-primary hover:bg-primary/20 rounded transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Button
                size="sm"
                variant={justAdded ? "secondary" : "primary"}
                onClick={handleAdd}
                className={cn(
                  "transition-all duration-300 min-w-[80px]",
                  justAdded && "bg-secondary text-white scale-105"
                )}
                iconLeft={justAdded ? Check : Plus}
              >
                {justAdded ? "Added" : "Add"}
              </Button>
            )
          ) : (
            <span className="text-xs font-semibold text-danger bg-danger/10 px-2.5 py-1 rounded-md">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
