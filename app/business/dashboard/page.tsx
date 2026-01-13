"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { BusinessSidebar } from "@/components/business/business-sidebar"
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
      <div className="flex min-h-screen bg-background">
        <BusinessSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-display font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-2">Welcome back, {user?.name}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600 font-medium">{stat.trend}</span>
                        <span className="text-xs text-muted-foreground">from last month</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {businessOrders.length > 0 ? (
                    <div className="space-y-4">
                      {businessOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground truncate">{order.customerName}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${order.total}</p>
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "processing"
                                    ? "bg-blue-100 text-blue-700"
                                    : order.status === "pending"
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
                    <p className="text-muted-foreground text-center py-8">No orders yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Profile Views</span>
                        <span className="text-sm font-medium">2,543</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Click-through Rate</span>
                        <span className="text-sm font-medium">18.5%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-accent h-2 rounded-full" style={{ width: "60%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Customer Engagement</span>
                        <span className="text-sm font-medium">89%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "89%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Review Response Rate</span>
                        <span className="text-sm font-medium">95%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "95%" }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
