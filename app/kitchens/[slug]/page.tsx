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
import { useKitchen } from "@/hooks/useKitchens";
import { fetchAPI, APIError } from "@/lib/services/api.client";
import { showError } from "@/lib/notifications";

export default function KitchenDetailPage() {
  const params = useParams();
  const kitchenId = params.slug as string;

  const { kitchen, loading, error } = useKitchen(kitchenId);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!kitchen?.id) return;
    fetchAPI<any[]>(`/kitchens/${kitchen.id}/menu-items`)
      .then(data =>
        setMenuItems((Array.isArray(data) ? data : []).map(i => ({
          ...i,
          available: i.is_available,
          dietaryInfo: i.dietary_info ?? [],
        })))
      )
      .catch(err => {
        showError(err);
        setMenuItems([]);
      });
    fetchAPI<any[]>(`/kitchens/${kitchen.id}/reviews`)
      .then(data =>
        setReviews((Array.isArray(data) ? data : []).map(r => {
          const profile = r.customer || r.profile || {};
          return {
            id: r.id,
            userName: profile.name || profile.full_name || `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "Anonymous",
            rating: Number(r.rating ?? 0),
            comment: r.comment || r.body || "",
          };
        }))
      )
      .catch(err => {
        showError(err);
        setReviews([]);
      });
  }, [kitchen?.id]);

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

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-32" />
            <div className="h-64 bg-muted rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!kitchen || error) {
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
            <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm mb-6">
              <div className="relative aspect-[21/9] sm:aspect-[16/5] bg-muted overflow-hidden">
                {kitchen.cover_image_url ? (
                  <img 
                    src={kitchen.cover_image_url} 
                    alt={kitchen.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                     <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-700 shadow-lg mx-auto flex items-center justify-center mb-3">
                       <span className="text-5xl">
                         {kitchen.cuisineTypes?.[0] ? '🍽️' : '🧑‍🍳'} 
                       </span>
                     </div>
                  </div>
                )}
                
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {kitchen.verification_status === 'approved' && (
                    <Badge className="bg-blue-600 text-white border-0 text-xs gap-1 shadow-sm">
                      <BadgeCheck className="w-3 h-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <Badge
                    className={
                      kitchen.is_active
                        ? "bg-green-600 text-white shadow-sm hover:bg-green-700"
                        : "bg-slate-500 text-white shadow-sm hover:bg-slate-600"
                    }
                  >
                    {kitchen.is_active ? "Open" : "Closed"}
                  </Badge>
                </div>
              </div>
              
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="font-bold text-2xl md:text-3xl tracking-tight">{kitchen.name}</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl leading-relaxed">{kitchen.description || kitchen.short_description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-3 py-1.5 rounded-full shadow-sm">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-semibold">{kitchen.rating || 'New'}</span>
                      <span className="text-muted-foreground text-xs ml-0.5 font-normal">({kitchen.review_count || kitchen.reviewCount || 0})</span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-full relative overflow-hidden"
                      onClick={() => toggleWishlist(kitchen.id)}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isInWishlist(kitchen.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"
                        }`}
                      />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{kitchen.neighborhood || "Delivery / Pickup"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">
                      {kitchen.prep_time_min && kitchen.prep_time_max
                        ? `${kitchen.prep_time_min}-${kitchen.prep_time_max} min`
                        : kitchen.preparation_time || '30-45 m'
                      }
                    </span>
                  </div>
                  {kitchen.phone && (
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium">{kitchen.phone}</span>
                    </div>
                  )}
                  {(kitchen.minimum_order > 0 || (kitchen.minimumOrder && kitchen.minimumOrder > 0)) && (
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Utensils className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium">Min Order: ${kitchen.minimum_order || kitchen.minimumOrder}</span>
                    </div>
                  )}
                </div>

                {((kitchen.cuisineTypes && kitchen.cuisineTypes.length > 0) || (kitchen.dietaryOptions && kitchen.dietaryOptions.length > 0)) && (
                  <div className="flex gap-2 mt-6 flex-wrap">
                    {kitchen.cuisineTypes?.map((cuisine: string) => (
                      <Badge key={cuisine} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-0 px-3 py-1 text-xs">
                        {cuisine}
                      </Badge>
                    ))}
                    {kitchen.dietaryOptions?.map((opt: string) => (
                      <Badge key={opt} variant="outline" className="text-muted-foreground border-border px-3 py-1 text-xs bg-card">
                        {opt}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Menu Section */}
            <div>
              <h2 className="font-semibold text-base mb-3 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-primary" />
                Menu ({menuItems.length} items)
              </h2>
              <div className="grid sm:grid-cols-2 xl:grid-cols-2 gap-4">
                {menuItems.map((item) => {
                  const quantity = getItemQuantity(item.id);
                  const isVeg = item.dietaryInfo?.includes("Vegetarian") || item.dietaryInfo?.includes("Vegan");
                  return (
                    <div key={item.id} className="group flex gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-all">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-muted shrink-0 relative border border-border/50">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                            {isVeg ? "🥬" : "🍖"}
                          </div>
                        )}
                        {item.rating > 0 && (
                           <div className="absolute bottom-1.5 left-1.5 bg-background/95 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 shadow-sm border border-border/50">
                             <Star className="w-3 h-3 fill-yellow-400 text-yellow-500" />
                             {item.rating}
                           </div>
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col min-w-0 py-1">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0 pr-2">
                            <h3 className="font-semibold text-base line-clamp-1 tracking-tight">{item.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1 leading-snug">
                              {item.description}
                            </p>
                          </div>
                          <span className="font-bold whitespace-nowrap text-lg">${item.price.toFixed(2)}</span>
                        </div>
                        
                        <div className="mt-auto pt-3 flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                             {item.dietaryInfo?.map((info: string) => (
                               <Badge key={info} variant="secondary" className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-secondary/50">
                                 {info}
                               </Badge>
                             ))}
                          </div>
                          
                          <div className="shrink-0 flex items-center justify-end">
                            {quantity > 0 ? (
                              <div className="flex items-center gap-2 bg-muted/60 rounded-lg p-1 border">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 rounded border bg-background text-foreground hover:bg-background/80"
                                  onClick={() => updateQuantity(item.id, quantity - 1)}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 rounded border bg-primary text-primary-foreground hover:bg-primary/90"
                                  onClick={() => addToCart(item, kitchen.id, kitchen.name)}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-9 px-4 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
                                onClick={() => addToCart(item, kitchen.id, kitchen.name)}
                                disabled={!item.available}
                              >
                                <Plus className="w-4 h-4 mr-1.5" />
                                Add
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
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
                  <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">Your Order</p>
                      <p className="text-xs text-muted-foreground">{cartCount} items</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    {items.slice(0, 3).map((cartItem) => (
                      <div key={cartItem.item.id} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{cartItem.quantity}x {cartItem.item.name}</span>
                        <span className="font-medium">${(cartItem.item.price * cartItem.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {items.length > 3 && (
                      <p className="text-[10px] text-muted-foreground">+{items.length - 3} more items</p>
                    )}
                  </div>
                  <div className="border-t pt-2 mb-3">
                    <div className="flex justify-between font-semibold text-sm">
                      <span>Subtotal</span>
                      <span className="text-primary">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <Link href="/cart">
                    <Button size="sm" className="w-full gap-2 h-8 text-xs">
                      <ShoppingCart className="w-3 h-3" />
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
                <h2 className="font-semibold text-base mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Reviews ({reviews.length})
                </h2>
                <div className="space-y-2">
                  {reviews.slice(0, visibleReviews).map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center shrink-0">
                            <span className="text-xs font-semibold text-primary">
                              {review.userName.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-xs">{review.userName}</span>
                              <span className="flex items-center gap-0.5 text-[10px] bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded-full">
                                <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                {review.rating}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {visibleReviews < reviews.length && (
                    <div ref={observerTarget} className="flex justify-center py-3">
                      {isLoadingMore && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
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
            <Button size="sm" className="w-full gap-2 ">
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
