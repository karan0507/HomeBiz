"use client"

import { useState, useEffect, useCallback } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchAPI, APIError } from "@/lib/services/api.client"
import { Search, UserPlus, MoreVertical, Users, Building, Shield } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TableLoader } from "@/components/shared/table-loader"
import { EmptyUsers } from "@/components/shared/empty-state"
import { Pagination } from "@/components/shared/pagination"
import { UserStatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface User {
  id: string
  email: string
  name: string
  first_name?: string
  last_name?: string
  phone?: string
  role: "customer" | "business" | "admin"
  is_active: boolean
  created_at: string
}

interface Meta {
  total: number
  page: number
  per_page: number
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, per_page: 20 })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "business" | "customer">("all")
  const [currentPage, setCurrentPage] = useState(1)

  const fetchUsers = useCallback(async (page: number, search: string, role: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), per_page: "20" })
      if (search) params.set("search", search)
      if (role !== "all") params.set("role", role)
      const res = await fetchAPI<{ data: User[]; meta: Meta }>(`/admin/users?${params}`)
      // fetchAPI returns result.data — for paginated endpoints the shape is { data, meta }
      const raw = res as any
      setUsers(Array.isArray(raw) ? raw : raw.data ?? [])
      if (raw.meta) setMeta(raw.meta)
    } catch (err) {
      if (err instanceof APIError && err.code !== "NETWORK_ERROR") {
        toast.error(err.message)
      }
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => fetchUsers(currentPage, searchQuery, roleFilter), 300)
    return () => clearTimeout(t)
  }, [currentPage, searchQuery, roleFilter, fetchUsers])

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await fetchAPI(`/admin/users/${userId}`, { method: "PUT", body: JSON.stringify({ role }) })
      toast.success("Role updated")
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: role as User["role"] } : u))
    } catch (err: any) {
      toast.error(err.message || "Failed to update role")
    }
  }

  const handleDeactivate = async (userId: string) => {
    try {
      await fetchAPI(`/admin/users/${userId}`, { method: "DELETE" })
      toast.success("User deactivated")
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: false } : u))
    } catch (err: any) {
      toast.error(err.message || "Failed to deactivate user")
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      case "business": return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const totalPages = Math.ceil(meta.total / meta.per_page)

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">User Management</h1>
              <p className="text-muted-foreground mt-1">Manage all users in the platform</p>
            </div>
            <Button size="sm" disabled>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{meta.total}</p>
                    <p className="text-xs text-muted-foreground">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{users.filter(u => u.role === "customer").length}</p>
                    <p className="text-xs text-muted-foreground">Customers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{users.filter(u => u.role === "business").length}</p>
                    <p className="text-xs text-muted-foreground">Businesses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{users.filter(u => u.role === "admin").length}</p>
                    <p className="text-xs text-muted-foreground">Admins</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  {(["all", "customer", "business", "admin"] as const).map(role => (
                    <Button
                      key={role}
                      variant={roleFilter === role ? "default" : "outline"}
                      size="sm"
                      onClick={() => { setRoleFilter(role); setCurrentPage(1) }}
                    >
                      {role === "all" ? "All" : role.charAt(0).toUpperCase() + role.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <TableLoader rows={5} columns={6} />
              ) : users.length === 0 ? (
                <EmptyUsers />
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm hidden md:table-cell">Email</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Role</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm hidden lg:table-cell">Phone</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm hidden sm:table-cell">Status</th>
                          <th className="text-right py-3 px-4 font-semibold text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-muted/50 transition-colors">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium">{user.name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || "—"}</p>
                                <p className="text-xs text-muted-foreground md:hidden">{user.email}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{user.email}</td>
                            <td className="py-3 px-4">
                              <Badge className={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{user.phone || "—"}</td>
                            <td className="py-3 px-4 hidden sm:table-cell">
                              <UserStatusBadge status={user.is_active ? "active" : "inactive"} />
                            </td>
                            <td className="py-3 px-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {user.role !== "admin" && (
                                    <DropdownMenuItem onClick={() => handleRoleChange(user.id, "admin")}>
                                      Make Admin
                                    </DropdownMenuItem>
                                  )}
                                  {user.role !== "customer" && (
                                    <DropdownMenuItem onClick={() => handleRoleChange(user.id, "customer")}>
                                      Make Customer
                                    </DropdownMenuItem>
                                  )}
                                  {user.is_active && (
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => handleDeactivate(user.id)}
                                    >
                                      Deactivate
                                    </DropdownMenuItem>
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
