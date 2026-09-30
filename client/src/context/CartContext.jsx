import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [conflictModal, setConflictModal] = useState({
    isOpen: false,
    pendingFood: null,
    pendingRestaurant: null,
  });

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setItems([]);
      setRestaurant(null);
      return;
    }
    try {
      const response = await api.get("/cart");
      if (response.data?.items) {
        setItems(response.data.items);
        if (response.data.items.length > 0 && response.data.items[0].food?.restaurant) {
          setRestaurant(response.data.items[0].food.restaurant);
        } else {
          setRestaurant(null);
        }
      }
    } catch {
      // Ignored if cart empty
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (food, restObj) => {
    if (!isAuthenticated) {
      toast.error("Please log in to add items to your cart");
      return false;
    }

    const currentRestId = restaurant?._id || (items.length > 0 && (items[0].food?.restaurant?._id || items[0].food?.restaurant));
    const targetRestId = restObj?._id || food.restaurant?._id || food.restaurant;

    // Check single-restaurant constraint
    if (items.length > 0 && currentRestId && targetRestId && currentRestId.toString() !== targetRestId.toString()) {
      setConflictModal({
        isOpen: true,
        pendingFood: food,
        pendingRestaurant: restObj || { _id: targetRestId },
      });
      return false;
    }

    try {
      const response = await api.post("/cart", {
        foodId: food._id,
        quantity: 1,
      });
      if (response.data?.items) {
        setItems(response.data.items);
        setRestaurant(restObj || food.restaurant);
      }
      toast.success(`Added ${food.name} to cart`);
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const updateQuantity = async (foodId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(foodId);
    }
    try {
      const response = await api.patch("/cart", {
        foodId,
        quantity,
      });
      if (response.data?.items) {
        setItems(response.data.items);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeFromCart = async (foodId) => {
    try {
      const response = await api.delete(`/cart/${foodId}`);
      if (response.data?.items) {
        setItems(response.data.items);
        if (response.data.items.length === 0) {
          setRestaurant(null);
        }
      }
      toast.info("Item removed from cart");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart");
      setItems([]);
      setRestaurant(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resolveConflict = async (replace = false) => {
    if (replace && conflictModal.pendingFood) {
      try {
        await api.delete("/cart");
        const response = await api.post("/cart", {
          foodId: conflictModal.pendingFood._id,
          quantity: 1,
        });
        if (response.data?.items) {
          setItems(response.data.items);
          setRestaurant(conflictModal.pendingRestaurant || conflictModal.pendingFood.restaurant);
        }
        toast.success(`Cart updated with ${conflictModal.pendingFood.name}`);
      } catch (error) {
        toast.error(error.message);
      }
    }
    setConflictModal({ isOpen: false, pendingFood: null, pendingRestaurant: null });
  };

  // Calculations
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const subtotal = items.reduce((sum, item) => {
    const price = item.food?.price || 0;
    return sum + price * (item.quantity || 0);
  }, 0);
  const deliveryFee = items.length > 0 ? 40 : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  return (
    <CartContext.Provider
      value={{
        items,
        restaurant,
        itemCount,
        subtotal,
        deliveryFee,
        tax,
        total,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        conflictModal,
        resolveConflict,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
