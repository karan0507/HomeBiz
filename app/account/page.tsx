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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth-context";
import { fetchAPI, APIError } from "@/lib/services/api.client";
import { showError, showSuccess } from "@/lib/notifications";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile");
  const [editingProfile, setEditingProfile] = useState(false);
  const [reviewingOrder, setReviewingOrder] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [confirmLogout, setConfirmLogout] = useState(false);

  // Real data state
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [profileForm, setProfileForm] = useState<any>({});
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) router.push("/admin/dashboard");
    else if (isBusiness) router.push("/business/dashboard");
  }, [isAdmin, isBusiness, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    // Fetch profile
    setProfileLoading(true);
    setProfileError(null);
    fetchAPI<any>("/profile")
      .then(data => {
        const p = data?.profile ?? data;
        setProfile(p);
        setProfileForm({
          first_name: p?.first_name || "",
          last_name: p?.last_name || "",
          email: p?.email || user?.email || "",
          phone: p?.phone || "",
          address_line1: p?.address_line1 || "",
          city: p?.city || "",
          province: p?.province || "",
          postal_code: p?.postal_code || "",
        });
      })
      .catch(err => {
        console.error("[Profile] Fetch error:", err);
        setProfileError("Could not load profile details. Using basic session info.");
      })
      .finally(() => setProfileLoading(false));
  }, [isAuthenticated, user?.email]);

  useEffect(() => {
    if (!isAuthenticated || activeTab !== "orders") return;
    setOrdersLoading(true);
    fetchAPI<any[]>("/orders")
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    if (!isAuthenticated || activeTab !== "wishlist") return;
    setWishlistLoading(true);
    fetchAPI<any[]>("/wishlist")
      .then(data => setWishlist(Array.isArray(data) ? data : []))
      .catch(() => setWishlist([]))
      .finally(() => setWishlistLoading(false));
  }, [isAuthenticated, activeTab]);

  const handleProfileSave = async () => {
    if (!profileForm.phone?.trim()) {
      showError(new APIError("Phone number is required", 400, "VALIDATION_ERROR"));
      return;
    }
    try {
      await fetchAPI("/profile", { method: "PUT", body: JSON.stringify(profileForm) });
      showSuccess("Profile updated", "Your changes were saved.");
      setEditingProfile(false);
    } catch (err) {
      showError(err);
    }
  };

  const handleReviewSubmit = async (orderId: string, kitchenId: string) => {
    try {
      await fetchAPI("/reviews", {
        method: "POST",
        body: JSON.stringify({ order_id: orderId, kitchen_id: kitchenId, rating: reviewRating, comment: reviewText }),
      });
      showSuccess("Review submitted", "Thank you for your feedback!");
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, has_review: true } : o));
    } catch (err) {
      showError(err);
    } finally {
      setReviewingOrder(null);
      setReviewText("");
      setReviewRating(5);
    }
  };

  const handleRemoveWishlist = async (kitchenId: string) => {
    try {
      await fetchAPI(`/wishlist/${kitchenId}`, { method: "DELETE" });
      setWishlist(prev => prev.filter(k => k.id !== kitchenId));
    } catch (err) {
      showError(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="flex-1 flex items-center justify-center py-12">
          <Card className="w-full max-w-sm mx-4">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-primary" />
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
                <p className="text-center text-xs text-muted-foreground mb-2">Are you a home chef?</p>
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

  const displayName = profile
    ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || profile.email
    : user?.name || user?.email || "";

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-16 h-16 flex items-center justify-center shrink-0">
                <User className="w-12 h-12 text-primary" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold">{displayName}</h1>
                <p className="text-sm text-muted-foreground mt-1">{profile?.email || user?.email}</p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                  <Badge variant="secondary" className="gap-1">
                    <ShoppingBag className="w-3 h-3" />
                    {orders.length} Orders
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Heart className="w-3 h-3" />
                    {wishlist.length} Favorites
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2 shrink-0" onClick={() => setConfirmLogout(true)}>
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

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
                      <><X className="w-4 h-4" />Cancel</>
                    ) : (
                      <><Edit className="w-4 h-4" />Edit</>
                    )}
                  </Button>
                </div>
              </CardHeader>
                {profileError && (
                  <div className="bg-destructive/10 text-destructive text-xs p-3 rounded-lg mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                    {profileError}
                  </div>
                )}
              <CardContent className="space-y-4">
                {profileLoading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : editingProfile ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">First Name</Label>
                        <Input className="mt-1.5 h-9 text-sm" value={profileForm.first_name || ""} onChange={e => setProfileForm((p: any) => ({ ...p, first_name: e.target.value }))} />
                      </div>
                      <div>
                        <Label className="text-sm">Last Name</Label>
                        <Input className="mt-1.5 h-9 text-sm" value={profileForm.last_name || ""} onChange={e => setProfileForm((p: any) => ({ ...p, last_name: e.target.value }))} />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">Email Address</Label>
                      <Input type="email" className="mt-1.5 h-9 text-sm" value={profileForm.email || ""} onChange={e => setProfileForm((p: any) => ({ ...p, email: e.target.value }))} />
                    </div>
                    <div>
                      <Label className="text-sm">Phone Number</Label>
                      <Input type="tel" className="mt-1.5 h-9 text-sm" value={profileForm.phone || ""} onChange={e => setProfileForm((p: any) => ({ ...p, phone: e.target.value }))} />
                    </div>
                    <div>
                      <Label className="text-sm">Address</Label>
                      <Input className="mt-1.5 h-9 text-sm" value={profileForm.address_line1 || ""} onChange={e => setProfileForm((p: any) => ({ ...p, address_line1: e.target.value }))} />
                    </div>
                    <Button size="sm" className="w-full gap-2 bg-gradient-to-r from-primary to-emerald-600" onClick={handleProfileSave}>
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
                        <p className="text-sm font-medium">{displayName || "Not set"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-3 border-b">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Email Address</p>
                        <p className="text-sm font-medium">{profile?.email || user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-3 border-b">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Phone Number</p>
                        <p className="text-sm font-medium">{profile?.phone || "Not set"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-3">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Address</p>
                        <p className="text-sm font-medium">{profile?.address_line1 || "Not set"}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            {ordersLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading orders...</div>
            ) : orders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-semibold mb-2">No orders yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Start exploring delicious home-cooked meals</p>
                  <Link href="/kitchens">
                    <Button size="sm" className="gap-2">
                      <ChefHat className="w-4 h-4" />
                      Browse Kitchens
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => {
                const kitchenName = order.kitchen?.name || order.kitchen_name || "Kitchen";
                const kitchenId = order.kitchen?.id || order.kitchen_id;
                const statusLabel = order.status || "placed";
                const isCompleted = ["completed", "picked_up"].includes(statusLabel);
                return (
                  <Card key={order.id}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{kitchenName}</h3>
                            <Badge className={isCompleted ? "bg-emerald-100 text-emerald-700 border-emerald-200 text-xs" : "bg-yellow-100 text-yellow-700 border-yellow-200 text-xs"}>
                              {statusLabel}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Order #{order.order_number || order.id} • {order.created_at ? new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                          </p>
                        </div>
                        <span className="font-bold text-lg">${Number(order.total_amount ?? order.total ?? 0).toFixed(2)}</span>
                      </div>

                      <div className="space-y-2 mb-4 pb-4 border-b">
                        {(order.order_items || order.items || []).map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{item.quantity}x {item.item_name || item.menu_item?.name || item.name}</span>
                            <span className="font-medium">${(Number(item.unit_price ?? item.price ?? 0) * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {isCompleted && !order.has_review && (
                        <div className="space-y-3">
                          {reviewingOrder !== order.id ? (
                            <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => setReviewingOrder(order.id)}>
                              <Star className="w-4 h-4" />
                              Write a Review
                            </Button>
                          ) : (
                            <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                              <div>
                                <Label className="text-sm mb-2 block">Rating</Label>
                                <div className="flex gap-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button key={star} onClick={() => setReviewRating(star)} className="transition-transform hover:scale-110">
                                      <Star className={`w-6 h-6 ${star <= reviewRating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm">Your Review</Label>
                                <Input placeholder="Share your experience..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} className="mt-1.5 h-9 text-sm" />
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" className="flex-1 gap-2 bg-gradient-to-r from-primary to-emerald-600" onClick={() => handleReviewSubmit(order.id, kitchenId)}>
                                  <Check className="w-4 h-4" />
                                  Submit Review
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => { setReviewingOrder(null); setReviewText(""); setReviewRating(5); }}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {isCompleted && order.has_review && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-emerald-600" />
                          Review submitted
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
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
                  <Link href="/faq"><Button variant="outline" size="sm" className="w-full justify-start">View FAQ</Button></Link>
                  <Link href="/how-it-works"><Button variant="outline" size="sm" className="w-full justify-start">How It Works</Button></Link>
                  <Link href="/contact"><Button variant="outline" size="sm" className="w-full justify-start">Send Message</Button></Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "wishlist" && (
          <div className="space-y-4">
            {wishlistLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading wishlist...</div>
            ) : wishlist.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-semibold mb-2">No favorites yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Save your favorite kitchens for quick access</p>
                  <Link href="/kitchens">
                    <Button size="sm" className="gap-2">
                      <ChefHat className="w-4 h-4" />
                      Discover Kitchens
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              wishlist.map((kitchen) => (
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
                            <p className="text-xs text-muted-foreground mt-0.5">{kitchen.tagline || kitchen.description}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => handleRemoveWishlist(kitchen.id)}>
                            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {Number(kitchen.rating || 0).toFixed(1)}
                          </span>
                          {kitchen.neighborhood && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {kitchen.neighborhood}
                            </span>
                          )}
                          {kitchen.preparation_time && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {kitchen.preparation_time} min
                            </span>
                          )}
                        </div>
                        <Link href={`/kitchens/${kitchen.id}`}>
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
      <Dialog open={confirmLogout} onOpenChange={setConfirmLogout}>
        <DialogContent className="max-w-[340px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Sign out?</DialogTitle>
            <DialogDescription>
              You'll need to sign back in to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-3 sm:justify-start pt-2">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => setConfirmLogout(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1 rounded-xl"
              onClick={() => { setConfirmLogout(false); logout(); }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
