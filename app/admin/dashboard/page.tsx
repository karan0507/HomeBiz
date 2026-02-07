"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockBusinesses, mockUsers, mockCategories, mockReviews } from "@/lib/mock-data"
import { Users, Building, FolderTree, Star, TrendingUp, Activity } from "lucide-react"

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Total Users",
      value: mockUsers.length,
      icon: Users,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Total Businesses",
      value: mockBusinesses.length,
      icon: Building,
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Categories",
      value: mockCategories.length,
      icon: FolderTree,
      trend: "+2",
      trendUp: true,
    },
    {
      title: "Reviews",
      value: mockReviews.length,
      icon: Star,
      trend: "+24%",
      trendUp: true,
    },
  ]

  const recentBusinesses = mockBusinesses.slice(0, 5)
  const recentReviews = mockReviews.slice(0, 5)

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div className="space-y-6 md:space-y-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1 md:mt-2">Overview of your business directory platform</p>
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
              {/* Recent Businesses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Businesses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBusinesses.map((business) => (
                      <div key={business.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{business.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {business.neighborhood}, {business.city}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              business.verificationStatus === "approved"
                                ? "bg-green-100 text-green-700"
                                : business.verificationStatus === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {business.verificationStatus}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Recent Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentReviews.map((review) => (
                      <div key={review.id} className="py-2 border-b last:border-0">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium">{review.userName}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
