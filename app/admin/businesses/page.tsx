"use client"

import { useState, useEffect, useMemo } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockBusinesses } from "@/lib/mock-data"
import { Search, Building2, MoreVertical, Star, CheckCircle, Building, Clock, XCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TableLoader } from "@/components/shared/table-loader"
import { EmptyBusinesses } from "@/components/shared/empty-state"
import { Pagination } from "@/components/shared/pagination"
import { VerificationBadge } from "@/components/shared/status-badge"
import { toast } from "sonner"

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState(mockBusinesses)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending" | "rejected">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Filter businesses
  const filteredBusinesses = useMemo(() => {
    return businesses.filter(business => {
      const matchesSearch =
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || business.verificationStatus === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [businesses, searchQuery, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage)
  const paginatedBusinesses = filteredBusinesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Stats
  const stats = useMemo(() => ({
    total: businesses.length,
    approved: businesses.filter(b => b.verificationStatus === "approved").length,
    pending: businesses.filter(b => b.verificationStatus === "pending").length,
    rejected: businesses.filter(b => b.verificationStatus === "rejected").length,
  }), [businesses])

  const handleDeleteBusiness = (businessId: string) => {
    setBusinesses(prev => prev.filter(b => b.id !== businessId))
    toast.success("Business deleted successfully")
  }

  const handleStatusChange = (businessId: string, newStatus: "approved" | "rejected") => {
    setBusinesses(prev =>
      prev.map(b =>
        b.id === businessId ? { ...b, verificationStatus: newStatus, isVerified: newStatus === "approved" } : b
      )
    )
    toast.success(`Business ${newStatus === "approved" ? "approved" : "rejected"} successfully`)
  }

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Business Management</h1>
              <p className="text-muted-foreground mt-1">Manage all registered businesses</p>
            </div>
            <Button size="sm">
              <Building2 className="h-4 w-4 mr-2" />
              Add Business
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.approved}</p>
                    <p className="text-xs text-muted-foreground">Approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.rejected}</p>
                    <p className="text-xs text-muted-foreground">Rejected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search businesses..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  {(["all", "approved", "pending", "rejected"] as const).map(status => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setStatusFilter(status)
                        setCurrentPage(1)
                      }}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <TableLoader rows={5} columns={6} />
              ) : paginatedBusinesses.length === 0 ? (
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
                        {paginatedBusinesses.map((business) => (
                          <tr key={business.id} className="border-b hover:bg-muted/50 transition-colors">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium flex items-center gap-1">
                                  {business.name}
                                  {business.isVerified && <CheckCircle className="h-3 w-3 text-primary" />}
                                </p>
                                <p className="text-xs text-muted-foreground">{business.phone}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">
                              {business.neighborhood}, {business.city}
                            </td>
                            <td className="py-3 px-4 hidden sm:table-cell">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span className="font-medium">{business.rating}</span>
                                <span className="text-xs text-muted-foreground">({business.reviewCount})</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <VerificationBadge status={business.verificationStatus} />
                            </td>
                            <td className="py-3 px-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>Edit Business</DropdownMenuItem>
                                  {business.verificationStatus === "pending" && (
                                    <>
                                      <DropdownMenuItem onClick={() => handleStatusChange(business.id, "approved")}>
                                        Approve
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleStatusChange(business.id, "rejected")}>
                                        Reject
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {business.verificationStatus === "approved" && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(business.id, "rejected")}>
                                      Suspend
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDeleteBusiness(business.id)}
                                  >
                                    Delete Business
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredBusinesses.length}
                    itemsPerPage={itemsPerPage}
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
