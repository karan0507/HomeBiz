"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { BusinessLayout } from "@/components/business/business-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockOrders, mockProducts, mockServices, mockReviews } from "@/lib/mock-data"
import { ShoppingCart, Package, DollarSign, Star, TrendingUp, Eye } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function BusinessDashboardPage() {
  const { user } = useAuth()
  const businessOrders = mockOrders.filter((o) => o.businessId === "1")
  const businessProducts = mockProducts.filter((p) => p.businessId === "1")
  const businessServices = mockServices.filter((s) => s.businessId === "1")
  const businessReviews = mockReviews.filter((r) => r.businessId === "1")

  const totalRevenue = businessOrders.reduce((sum, order) => sum + order.total, 0)
  const avgRating =
    businessReviews.length > 0 ? businessReviews.reduce((sum, r) => sum + r.rating, 0) / businessReviews.length : 0

  const stats = [
    {
      title: "Total Orders",
      value: businessOrders.length,
      icon: ShoppingCart,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Products & Services",
      value: businessProducts.length + businessServices.length,
      icon: Package,
      trend: "+2",
      trendUp: true,
    },
    {
      title: "Revenue",
      value: `$${totalRevenue}`,
      icon: DollarSign,
      trend: "+18%",
      trendUp: true,
    },
    {
      title: "Avg Rating",
      value: avgRating.toFixed(1),
      icon: Star,
      trend: "+0.3",
      trendUp: true,
    },
  ]

  return (
    <ProtectedRoute requireBusiness>
      <BusinessLayout>
        <div className="space-y-6 md:space-y-8">
          {/* Header with gradient accent */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-emerald-500/5 rounded-2xl -z-10" />
            <div className="py-2">
              <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1 md:mt-2">Welcome back, <span className="text-primary font-medium">{user?.name}</span></p>
            </div>
          </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                const gradients = [
                  "from-primary/10 to-emerald-500/10",
                  "from-accent/10 to-blue-500/10",
                  "from-yellow-500/10 to-orange-500/10",
                  "from-pink-500/10 to-purple-500/10"
                ]
                return (
                  <Card key={stat.title} className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-50`} />
                    <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                      <div className="flex items-center gap-1 mt-2">
                        <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          <TrendingUp className="h-3 w-3" />
                          <span className="text-xs font-medium">{stat.trend}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">from last month</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
              {/* Recent Orders */}
              <Card className="hover:shadow-lg transition-all">
                <CardHeader className="border-b border-border/50">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                    </div>
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {businessOrders.length > 0 ? (
                    <div className="space-y-3">
                      {businessOrders.map((order) => (
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
                                  ? "bg-green-100 text-green-700"
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

              {/* Performance Metrics */}
              <Card className="hover:shadow-lg transition-all">
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
                        <span className="text-sm font-bold text-primary">2,543</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-primary to-emerald-500 h-2.5 rounded-full transition-all" style={{ width: "75%" }} />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Click-through Rate</span>
                        <span className="text-sm font-bold text-accent">18.5%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-accent to-blue-400 h-2.5 rounded-full transition-all" style={{ width: "60%" }} />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Customer Engagement</span>
                        <span className="text-sm font-bold text-green-600">89%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-2.5 rounded-full transition-all" style={{ width: "89%" }} />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Review Response Rate</span>
                        <span className="text-sm font-bold text-blue-600">95%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2.5 rounded-full transition-all" style={{ width: "95%" }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </div>
        </div>
      </BusinessLayout>
    </ProtectedRoute>
  )
}
