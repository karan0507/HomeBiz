"use client"

import { useState, useEffect } from "react"
import { BusinessLayout } from "@/components/business/business-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert } from "@/components/ui/alert"
import { ShoppingCart, Package, DollarSign, Star, TrendingUp, TrendingDown, Eye, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { fetchAPI } from "@/lib/services/api.client"
import { showError } from "@/lib/notifications"
import { SkeletonStatCard, SkeletonCardContent } from "@/components/shared/skeleton-cards"

export default function BusinessDashboardPage() {
  const { user } = useAuth();

  // State for data with safe defaults (0/"")
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState([
    { title: "Total Orders", value: 0, icon: ShoppingCart, trend: "+0%", trendUp: true },
    { title: "Menu Items", value: 0, icon: Package, trend: "+0", trendUp: true },
    { title: "Revenue", value: "$0", icon: DollarSign, trend: "+0%", trendUp: true },
    { title: "Avg Rating", value: "0.0", icon: Star, trend: "+0.0", trendUp: true },
  ]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  // Fetch data safely
  useEffect(() => {
    if (!user?.id) return;

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Attempt to fetch real data
        const [statsData, ordersData] = await Promise.allSettled([
           fetchAPI<any>('/business/dashboard', { signal: controller.signal }),
           fetchAPI<any>('/business/orders', { signal: controller.signal })
        ]);

        if (controller.signal.aborted) return;

        // Check for critical failures
        if (statsData.status === 'rejected' && ordersData.status === 'rejected') {
          setError('Unable to load dashboard data. Please check your connection.');
          showError(statsData.reason);
          return;
        }

        // Process Stats — merge API values into frontend shape (icons/titles stay local)
        // Backend: { total_orders, pending_orders, revenue_today, revenue_month, avg_rating, total_reviews, badges }
        if (statsData.status === 'fulfilled' && statsData.value) {
            const d = statsData.value as any;
            const ordBadge = d.badges?.orders || {};
            const revBadge = d.badges?.revenue || {};
            setStats(prev => [
                { ...prev[0], value: d.total_orders ?? prev[0].value, trend: ordBadge.text ?? prev[0].trend, trendUp: ordBadge.trend === 'up' },
                { ...prev[1], value: d.total_reviews ?? prev[1].value, trend: prev[1].trend },
                { ...prev[2], value: d.revenue_month != null ? `$${Number(d.revenue_month).toFixed(0)}` : prev[2].value, trend: revBadge.text ?? prev[2].trend, trendUp: revBadge.trend === 'up' },
                { ...prev[3], value: d.avg_rating != null ? Number(d.avg_rating).toFixed(1) : prev[3].value, trend: prev[3].trend },
            ]);
        } else if (statsData.status === 'rejected') {
            setError('Unable to load statistics. Showing default values.');
        }

        // Process Orders — normalise snake_case from backend
        if (ordersData.status === 'fulfilled' && Array.isArray(ordersData.value)) {
            setRecentOrders(ordersData.value.slice(0, 5).map((o: any) => ({
                ...o,
                customerName: o.customer_name || o.customerName || "Customer",
                total: o.total_amount ?? o.total ?? 0,
            })));
        } else if (ordersData.status === 'rejected') {
            if (!error) setError('Unable to load recent orders.');
        }

      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error("Dashboard error:", err);
        setError('An unexpected error occurred.');
        showError(err);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [user?.id]); // Only re-run if USER ID changes, not the whole user object

  return (
    <ProtectedRoute requireBusiness>
      <BusinessLayout>
        <div className="space-y-6 md:space-y-8">
          {/* Header with gradient accent */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-orange-500/5 rounded-2xl -z-10" />
            <div className="py-2">
              <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1 md:mt-2">Welcome back, <span className="text-primary font-medium">{user?.name}</span></p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">Dashboard Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </Alert>
          )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
              ) : (
                stats.map((stat, index) => {
                  const Icon = stat.icon
                  const gradients = [
                    "from-primary/10 to-orange-500/10",
                    "from-accent/10 to-blue-500/10",
                    "from-yellow-500/10 to-orange-500/10",
                    "from-pink-500/10 to-purple-500/10"
                  ]
                  return (
                    <Card key={stat.title} className="relative overflow-hidden transition-all md:hover:shadow-lg md:hover:-translate-y-1 min-w-0">
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-50`} />
                      <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                      </CardHeader>
                      <CardContent className="relative">
                        <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                        <div className="flex items-center gap-1 mt-2">
                          <Badge variant="secondary" className={stat.trendUp ? "bg-orange-100 text-orange-700 hover:bg-orange-200" : "bg-red-100 text-red-700 hover:bg-red-200"}>
                            {stat.trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {stat.trend}
                          </Badge>
                          <span className="text-xs text-muted-foreground">from last month</span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
              <Card className="relative transition-all md:hover:shadow-lg min-w-0">
                <CardHeader className="border-b border-border/50">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                    </div>
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {loading ? (
                    <SkeletonCardContent rows={4} />
                  ) : recentOrders.length > 0 ? (
                    <div className="space-y-3">
                      {recentOrders.map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground truncate">{order.customerName}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">${order.total}</p>
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                                order.status === "completed" || order.status === "picked_up"
                                  ? "bg-orange-100 text-orange-700"
                                  : order.status === "preparing" || order.status === "ready"
                                    ? "bg-blue-100 text-blue-700"
                                    : order.status === "placed" || order.status === "confirmed"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                              }`}
                            >
                              {order.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center mb-3">
                        <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">No orders yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="relative transition-all md:hover:shadow-lg min-w-0">
                <CardHeader className="border-b border-border/50">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <Eye className="h-5 w-5 text-purple-600" />
                    </div>
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-5">
                    <div className="p-3 rounded-xl bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Profile Views</span>
                        <span className="text-sm font-bold text-primary">0</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-primary to-orange-500 h-2.5 rounded-full transition-all" style={{ width: "0%" }} />
                      </div>
                    </div>
                    {/* Simplified for now */}
                  </div>
                </CardContent>
              </Card>
          </div>
        </div>
      </BusinessLayout>
    </ProtectedRoute>
  )
}
