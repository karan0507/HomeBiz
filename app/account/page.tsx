"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

function AccountContent() {
  const { user, logout, isAuthenticated, isAdmin, isBusiness } = useAuth();
  const { wishlist, toggleWishlist } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile");

  useEffect(() => {
    if (isAdmin) {
      router.push("/admin/dashboard");
    } else if (isBusiness) {
      router.push("/business/dashboard");
    }
  }, [isAdmin, isBusiness, router]);

  const wishlistedKitchens = mockBusinesses.filter((k) => wishlist.includes(k.id));

  // Mock orders
  const mockOrders = [
    {
      id: "HB12345678",
      date: "2024-01-15",
      status: "delivered",
      total: 45.99,
      kitchen: "Amma's Kitchen",
      items: 3,
    },
    {
      id: "HB12345679",
      date: "2024-01-10",
      status: "delivered",
      total: 32.50,
      kitchen: "Nonna's Table",
      items: 2,
    },
  ];

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="flex-1 flex items-center justify-center py-12">
          <Card className="w-full max-w-sm mx-4">
            <CardHeader className="text-center pb-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-muted flex items-center justify-center mb-3">
                <User className="w-7 h-7 text-muted-foreground" />
              </div>
              <CardTitle className="text-lg">Sign In Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-center text-sm text-muted-foreground">
                Sign in to view your orders and wishlist
              </p>
              <Link href="/login" className="block">
                <Button className="w-full gap-2 bg-gradient-to-r from-primary to-accent text-white">
                  <User className="w-4 h-4" />
                  Customer Login
                </Button>
              </Link>
              <Link href="/signup" className="block">
                <Button variant="outline" className="w-full gap-2">
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
      <div className="container mx-auto px-4 py-4">
          {/* Profile Header */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="font-semibold truncate">{user?.name}</h1>
                  <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {[
              { id: "profile", label: "Profile", icon: User },
              { id: "orders", label: "Orders", icon: ShoppingBag },
              { id: "wishlist", label: "Wishlist", icon: Heart },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                size="sm"
                className="gap-1.5 flex-shrink-0"
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "profile" && (
            <div className="space-y-3">
              <Card>
                <CardContent className="p-4">
                  <h2 className="font-medium mb-3 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Account Settings
                  </h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Email</span>
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Phone</span>
                      <span>{user?.phone || "Not set"}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Member Since</span>
                      <span>{new Date(user?.createdAt || "").toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                variant="destructive"
                className="w-full gap-2"
                onClick={logout}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-3">
              {mockOrders.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">No orders yet</p>
                    <Link href="/kitchens">
                      <Button className="mt-4" size="sm">
                        Browse Kitchens
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                mockOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm">{order.kitchen}</p>
                          <p className="text-xs text-muted-foreground">{order.items} items</p>
                        </div>
                        <Badge
                          className={
                            order.status === "delivered"
                              ? "bg-green-100 text-green-700 text-xs"
                              : "bg-yellow-100 text-yellow-700 text-xs"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {order.date}
                        </span>
                        <span className="font-medium text-foreground">${order.total.toFixed(2)}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-2">Order #{order.id}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="space-y-3">
              {wishlistedKitchens.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Heart className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">No favorites yet</p>
                    <Link href="/kitchens">
                      <Button className="mt-4" size="sm">
                        Discover Kitchens
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                wishlistedKitchens.map((kitchen) => (
                  <Card key={kitchen.id}>
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <ChefHat className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="min-w-0">
                              <h3 className="font-medium text-sm truncate">{kitchen.name}</h3>
                              <p className="text-xs text-muted-foreground">{kitchen.cuisineTypes.join(", ")}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 flex-shrink-0"
                              onClick={() => toggleWishlist(kitchen.id)}
                            >
                              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="flex items-center gap-0.5 text-xs">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              {kitchen.rating}
                            </span>
                            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {kitchen.neighborhood}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link href={`/kitchens/${kitchen.slug}`}>
                        <Button variant="outline" size="sm" className="w-full mt-3 h-8 text-xs">
                          View Menu
                        </Button>
                      </Link>
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
