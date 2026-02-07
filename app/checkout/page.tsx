"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, MapPin, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MainLayout } from "@/components/layout/main-layout";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [pickupTime, setPickupTime] = useState("asap");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Handle redirects in useEffect to avoid setState during render
  useEffect(() => {
    if (items.length === 0) {
      setIsRedirecting(true);
      router.push("/cart");
    } else if (!user) {
      setIsRedirecting(true);
      router.push("/login?redirect=/checkout");
    }
  }, [items.length, user, router]);

  // Show loading while redirecting
  if (isRedirecting || items.length === 0 || !user) {
    return (
      <MainLayout hideFooter>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  const kitchenName = items[0]?.kitchenName || "Kitchen";
  const tax = cartTotal * 0.13;
  const total = cartTotal + tax;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const orderId = `HB${Date.now().toString().slice(-8)}`;
    clearCart();
    router.push(`/order-confirmation?id=${orderId}`);
  };

  return (
    <MainLayout hideFooter>
      <div className="container mx-auto px-4 py-4 max-w-lg">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-bold text-lg">Checkout</h1>
        </div>

        <div className="space-y-4">
          {/* Pickup Location */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Pickup from</span>
              </div>
              <p className="text-sm">{kitchenName}</p>
              <p className="text-xs text-muted-foreground">Toronto, ON</p>
            </CardContent>
          </Card>

          {/* Pickup Time */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Pickup Time</span>
              </div>
              <RadioGroup value={pickupTime} onValueChange={setPickupTime}>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "asap", label: "ASAP", sub: "30-45 min" },
                    { value: "1hr", label: "1 Hour", sub: "" },
                    { value: "2hr", label: "2 Hours", sub: "" },
                    { value: "later", label: "Later", sub: "" },
                  ].map((time) => (
                    <Label
                      key={time.value}
                      htmlFor={time.value}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer text-sm ${
                        pickupTime === time.value ? "border-primary bg-primary/5" : ""
                      }`}
                    >
                      <RadioGroupItem value={time.value} id={time.value} />
                      <span>{time.label}</span>
                      {time.sub && (
                        <span className="text-xs text-muted-foreground ml-auto">{time.sub}</span>
                      )}
                    </Label>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Payment</span>
              </div>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-2">
                  <Label
                    htmlFor="cash"
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer text-sm ${
                      paymentMethod === "cash" ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <RadioGroupItem value="cash" id="cash" />
                    <span>Pay at Pickup</span>
                  </Label>
                  <Label
                    htmlFor="card"
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer text-sm ${
                      paymentMethod === "card" ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <RadioGroupItem value="card" id="card" />
                    <span>Credit/Debit Card</span>
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="mt-3 space-y-3">
                  <div>
                    <Label className="text-xs">Card Number</Label>
                    <Input placeholder="1234 5678 9012 3456" className="h-9 mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Expiry</Label>
                      <Input placeholder="MM/YY" className="h-9 mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">CVC</Label>
                      <Input placeholder="123" className="h-9 mt-1" />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardContent className="p-4">
              <h2 className="font-medium text-sm mb-3">Order Summary</h2>
              <div className="space-y-1 text-sm">
                {items.map((item) => (
                  <div key={item.item.id} className="flex justify-between text-muted-foreground">
                    <span>{item.quantity}x {item.item.name}</span>
                    <span>${(item.item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-3 pt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (13%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Place Order */}
          <Button
            className="w-full h-12"
            onClick={handlePlaceOrder}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : `Place Order - $${total.toFixed(2)}`}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By placing this order, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
