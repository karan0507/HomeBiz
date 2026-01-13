"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockBusinesses } from "@/lib/mock-data"
import { Search, Building2 as BuildingPlus, MoreVertical, Star, CheckCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AdminBusinessesPage() {
  return (
    <ProtectedRoute requireAdmin>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-display font-bold">Business Management</h1>
                <p className="text-muted-foreground mt-2">Manage all registered businesses</p>
              </div>
              <Button>
                <BuildingPlus className="h-4 w-4 mr-2" />
                Add Business
              </Button>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search businesses..." className="pl-9" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Business</th>
                        <th className="text-left py-3 px-4 font-semibold">Location</th>
                        <th className="text-left py-3 px-4 font-semibold">Rating</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 font-semibold">Type</th>
                        <th className="text-right py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockBusinesses.map((business) => (
                        <tr key={business.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div>
                                <p className="font-medium flex items-center gap-1">
                                  {business.name}
                                  {business.isVerified && <CheckCircle className="h-3 w-3 text-primary" />}
                                </p>
                                <p className="text-sm text-muted-foreground">{business.phone}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {business.city}, {business.state}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              <span className="font-medium">{business.rating}</span>
                              <span className="text-muted-foreground">({business.reviewCount})</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                business.status === "active"
                                  ? "default"
                                  : business.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {business.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={business.isPremium ? "default" : "outline"}>
                              {business.isPremium ? "Premium" : "Free"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Business</DropdownMenuItem>
                                <DropdownMenuItem>
                                  {business.status === "active" ? "Suspend" : "Activate"}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Delete Business</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
