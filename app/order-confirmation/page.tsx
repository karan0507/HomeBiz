"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, MapPin, Clock, Phone, ArrowRight, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id") || "HB12345678";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl font-bold mb-2">Order Placed!</h1>
            <p className="text-muted-foreground mb-6">
              Your order has been confirmed and will be ready for pickup soon.
            </p>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-muted/50 rounded-xl p-4 mb-6"
          >
            <div className="text-sm text-muted-foreground mb-1">Order ID</div>
            <div className="text-lg font-mono font-semibold">{orderId}</div>
          </motion.div>

          {/* Pickup Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3 mb-6 text-left"
          >
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <Clock className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Estimated Pickup</p>
                <p className="text-sm text-muted-foreground">Ready in 30-45 minutes</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Pickup Location</p>
                <p className="text-sm text-muted-foreground">You'll receive the address via text</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <Phone className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Contact</p>
                <p className="text-sm text-muted-foreground">The chef will contact you when ready</p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-2"
          >
            <Link href="/account?tab=orders">
              <Button className="w-full bg-gradient-to-r from-primary to-accent text-white gap-2">
                <ShoppingBag className="w-4 h-4" />
                View My Orders
              </Button>
            </Link>
            <Link href="/kitchens">
              <Button variant="outline" className="w-full gap-2">
                <ArrowRight className="w-4 h-4" />
                Continue Browsing
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </motion.div>

          <p className="text-xs text-muted-foreground mt-6">
            A confirmation email has been sent to your registered email address.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
