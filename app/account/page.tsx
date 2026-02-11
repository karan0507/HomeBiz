"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { mockBusinesses } from "@/lib/mock-data";
import {
  User,
  Settings,
  ShoppingBag,
  Heart,
  LogOut,
  ChefHat,
  MapPin,
  Star,
  Clock,
  Package,
  Mail,
  Phone,
  Edit,
  X,
  Check,
} from "lucide-react";

function AccountContent() {
  const { user, logout, isAuthenticated, isAdmin, isBusiness } = useAuth();
  const { wishlist, toggleWishlist } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile");
  const [editingProfile, setEditingProfile] = useState(false);
  const [reviewingOrder, setReviewingOrder] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    if (isAdmin) {
      router.push("/admin/dashboard");
    } else if (isBusiness) {
      router.push("/business/dashboard");
    }
  }, [isAdmin, isBusiness, router]);

  const wishlistedKitchens = mockBusinesses.filter((k) => wishlist.includes(k.id));

  const mockOrders = [
    {
      id: "HB12345678",
      date: "2024-01-15",
      status: "delivered",
      total: 45.99,
      kitchen: "Amma's Kitchen",
      kitchenSlug: "ammas-kitchen",
      items: [
        { name: "Butter Chicken", qty: 1, price: 14.99 },
        { name: "Garlic Naan", qty: 3, price: 4.99 },
        { name: "Mango Lassi", qty: 2, price: 3.99 },
      ],
      hasReview: false,
    },
    {
      id: "HB12345679",
      date: "2024-01-10",
      status: "delivered",
      total: 32.50,
      kitchen: "Nonna's Table",
      kitchenSlug: "nonnas-table",
      items: [
        { name: "Pasta Carbonara", qty: 2, price: 12.99 },
        { name: "Tiramisu", qty: 1, price: 6.50 },
      ],
      hasReview: true,
    },
  ];

  const handleReviewSubmit = (orderId: string) => {
    console.log("Review submitted:", { orderId, rating: reviewRating, text: reviewText });
    setReviewingOrder(null);
    setReviewText("");
    setReviewRating(5);
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="flex-1 flex items-center justify-center py-12">
          <Card className="w-full max-w-sm mx-4">
            <CardHeader className="text-center pb-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center mb-3">
                <User className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-lg">Sign In Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-center text-sm text-muted-foreground">
                Sign in to view your orders and wishlist
              </p>
              <Link href="/login" className="block">
                <Button size="sm" className="w-full gap-2 bg-gradient-to-r from-primary to-emerald-600">
                  <User className="w-4 h-4" />
                  Customer Login
                </Button>
              </Link>
              <Link href="/signup" className="block">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  Create Account
                </Button>
              </Link>
              <div className="pt-3 border-t">
                <p className="text-center text-xs text-muted-foreground mb-2">
                  Are you a home chef?
                </p>
                <Link href="/business/login" className="block">
                  <Button variant="ghost" size="sm" className="w-full gap-2 text-xs">
                    <ChefHat className="w-3 h-3" />
                    Chef Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shrink-0">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                  <Badge variant="secondary" className="gap-1">
                    <ShoppingBag className="w-3 h-3" />
                    {mockOrders.length} Orders
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Heart className="w-3 h-3" />
                    {wishlistedKitchens.length} Favorites
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2 shrink-0" onClick={logout}>
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "orders", label: "Orders", icon: ShoppingBag },
            { id: "wishlist", label: "Wishlist", icon: Heart },
            { id: "support", label: "Support", icon: Mail },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              className={`gap-2 flex-shrink-0 ${activeTab === tab.id ? "bg-gradient-to-r from-primary to-emerald-600" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Account Information
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={() => setEditingProfile(!editingProfile)}
                  >
                    {editingProfile ? (
                      <>
                        <X className="w-4 h-4" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingProfile ? (
                  <>
                    <div>
                      <Label htmlFor="name" className="text-sm">Full Name</Label>
                      <Input id="name" defaultValue={user?.name} className="mt-1.5 h-9 text-sm" />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm">Email Address</Label>
                      <Input id="email" type="email" defaultValue={user?.email} className="mt-1.5 h-9 text-sm" />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                      <Input id="phone" type="tel" defaultValue={user?.phone} placeholder="(416) 555-1234" className="mt-1.5 h-9 text-sm" />
                    </div>
                    <div>
                      <Label htmlFor="address" className="text-sm">Address</Label>
                      <Input id="address" defaultValue={user?.address} placeholder="123 Main St, Toronto" className="mt-1.5 h-9 text-sm" />
                    </div>
                    <Button size="sm" className="w-full gap-2 bg-gradient-to-r from-primary to-emerald-600">
                      <Check className="w-4 h-4" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 py-3 border-b">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Full Name</p>
                        <p className="text-sm font-medium">{user?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-3 border-b">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Email Address</p>
                        <p className="text-sm font-medium">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-3 border-b">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Phone Number</p>
                        <p className="text-sm font-medium">{user?.phone || "Not set"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-3">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Address</p>
                        <p className="text-sm font-medium">{user?.address || "Not set"}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Membership</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Member Since</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(user?.createdAt || "").toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                  </div>
                  <Badge className="bg-gradient-to-r from-primary to-emerald-600 text-white">
                    Active Member
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            {mockOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-semibold mb-2">No orders yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start exploring delicious home-cooked meals
                  </p>
                  <Link href="/kitchens">
                    <Button size="sm" className="gap-2">
                      <ChefHat className="w-4 h-4" />
                      Browse Kitchens
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              mockOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{order.kitchen}</h3>
                          <Badge
                            className={
                              order.status === "delivered"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200 text-xs"
                                : "bg-yellow-100 text-yellow-700 border-yellow-200 text-xs"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Order #{order.id} • {new Date(order.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
                    </div>

                    <div className="space-y-2 mb-4 pb-4 border-b">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.qty}x {item.name}
                          </span>
                          <span className="font-medium">${(item.qty * item.price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {order.status === "delivered" && (
                      <div className="space-y-3">
                        {!order.hasReview && reviewingOrder !== order.id ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2"
                            onClick={() => setReviewingOrder(order.id)}
                          >
                            <Star className="w-4 h-4" />
                            Write a Review
                          </Button>
                        ) : reviewingOrder === order.id ? (
                          <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                            <div>
                              <Label className="text-sm mb-2 block">Rating</Label>
                              <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() => setReviewRating(star)}
                                    className="transition-transform hover:scale-110"
                                  >
                                    <Star
                                      className={`w-6 h-6 ${
                                        star <= reviewRating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-muted-foreground"
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <Label htmlFor={`review-${order.id}`} className="text-sm">Your Review</Label>
                              <Input
                                id={`review-${order.id}`}
                                placeholder="Share your experience..."
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                className="mt-1.5 h-9 text-sm"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="flex-1 gap-2 bg-gradient-to-r from-primary to-emerald-600"
                                onClick={() => handleReviewSubmit(order.id)}
                              >
                                <Check className="w-4 h-4" />
                                Submit Review
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setReviewingOrder(null);
                                  setReviewText("");
                                  setReviewRating(5);
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-emerald-600" />
                            Review submitted
                          </div>
                        )}
                        <Link href={`/kitchens/${order.kitchenSlug}`}>
                          <Button variant="ghost" size="sm" className="w-full">
                            Order Again
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === "support" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                  <Mail className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email Support</h3>
                    <p className="text-sm text-muted-foreground mb-2">support@homebiz.ca</p>
                    <p className="text-xs text-muted-foreground">Response within 24-48 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                  <Phone className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone Support</h3>
                    <p className="text-sm text-muted-foreground mb-2">416-555-HOME (4663)</p>
                    <p className="text-xs text-muted-foreground">Mon-Fri, 9am-6pm EST</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3">Quick Help</h3>
                <div className="space-y-2">
                  <Link href="/faq">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      View FAQ
                    </Button>
                  </Link>
                  <Link href="/how-it-works">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      How It Works
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Send Message
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "wishlist" && (
          <div className="space-y-4">
            {wishlistedKitchens.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-semibold mb-2">No favorites yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Save your favorite kitchens for quick access
                  </p>
                  <Link href="/kitchens">
                    <Button size="sm" className="gap-2">
                      <ChefHat className="w-4 h-4" />
                      Discover Kitchens
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              wishlistedKitchens.map((kitchen) => (
                <Card key={kitchen.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-500/10 flex items-center justify-center shrink-0">
                        <ChefHat className="w-10 h-10 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold truncate">{kitchen.name}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">{kitchen.tagline}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => toggleWishlist(kitchen.id)}
                          >
                            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {kitchen.rating}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {kitchen.neighborhood}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {kitchen.preparationTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          {kitchen.cuisineTypes.slice(0, 3).map((cuisine) => (
                            <Badge key={cuisine} variant="secondary" className="text-xs">
                              {cuisine}
                            </Badge>
                          ))}
                          <Badge
                            className={
                              kitchen.acceptingOrders
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200 text-xs"
                                : "bg-red-100 text-red-700 border-red-200 text-xs"
                            }
                          >
                            {kitchen.acceptingOrders ? "Open Now" : "Closed"}
                          </Badge>
                        </div>
                        <Link href={`/kitchens/${kitchen.slug}`}>
                          <Button size="sm" className="w-full gap-2 bg-gradient-to-r from-primary to-emerald-600">
                            View Menu
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}
