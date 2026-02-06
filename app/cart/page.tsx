"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/main-layout";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { user } = useAuth();

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

  const kitchenName = items[0]?.kitchenName || "Kitchen";
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

        {/* Items */}
        <div className="space-y-2 mb-4">
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

        <Button variant="ghost" size="sm" className="text-destructive mb-4" onClick={clearCart}>
          Clear Cart
        </Button>

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

            <Button className="w-full mt-4" onClick={handleCheckout}>
              {user ? `Checkout - $${total.toFixed(2)}` : "Login to Checkout"}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-2">
              Pickup from {kitchenName}
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
