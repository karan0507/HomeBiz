"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockCategories } from "@/lib/mock-data"
import { Search, FolderPlus, MoreVertical, Utensils, Coffee, Heart, ShoppingBag, Briefcase, Home } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const iconMap: Record<string, any> = {
  utensils: Utensils,
  coffee: Coffee,
  heart: Heart,
  "shopping-bag": ShoppingBag,
  briefcase: Briefcase,
  home: Home,
}

export default function AdminCategoriesPage() {
  return (
    <ProtectedRoute requireAdmin>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-display font-bold">Category Management</h1>
                <p className="text-muted-foreground mt-2">Manage business categories</p>
              </div>
              <Button>
                <FolderPlus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search categories..." className="pl-9" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Category</th>
                        <th className="text-left py-3 px-4 font-semibold">Slug</th>
                        <th className="text-left py-3 px-4 font-semibold">Businesses</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        <th className="text-right py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockCategories.map((category) => {
                        const Icon = iconMap[category.icon] || Briefcase
                        return (
                          <tr key={category.id} className="border-b hover:bg-muted/50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{category.name}</p>
                                  <p className="text-sm text-muted-foreground line-clamp-1">{category.description}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">{category.slug}</td>
                            <td className="py-3 px-4 font-medium">{category.businessCount}</td>
                            <td className="py-3 px-4">
                              <Badge variant={category.featured ? "default" : "secondary"}>
                                {category.featured ? "Featured" : "Regular"}
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
                                  <DropdownMenuItem>Edit Category</DropdownMenuItem>
                                  <DropdownMenuItem>{category.featured ? "Unfeature" : "Feature"}</DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">Delete Category</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        )
                      })}
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
