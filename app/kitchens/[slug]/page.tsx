"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Star,
  MapPin,
  Clock,
  Phone,
  ChefHat,
  Heart,
  BadgeCheck,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  Utensils,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/main-layout";
import { useCart } from "@/lib/cart-context";
import { mockBusinesses, mockProducts, mockReviews } from "@/lib/mock-data";

export default function KitchenDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const kitchen = mockBusinesses.find((k) => k.slug === slug);
  const menuItems = mockProducts.filter((p) => p.kitchenId === kitchen?.id);
  const reviews = mockReviews.filter((r) => r.kitchenId === kitchen?.id);

  const [visibleReviews, setVisibleReviews] = useState(2);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef(null);

  const {
    items,
    addToCart,
    updateQuantity,
    cartTotal,
    cartCount,
    toggleWishlist,
    isInWishlist,
  } = useCart();

  if (!kitchen) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <ChefHat className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h1 className="text-xl font-bold mb-2">Kitchen Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The kitchen you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/kitchens">
            <Button>Browse All Kitchens</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const getItemQuantity = (itemId: string) => {
    const cartItem = items.find((c) => c.item.id === itemId);
    return cartItem?.quantity || 0;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleReviews < reviews.length && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleReviews((prev) => Math.min(prev + 2, reviews.length));
            setIsLoadingMore(false);
          }, 500);
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [visibleReviews, reviews.length, isLoadingMore]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        {/* Back Button */}
        <Link
          href="/kitchens"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Kitchens
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Kitchen Info & Menu */}
          <div className="lg:col-span-2 space-y-6">
            {/* Kitchen Header */}
            <Card className="overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-emerald-500/10 relative">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
              </div>
              <CardContent className="p-5 -mt-10 relative">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-primary to-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-primary/25 border-4 border-background">
                    <ChefHat className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 pt-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="font-bold text-xl">{kitchen.name}</h1>
                      {kitchen.isVerified && (
                        <BadgeCheck className="w-5 h-5 text-primary shrink-0" />
                      )}
                      <Badge
                        className={
                          kitchen.acceptingOrders
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }
                      >
                        {kitchen.acceptingOrders ? "Open Now" : "Closed"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">{kitchen.tagline}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 h-10 w-10"
                    onClick={() => toggleWishlist(kitchen.id)}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isInWishlist(kitchen.id) ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                  <span className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{kitchen.rating}</span>
                    <span className="text-yellow-600">({kitchen.reviewCount})</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {kitchen.neighborhood}
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {kitchen.preparationTime}
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    {kitchen.phone}
                  </span>
                </div>

                <div className="flex gap-2 mt-4 flex-wrap">
                  {kitchen.cuisineTypes.map((cuisine) => (
                    <Badge key={cuisine} variant="secondary" className="text-xs">
                      {cuisine}
                    </Badge>
                  ))}
                  {kitchen.dietaryOptions.slice(0, 3).map((opt) => (
                    <Badge key={opt} variant="outline" className="text-xs">
                      {opt}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t text-sm text-muted-foreground">
                  <Utensils className="w-4 h-4" />
                  <span>Minimum order: <strong className="text-foreground">${kitchen.minimumOrder}</strong></span>
                </div>
              </CardContent>
            </Card>

            {/* Menu Section */}
            <div>
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-primary" />
                Menu ({menuItems.length} items)
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {menuItems.map((item) => {
                  const quantity = getItemQuantity(item.id);
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
                              {quantity > 0 ? (
                                <div className="flex items-center gap-1.5">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(item.id, quantity - 1)}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-7 w-7"
                                    onClick={() => addToCart(item, kitchen.id, kitchen.name)}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  className="h-7 text-xs px-3 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90"
                                  onClick={() => addToCart(item, kitchen.id, kitchen.name)}
                                  disabled={!item.available}
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Add
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Reviews & Sticky Cart */}
          <div className="space-y-6">
            {/* Sticky Cart Summary (Desktop) */}
            {cartCount > 0 && (
              <div className="hidden lg:block sticky top-20 self-start">
                <Card className="bg-background border shadow-md">
                  <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Your Order</p>
                      <p className="text-sm text-muted-foreground">{cartCount} items</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    {items.slice(0, 3).map((cartItem) => (
                      <div key={cartItem.item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{cartItem.quantity}x {cartItem.item.name}</span>
                        <span className="font-medium">${(cartItem.item.price * cartItem.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {items.length > 3 && (
                      <p className="text-xs text-muted-foreground">+{items.length - 3} more items</p>
                    )}
                  </div>
                  <div className="border-t pt-3 mb-4">
                    <div className="flex justify-between font-semibold">
                      <span>Subtotal</span>
                      <span className="text-primary">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <Link href="/cart">
                    <Button size="sm" className="w-full gap-2 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90">
                      <ShoppingCart className="w-4 h-4" />
                      View Cart
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              </div>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <div>
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Reviews ({reviews.length})
                </h2>
                <div className="space-y-3">
                  {reviews.slice(0, visibleReviews).map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center shrink-0">
                            <span className="text-sm font-semibold text-primary">
                              {review.userName.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{review.userName}</span>
                              <span className="flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                {review.rating}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {visibleReviews < reviews.length && (
                    <div ref={observerTarget} className="flex justify-center py-4">
                      {isLoadingMore && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Floating Cart Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-16 left-0 right-0 z-40 lg:hidden px-3 py-2 bg-background/95 backdrop-blur-sm border-t shadow-lg">
          <Link href="/cart">
            <Button size="sm" className="w-full gap-2 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90">
              <ShoppingCart className="w-4 h-4" />
              <span>View Cart ({cartCount})</span>
              <span className="ml-auto font-semibold">${cartTotal.toFixed(2)}</span>
            </Button>
          </Link>
        </div>
      )}
    </MainLayout>
  );
}
