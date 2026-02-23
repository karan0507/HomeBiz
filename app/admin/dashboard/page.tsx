"use client"

import { useState, useEffect, useRef } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchAPI } from "@/lib/services/api.client"
import { Users, Building, FolderTree, Star, TrendingUp, Activity } from "lucide-react"

interface AdminStats {
  total_users?: number
  total_kitchens?: number
  total_categories?: number
  total_reviews?: number
}

interface RecentKitchen {
  id: string
  name: string
  neighborhood?: string
  city?: string
  verification_status: string
}

interface RecentReview {
  id: string
  reviewer_name?: string
  rating: number
  comment?: string
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>({})
  const [recentKitchens, setRecentKitchens] = useState<RecentKitchen[]>([])
  const [recentReviews, setRecentReviews] = useState<RecentReview[]>([])
  const [loading, setLoading] = useState(true)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    Promise.allSettled([
      fetchAPI<any>("/admin/stats"),
      fetchAPI<any>("/admin/kitchens?per_page=5&page=1"),
      fetchAPI<any>("/admin/reviews?per_page=5&page=1"),
    ]).then(([statsRes, kitchensRes, reviewsRes]) => {
      if (statsRes.status === "fulfilled") {
        const d = statsRes.value as any
        setStats(d?.stats ?? d ?? {})
      }
      if (kitchensRes.status === "fulfilled") {
        const d = kitchensRes.value as any
        setRecentKitchens(Array.isArray(d) ? d.slice(0, 5) : (d?.data ?? []).slice(0, 5))
      }
      if (reviewsRes.status === "fulfilled") {
        const d = reviewsRes.value as any
        setRecentReviews(Array.isArray(d) ? d.slice(0, 5) : (d?.data ?? []).slice(0, 5))
      }
    }).finally(() => setLoading(false))
  }, [])

  const statCards = [
    { title: "Total Users", value: stats.total_users ?? "—", icon: Users, trend: null },
    { title: "Total Businesses", value: stats.total_kitchens ?? "—", icon: Building, trend: null },
    { title: "Categories", value: stats.total_categories ?? "—", icon: FolderTree, trend: null },
    { title: "Reviews", value: stats.total_reviews ?? "—", icon: Star, trend: null },
  ]

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
            {statCards.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{loading ? "..." : stat.value}</div>
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
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : recentKitchens.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No businesses yet.</p>
                ) : (
                  <div className="space-y-4">
                    {recentKitchens.map((kitchen) => (
                      <div key={kitchen.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{kitchen.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {[kitchen.neighborhood, kitchen.city].filter(Boolean).join(", ")}
                          </p>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            kitchen.verification_status === "approved"
                              ? "bg-green-100 text-green-700"
                              : kitchen.verification_status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {kitchen.verification_status}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : recentReviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No reviews yet.</p>
                ) : (
                  <div className="space-y-4">
                    {recentReviews.map((review) => (
                      <div key={review.id} className="py-2 border-b last:border-0">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium">{review.reviewer_name || "Anonymous"}</p>
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
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
