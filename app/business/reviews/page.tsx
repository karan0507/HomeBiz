"use client"

import { useState, useEffect, useMemo } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { BusinessLayout } from "@/components/business/business-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Star, MessageSquare } from "lucide-react"
import { SkeletonPageLoader } from "@/components/shared/skeleton-cards"
import { EmptyReviews } from "@/components/shared/empty-state"
import { Pagination } from "@/components/shared/pagination"
import { useAuth } from "@/lib/auth-context"
import { fetchAPI } from "@/lib/services/api.client"
import { showError } from "@/lib/notifications"
import { toast } from "sonner"

interface Review {
  id: string
  userName: string
  userAvatar: string
  rating: number
  title?: string
  comment: string
  response?: string
  helpful: number
  createdAt: string
}

function transformReview(r: any): Review {
  const profile = r.customer || r.profile || {}
  return {
    id: r.id,
    userName: profile.name
      || profile.full_name
      || `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
      || "Anonymous",
    userAvatar: profile.avatar_url || "",
    rating: Number(r.rating ?? 0),
    title: r.title,
    comment: r.comment || r.body || "",
    response: r.owner_response || r.response,
    helpful: Number(r.helpful_count ?? r.helpful ?? 0),
    createdAt: r.created_at || r.createdAt || "",
  }
}

export default function BusinessReviewsPage() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [ratingFilter, setRatingFilter] = useState<"all" | "5" | "4" | "3" | "2" | "1">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Respond state
  const [respondingTo, setRespondingTo] = useState<string | null>(null)
  const [responseText, setResponseText] = useState("")
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false)

  useEffect(() => {
    if (!user) return
    let mounted = true

    fetchAPI<{ id: string }>("/business/kitchen")
      .then(kitchen => fetchAPI<any[]>(`/kitchens/${kitchen.id}/reviews`))
      .then(data => {
        if (!mounted) return
        setReviews((Array.isArray(data) ? data : []).map(transformReview))
      })
      .catch(showError)
      .finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [user?.id])

  const handleSubmitResponse = async (reviewId: string) => {
    if (!responseText.trim()) return
    setIsSubmittingResponse(true)
    try {
      await fetchAPI(`/reviews/${reviewId}/response`, {
        method: "POST",
        body: JSON.stringify({ response: responseText.trim() }),
      })
      setReviews(prev =>
        prev.map(r => r.id === reviewId ? { ...r, response: responseText.trim() } : r)
      )
      setRespondingTo(null)
      setResponseText("")
      toast.success("Response posted")
    } catch (err) {
      showError(err)
    } finally {
      setIsSubmittingResponse(false)
    }
  }

  const filteredReviews = useMemo(() => {
    if (ratingFilter === "all") return reviews
    return reviews.filter(r => r.rating === parseInt(ratingFilter))
  }, [reviews, ratingFilter])

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage)
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const stats = useMemo(() => {
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0
    const responded = reviews.filter(r => r.response).length
    return {
      avgRating: avgRating.toFixed(1),
      totalReviews: reviews.length,
      responseRate: reviews.length > 0 ? `${Math.round((responded / reviews.length) * 100)}%` : "—",
    }
  }, [reviews])

  return (
    <ProtectedRoute requireBusiness>
      <BusinessLayout>
        <div className="space-y-6 max-w-4xl">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Customer Reviews</h1>
            <p className="text-muted-foreground mt-1">Read and respond to customer feedback</p>
          </div>

          {loading ? (
            <SkeletonPageLoader />
          ) : reviews.length === 0 ? (
            <Card>
              <CardContent className="p-0">
                <EmptyReviews />
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">{stats.avgRating}</div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.round(parseFloat(stats.avgRating))
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">Based on {stats.totalReviews} reviews</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">{stats.totalReviews}</div>
                      <p className="text-sm text-muted-foreground">Total Reviews</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">{stats.responseRate}</div>
                      <p className="text-sm text-muted-foreground">Response Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2 flex-wrap">
                {(["all", "5", "4", "3", "2", "1"] as const).map(rating => (
                  <Button
                    key={rating}
                    variant={ratingFilter === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => { setRatingFilter(rating); setCurrentPage(1) }}
                  >
                    {rating === "all" ? "All" : (
                      <span className="flex items-center gap-1">
                        {rating} <Star className="h-3 w-3 fill-current" />
                      </span>
                    )}
                  </Button>
                ))}
              </div>

              {paginatedReviews.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No reviews with this rating.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {paginatedReviews.map((review) => (
                    <Card key={review.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={review.userAvatar || "/placeholder.svg"} />
                            <AvatarFallback>{review.userName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{review.userName}</h4>
                              <span className="text-sm text-muted-foreground">
                                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {review.title && <p className="font-medium">{review.title}</p>}
                        <p className="text-sm leading-relaxed text-muted-foreground">{review.comment}</p>

                        {review.response && (
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Your Response:</p>
                            <p className="text-sm">{review.response}</p>
                          </div>
                        )}

                        {/* Inline respond form */}
                        {respondingTo === review.id && (
                          <div className="space-y-2 pt-2">
                            <Textarea
                              placeholder="Write your response..."
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleSubmitResponse(review.id)}
                                disabled={isSubmittingResponse || !responseText.trim()}
                              >
                                {isSubmittingResponse ? "Posting..." : "Post Response"}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { setRespondingTo(null); setResponseText("") }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-4 pt-3 border-t">
                          {!review.response && respondingTo !== review.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => { setRespondingTo(review.id); setResponseText("") }}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Respond
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {filteredReviews.length > itemsPerPage && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredReviews.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </BusinessLayout>
    </ProtectedRoute>
  )
}
