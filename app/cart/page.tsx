"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ChefHat, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MainLayout } from "@/components/layout/main-layout";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { fetchAPI } from "@/lib/services/api.client";

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, clearCart, cartTotal, addToCart } = useCart();
  const { user } = useAuth();
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [kitchenMenuItems, setKitchenMenuItems] = useState<any[]>([]);

  const kitchenId = items[0]?.kitchenId;
  const kitchenName = items[0]?.kitchenName || "Kitchen";

  useEffect(() => {
    if (!kitchenId) return;
    fetchAPI<any[]>(`/kitchens/${kitchenId}/menu-items`)
      .then(data =>
        setKitchenMenuItems((Array.isArray(data) ? data : []).map(i => ({
          ...i,
          available: i.is_available,
          dietaryInfo: i.dietary_info ?? [],
        })))
      )
      .catch(() => setKitchenMenuItems([]));
  }, [kitchenId]);

  const handleCheckout = () => {
    if (!user) {
      router.push("/login?redirect=/checkout");
    } else {
      router.push("/checkout");
    }
  };

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Browse kitchens and add items to your cart
          </p>
          <Link href="/kitchens">
            <Button>Browse Kitchens</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const itemsInCart = items.map((i) => i.item.id);
  const availableItems = kitchenMenuItems.filter((item) => !itemsInCart.includes(item.id));
  const kitchenSlug = kitchenId;

  const tax = cartTotal * 0.13;
  const total = cartTotal + tax;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="font-bold text-lg">Cart</h1>
            <p className="text-xs text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"} from {kitchenName}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Add More Items (Desktop) */}
          <div className="hidden lg:block lg:col-span-1">
            <div>
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-primary" />
                Add More from {kitchenName}
              </h2>
              {availableItems.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {availableItems.map((item) => {
                    const isVeg = item.dietaryInfo?.includes("Vegetarian");
                    return (
                      <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex gap-3">
                            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-3xl shrink-0">
                              {isVeg ? "🥬" : "🍖"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                                  <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    {item.rating}
                                  </span>
                                </div>
                                <Button
                                  size="sm"
                                  className="h-8 text-xs gap-1 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90"
                                  onClick={() => addToCart(item, kitchenId, kitchenName)}
                                  disabled={!item.available}
                                >
                                  <Plus className="w-3 h-3" />
                                  Add
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground text-center">All items added to cart</p>
                  </CardContent>
                </Card>
              )}
              <Link href={`/kitchens/${kitchenSlug}`}>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View Full Menu
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Cart Items & Summary */}
          <div className="lg:col-span-2 space-y-4">
            {/* Cart Items */}
            <div className="space-y-2">
              {items.map((cartItem) => {
                const isVeg = cartItem.item.dietaryInfo?.includes("Vegetarian");
                return (
                  <Card key={cartItem.item.id}>
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-xl shrink-0">
                          {isVeg ? "🥬" : "🍖"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-2">
                            <h3 className="font-medium text-sm truncate">{cartItem.item.name}</h3>
                            <span className="font-bold text-sm shrink-0">
                              ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            ${cartItem.item.price.toFixed(2)} each
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-5 text-center text-sm">{cartItem.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive"
                              onClick={() => removeFromCart(cartItem.item.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Button variant="ghost" size="sm" className="text-destructive" onClick={clearCart}>
              Clear Cart
            </Button>

            {/* Mobile - Add More Section */}
            <div className="lg:hidden">
              <h2 className="font-semibold mb-3 text-sm flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-primary" />
                Add More from {kitchenName}
              </h2>
              {availableItems.length > 0 ? (
                <div className="space-y-2">
                  {availableItems.slice(0, 3).map((item) => {
                    const isVeg = item.dietaryInfo?.includes("Vegetarian");
                    return (
                      <Card key={item.id} className="overflow-hidden">
                        <CardContent className="p-3">
                          <div className="flex gap-3">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-2xl shrink-0">
                              {isVeg ? "🥬" : "🍖"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                {item.description}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="font-bold text-sm text-primary">${item.price.toFixed(2)}</span>
                                <Button
                                  size="sm"
                                  className="h-7 text-xs px-3"
                                  onClick={() => addToCart(item, kitchenId, kitchenName)}
                                  disabled={!item.available}
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Add
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground text-center">All items added to cart</p>
                  </CardContent>
                </Card>
              )}
              <Link href={`/kitchens/${kitchenSlug}`}>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View Full Menu
                </Button>
              </Link>
            </div>

            {/* Delivery Instructions */}
            <Card>
              <CardContent className="p-4">
                <Label htmlFor="instructions" className="text-sm font-semibold">
                  Delivery Instructions (Optional)
                </Label>
                <Input
                  id="instructions"
                  placeholder="E.g., Ring the doorbell, leave at door, etc."
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  className="mt-2 h-9 text-sm"
                />
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardContent className="p-4">
                <h2 className="font-semibold mb-3">Order Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (13%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pickup</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button size="sm" className="w-full mt-4" onClick={handleCheckout}>
                  {user ? `Checkout - $${total.toFixed(2)}` : "Login to Checkout"}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-2">
                  Pickup from {kitchenName}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
