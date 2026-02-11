"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { type MenuItem } from "./mock-data";

interface CartItem {
  item: MenuItem;
  quantity: number;
  kitchenId: string;
  kitchenName: string;
}

interface CartContextType {
  items: CartItem[];
  wishlist: string[];
  addToCart: (item: MenuItem, kitchenId: string, kitchenName: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (kitchenId: string) => void;
  isInWishlist: (kitchenId: string) => boolean;
  cartCount: number;
  cartTotal: number;
  currentKitchen: string | null;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentKitchen, setCurrentKitchen] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const initialized = useRef(false);

  // Load from localStorage on mount (only once)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const savedCart = localStorage.getItem("cart");
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        localStorage.removeItem("cart");
      }
    }
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        localStorage.removeItem("wishlist");
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (item: MenuItem, kitchenId: string, kitchenName: string) => {
    // Check if adding from different kitchen
    if (currentKitchen && currentKitchen !== kitchenId && items.length > 0) {
      if (!confirm("Your cart has items from another kitchen. Clear cart and add this item?")) {
        return;
      }
      setItems([]);
    }

    setCurrentKitchen(kitchenId);
    setItems((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { item, quantity: 1, kitchenId, kitchenName }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => {
      const newItems = prev.filter((c) => c.item.id !== itemId);
      if (newItems.length === 0) setCurrentKitchen(null);
      return newItems;
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((c) => (c.item.id === itemId ? { ...c, quantity } : c))
    );
  };

  const clearCart = () => {
    setItems([]);
    setCurrentKitchen(null);
  };

  const toggleWishlist = (kitchenId: string) => {
    setWishlist((prev) =>
      prev.includes(kitchenId)
        ? prev.filter((id) => id !== kitchenId)
        : [...prev, kitchenId]
    );
  };

  const isInWishlist = (kitchenId: string) => wishlist.includes(kitchenId);

  const cartCount = items.reduce((sum, c) => sum + c.quantity, 0);
  const cartTotal = items.reduce((sum, c) => sum + c.item.price * c.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartCount,
        cartTotal,
        currentKitchen,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
