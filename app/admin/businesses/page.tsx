"use client"

import { useState, useEffect, useCallback } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchAPI, APIError } from "@/lib/services/api.client"
import { Search, Building2, MoreVertical, Star, CheckCircle, Building, Clock, XCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SkeletonTable } from "@/components/shared/skeleton-cards"
import { EmptyBusinesses } from "@/components/shared/empty-state"
import { Pagination } from "@/components/shared/pagination"
import { VerificationBadge } from "@/components/shared/status-badge"
import { toast } from "sonner"

interface Kitchen {
  id: string
  name: string
  phone?: string
  neighborhood?: string
  city?: string
  rating?: number
  review_count?: number
  verification_status: "pending" | "approved" | "rejected" | "suspended"
  owner?: { id: string; email: string; name: string; phone?: string }
}

interface Meta { total: number; page: number; per_page: number }

export default function AdminBusinessesPage() {
  const [kitchens, setKitchens] = useState<Kitchen[]>([])
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, per_page: 20 })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending" | "rejected" | "suspended">("all")
  const [currentPage, setCurrentPage] = useState(1)

  const fetchKitchens = useCallback(async (page: number, status: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), per_page: "20" })
      if (status !== "all") params.set("status", status)
      const res = await fetchAPI<any>(`/admin/kitchens?${params}`)
      const raw = res as any
      setKitchens(Array.isArray(raw) ? raw : raw.data ?? [])
      if (raw.meta) setMeta(raw.meta)
    } catch (err) {
      if (err instanceof APIError && err.code !== "NETWORK_ERROR") toast.error((err as APIError).message)
      setKitchens([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchKitchens(currentPage, statusFilter) }, [currentPage, statusFilter, fetchKitchens])

  const filtered = searchQuery
    ? kitchens.filter(k =>
        k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (k.neighborhood || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : kitchens

  const handleVerify = async (id: string, status: "approved" | "rejected" | "suspended") => {
    try {
      await fetchAPI(`/admin/kitchens/${id}/verify`, { method: "PUT", body: JSON.stringify({ status }) })
      toast.success(`Kitchen ${status}`)
      setKitchens(prev => prev.map(k => k.id === id ? { ...k, verification_status: status } : k))
    } catch (err: any) {
      toast.error(err.message || "Failed to update status")
    }
  }

  const stats = {
    total: meta.total,
    approved: kitchens.filter(k => k.verification_status === "approved").length,
    pending: kitchens.filter(k => k.verification_status === "pending").length,
    rejected: kitchens.filter(k => k.verification_status === "rejected").length,
  }

  const totalPages = Math.ceil(meta.total / meta.per_page)

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Business Management</h1>
              <p className="text-muted-foreground mt-1">Manage all registered businesses</p>
            </div>
            <Button size="sm" disabled>
              <Building2 className="h-4 w-4 mr-2" />
              Add Business
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { label: "Total", value: stats.total, icon: Building, bg: "bg-primary/10", color: "text-primary" },
              { label: "Approved", value: stats.approved, icon: CheckCircle, bg: "bg-green-100", color: "text-green-600" },
              { label: "Pending", value: stats.pending, icon: Clock, bg: "bg-amber-100", color: "text-amber-600" },
              { label: "Rejected", value: stats.rejected, icon: XCircle, bg: "bg-red-100", color: "text-red-600" },
            ].map(s => (
              <Card key={s.label}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${s.bg} flex items-center justify-center`}>
                      <s.icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search businesses..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(["all", "approved", "pending", "rejected", "suspended"] as const).map(s => (
                    <Button
                      key={s}
                      variant={statusFilter === s ? "default" : "outline"}
                      size="sm"
                      onClick={() => { setStatusFilter(s); setCurrentPage(1) }}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <SkeletonTable rows={10} columns={5} />
              ) : filtered.length === 0 ? (
                <EmptyBusinesses />
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-sm">Business</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm hidden md:table-cell">Location</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm hidden sm:table-cell">Rating</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                          <th className="text-right py-3 px-4 font-semibold text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((k) => (
                          <tr key={k.id} className="border-b hover:bg-muted/50 transition-colors">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium flex items-center gap-1">
                                  {k.name}
                                  {k.verification_status === "approved" && <CheckCircle className="h-3 w-3 text-primary" />}
                                </p>
                                <p className="text-xs text-muted-foreground">{k.owner?.email || k.phone || ""}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">
                              {[k.neighborhood, k.city].filter(Boolean).join(", ")}
                            </td>
                            <td className="py-3 px-4 hidden sm:table-cell">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span className="font-medium">{Number(k.rating || 0).toFixed(1)}</span>
                                <span className="text-xs text-muted-foreground">({k.review_count || 0})</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <VerificationBadge status={k.verification_status} />
                            </td>
                            <td className="py-3 px-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {k.verification_status === "pending" && (
                                    <>
                                      <DropdownMenuItem onClick={() => handleVerify(k.id, "approved")}>Approve</DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleVerify(k.id, "rejected")}>Reject</DropdownMenuItem>
                                    </>
                                  )}
                                  {k.verification_status === "approved" && (
                                    <DropdownMenuItem onClick={() => handleVerify(k.id, "suspended")}>Suspend</DropdownMenuItem>
                                  )}
                                  {(k.verification_status === "rejected" || k.verification_status === "suspended") && (
                                    <DropdownMenuItem onClick={() => handleVerify(k.id, "approved")}>Re-approve</DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={meta.total}
                    itemsPerPage={meta.per_page}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
