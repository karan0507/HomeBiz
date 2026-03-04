"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { fetchAPI, APIError } from "./services/api.client";
import { showError } from "./notifications";
import { useAuth } from "./auth-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  available?: boolean;
  dietaryInfo?: string[];
  rating?: number;
}

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
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentKitchen, setCurrentKitchen] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState<{ item: MenuItem; kitchenId: string; kitchenName: string } | null>(null);
  const initialized = useRef(false);

  // Load from localStorage on mount (only once)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Load Cart
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        const isUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        const isMock = parsed.some((item: any) => 
          item.kitchenId?.startsWith('kitchen-') || 
          item.item?.id?.startsWith('item-') ||
          !isUUID(item.kitchenId)
        );

        if (isMock) {
          localStorage.removeItem("cart");
          setItems([]);
        } else {
          setItems(parsed);
          if (parsed.length > 0) setCurrentKitchen(parsed[0].kitchenId);
        }
      } catch (e) {
        localStorage.removeItem("cart");
      }
    }

    // Load Offline Wishlist
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        localStorage.removeItem("wishlist");
      }
    }

    setIsHydrated(true);
  }, []);

  // Fetch wishlist from server on login — CUSTOMER ONLY (not business/admin)
  const wishlistUserId = useRef<string | null>(null);
  useEffect(() => {
    const uid = user?.id ?? null;
    if (uid === wishlistUserId.current) return; // same user, skip
    wishlistUserId.current = uid;
    if (!uid || user?.role !== 'customer') {
      // Don't clear wishlist here, allow offline wishlist
      return;
    }
    fetchAPI<any[]>('/wishlist')
      .then(async data => {
        // Map securely from nested kitchen object
        const serverWishlistIds = data.map(item => item.kitchen?.id).filter(Boolean);
        
        // Merge offline with server (optimistic)
        const localWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        const missingOnServer = localWishlist.filter((id: string) => !serverWishlistIds.includes(id));
        
        // Sync missing offline wishlists to server
        for (const id of missingOnServer) {
          try {
            await fetchAPI(`/wishlist/${id}`, { method: "POST" });
            serverWishlistIds.push(id);
          } catch(err) {
            console.warn(`[Wishlist] Failed to sync offline wishlist ${id} to server.`);
          }
        }

        setWishlist(Array.from(new Set([...serverWishlistIds])));
      })
      .catch(err => console.error('[Wishlist] Failed to fetch:', err));
  }, [user?.id, user?.role]); // ← Re-run when user ID or role changes


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
      setPendingItem({ item, kitchenId, kitchenName });
      setIsConfirmOpen(true);
      return;
    }

    executeAddToCart(item, kitchenId, kitchenName);
  };

  const executeAddToCart = (item: MenuItem, kitchenId: string, kitchenName: string) => {
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

  const confirmClearAndAdd = () => {
    if (pendingItem) {
      setItems([]);
      executeAddToCart(pendingItem.item, pendingItem.kitchenId, pendingItem.kitchenName);
      setPendingItem(null);
    }
    setIsConfirmOpen(false);
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

  const toggleWishlist = async (kitchenId: string) => {
    const isWishlisted = wishlist.includes(kitchenId);
    
    if (isWishlisted) {
      // Optimitistically update UI
      setWishlist(prev => prev.filter(w => w !== kitchenId));
      if (user && user.role === 'customer') {
        try {
          await fetchAPI(`/wishlist/${kitchenId}`, { method: "DELETE" });
        } catch (err) {
          showError(err);
          // Revert optimistic update on error
          setWishlist(prev => [...prev, kitchenId]);
        }
      }
    } else {
      // Optimitistically update UI
      setWishlist(prev => [...prev, kitchenId]);
      if (user && user.role === 'customer') {
        try {
          await fetchAPI(`/wishlist/${kitchenId}`, { method: "POST" });
        } catch (err) {
          // Ignore 400s if it implies "Already in wishlist" to prevent double error
          if (!(err instanceof APIError && err.status === 201)) {
             showError(err);
             // Revert optimistic update on error
             setWishlist(prev => prev.filter(w => w !== kitchenId));
          }
        }
      }
    }
  };

  const isInWishlist = (kitchenId: string) => wishlist.includes(kitchenId);

  const cartCount = items.reduce((sum, c) => sum + c.quantity, 0);
  const cartTotal = items.reduce((sum, c) => sum + (c.item.price * c.quantity), 0);

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
      
      {/* Selection Confirmation Modal */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-[340px] rounded-2xl">
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <DialogTitle className="text-left">Change Kitchen?</DialogTitle>
            <DialogDescription className="text-left">
              Your cart has items from another kitchen. Clear cart and add this item?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-3 sm:justify-start pt-4">
            <Button 
              variant="outline" 
              className="flex-1 rounded-xl"
              onClick={() => {
                setIsConfirmOpen(false);
                setPendingItem(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 rounded-xl bg-primary hover:bg-primary/90"
              onClick={confirmClearAndAdd}
            >
              Clear & Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
