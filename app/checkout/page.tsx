"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, MapPin, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MainLayout } from "@/components/layout/main-layout";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { fetchAPI } from "@/lib/services/api.client";
import { showError, showSuccess } from "@/lib/notifications";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [pickupTime, setPickupTime] = useState("asap");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
  const total = cartTotal; // No hardcoded tax per prompt rule

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    try {
      const pickup_time =
        pickupTime === "1hr" ? new Date(Date.now() + 3600000).toISOString()
        : pickupTime === "2hr" ? new Date(Date.now() + 7200000).toISOString()
        : undefined;
      const result = await fetchAPI<{ id: string; order_number: string }>("/orders", {
        method: "POST",
        body: JSON.stringify({
          kitchen_id: items[0].kitchenId,
          fulfillment_type: "pickup", // Required per spec
          payment_method: paymentMethod === "interac" ? "etransfer" : paymentMethod,
          items: items.map((i) => ({ menu_item_id: i.item.id, quantity: i.quantity })),
          ...(pickup_time ? { pickup_time } : {}),
        }),
      });
      clearCart();
      showSuccess("Order placed!", `Your order ${result.order_number} has been confirmed. The kitchen will prepare your meal.`);
      router.push(`/order-confirmation?id=${result.id}`);
    } catch (err) {
      showError(err);
      setShowConfirm(false);
    } finally {
      setIsProcessing(false);
    }
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
                    <span>Cash at Pickup</span>
                  </Label>
                  <Label
                    htmlFor="interac"
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer text-sm ${
                      paymentMethod === "interac" ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <RadioGroupItem value="interac" id="interac" />
                    <span>Interac e-Transfer</span>
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "interac" && (
                <p className="mt-3 text-xs text-muted-foreground bg-muted/50 p-2.5 rounded-lg">
                  You will receive Interac transfer details from the chef after your order is confirmed.
                </p>
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
              <div className="space-y-3 text-sm pt-3 border-t mt-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax & Fees</span>
                  <span className="text-xs text-amber-600 font-medium">Server Calculated</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t mt-2">
                  <span>Total (Estimated)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 italic text-center">
                  Final total including tax will be confirmed after kitchen approval.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Place Order / Confirmation */}
          {!showConfirm ? (
            <Button
              size="sm"
              className="w-full"
              onClick={() => setShowConfirm(true)}
              disabled={isProcessing}
            >
              Place Order - ${total.toFixed(2)}
            </Button>
          ) : (
            <Card className="border-primary/40">
              <CardContent className="p-4 space-y-3">
                <p className="text-sm font-medium text-center">Confirm your order?</p>
                <div className="text-sm text-muted-foreground text-center">
                  {kitchenName} · {paymentMethod === "interac" ? "Interac e-Transfer" : "Cash at Pickup"} · ${total.toFixed(2)}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setShowConfirm(false)}
                    disabled={isProcessing}
                  >
                    Go Back
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={handleConfirmOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Placing..." : "Confirm Order"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <p className="text-xs text-muted-foreground text-center">
            By placing this order, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
