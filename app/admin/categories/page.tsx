"use client"

import { useState, useEffect, useMemo } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockCategories } from "@/lib/mock-data"
import { Search, FolderPlus, MoreVertical, Utensils, Coffee, Heart, ShoppingBag, Briefcase, Home, FolderTree, Star } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TableLoader } from "@/components/shared/table-loader"
import { EmptyCategories } from "@/components/shared/empty-state"
import { Pagination } from "@/components/shared/pagination"
import { toast } from "sonner"

const iconMap: Record<string, any> = {
  utensils: Utensils,
  coffee: Coffee,
  heart: Heart,
  "shopping-bag": ShoppingBag,
  briefcase: Briefcase,
  home: Home,
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(mockCategories)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [featuredFilter, setFeaturedFilter] = useState<"all" | "featured" | "regular">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Filter categories
  const filteredCategories = useMemo(() => {
    return categories.filter(category => {
      const matchesSearch =
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFeatured =
        featuredFilter === "all" ||
        (featuredFilter === "featured" && category.featured) ||
        (featuredFilter === "regular" && !category.featured)
      return matchesSearch && matchesFeatured
    })
  }, [categories, searchQuery, featuredFilter])

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Stats
  const stats = useMemo(() => ({
    total: categories.length,
    featured: categories.filter(c => c.featured).length,
    totalBusinesses: categories.reduce((sum, c) => sum + c.businessCount, 0),
  }), [categories])

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId))
    toast.success("Category deleted successfully")
  }

  const handleToggleFeatured = (categoryId: string) => {
    setCategories(prev =>
      prev.map(c =>
        c.id === categoryId ? { ...c, featured: !c.featured } : c
      )
    )
    toast.success("Category updated successfully")
  }

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Category Management</h1>
              <p className="text-muted-foreground mt-1">Manage business categories</p>
            </div>
            <Button size="sm">
              <FolderPlus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FolderTree className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Categories</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Star className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.featured}</p>
                    <p className="text-xs text-muted-foreground">Featured</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalBusinesses}</p>
                    <p className="text-xs text-muted-foreground">Businesses</p>
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
                    placeholder="Search categories..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  {(["all", "featured", "regular"] as const).map(filter => (
                    <Button
                      key={filter}
                      variant={featuredFilter === filter ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setFeaturedFilter(filter)
                        setCurrentPage(1)
                      }}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <TableLoader rows={5} columns={5} />
              ) : paginatedCategories.length === 0 ? (
                <EmptyCategories />
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-sm">Category</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm hidden md:table-cell">Slug</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm hidden sm:table-cell">Businesses</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                          <th className="text-right py-3 px-4 font-semibold text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedCategories.map((category) => {
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
                                    <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{category.description}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{category.slug}</td>
                              <td className="py-3 px-4 font-medium hidden sm:table-cell">{category.businessCount}</td>
                              <td className="py-3 px-4">
                                <Badge className={category.featured ? "bg-amber-100 text-amber-800 hover:bg-amber-100" : "bg-gray-100 text-gray-800 hover:bg-gray-100"}>
                                  {category.featured ? "Featured" : "Regular"}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Edit Category</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleToggleFeatured(category.id)}>
                                      {category.featured ? "Unfeature" : "Feature"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => handleDeleteCategory(category.id)}
                                    >
                                      Delete Category
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredCategories.length}
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
