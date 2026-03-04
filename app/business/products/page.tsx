"use client"

import { useState, useEffect, useMemo } from "react"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { ProtectedRoute } from "@/components/protected-route"
import { BusinessLayout } from "@/components/business/business-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { fetchAPI } from "@/lib/services/api.client"
import { showError } from "@/lib/notifications"
import { Plus, MoreVertical, Search, Package, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SkeletonGrid } from "@/components/shared/skeleton-cards"
import { EmptyProducts } from "@/components/shared/empty-state"
import { Pagination } from "@/components/shared/pagination"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  images: string[]
  available: boolean
  prepTimeMin: number
  prepTimeMax: number
  serves?: number
  spiceLevel?: number
  quantity?: number
  quantityUnit?: string
  tags?: string[]
  dietaryInfo?: string[]
  displayOrder: number
  businessId: string
}

const QUANTITY_UNIT_OPTIONS = [
  { value: "g", label: "Grams (g)" },
  { value: "kg", label: "Kilograms (kg)" },
  { value: "ml", label: "Milliliters (ml)" },
  { value: "l", label: "Liters (l)" },
  { value: "piece", label: "Piece" },
  { value: "serving", label: "Serving" },
  { value: "portion", label: "Portion" },
  { value: "dozen", label: "Dozen" },
  { value: "pack", label: "Pack" },
]

const SPICE_LEVELS = [
  { value: "0", label: "Not Spicy" },
  { value: "1", label: "Mild 🌶️" },
  { value: "2", label: "Medium 🌶️🌶️" },
  { value: "3", label: "Hot 🌶️🌶️🌶️" },
]

const MENU_CATEGORY_OPTIONS = [
  "Main Course",
  "Appetizer",
  "Dessert",
  "Beverage",
  "Side Dish",
  "Snack",
]

export default function BusinessProductsPage() {
  const { user } = useAuth()
  const [kitchenId, setKitchenId] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "unavailable">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const itemsPerPage = 6
  // Mobile infinite scroll
  const [visibleCount, setVisibleCount] = useState(itemsPerPage)

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    prep_time_min: 30,
    prep_time_max: 45,
    serves: 1,
    spice_level: 0,
    quantity: "",
    quantity_unit: "",
    tags: "",
    dietary_info: "",
    available: true,
    image_url: "",
    display_order: 1,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // !! Bug fix: auth guard moved AFTER all hooks to respect Rules of Hooks
  // (was on line 114, between state declarations and useEffect calls)

  useEffect(() => {
    if (!user) return
    let mounted = true

    fetchAPI<{ id: string }>("/business/kitchen")
      .then(kitchen => {
        if (!mounted) return
        setKitchenId(kitchen.id)
        return fetchAPI<any[]>(`/kitchens/${kitchen.id}/menu-items`)
      })
      .then(items => {
        if (!mounted || !items) return
        setProducts((Array.isArray(items) ? items : []).map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          price: Number(item.price ?? 0),
          category: item.category || "",
          images: item.image_url ? [item.image_url] : ["/placeholder.svg"],
          available: item.is_available ?? true,
          prepTimeMin: item.prep_time_min ?? 30,
          prepTimeMax: item.prep_time_max ?? 45,
          serves: item.serves,
          spiceLevel: item.spice_level,
          quantity: item.quantity,
          quantityUnit: item.quantity_unit,
          tags: item.tags || [],
          dietaryInfo: item.dietary_info || [],
          displayOrder: item.display_order ?? 1,
          businessId: user.id,
        })))
      })
      .catch(showError)
      .finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [user?.id])

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && product.available) ||
        (availabilityFilter === "unavailable" && !product.available)
      return matchesSearch && matchesAvailability
    })
  }, [products, searchQuery, availabilityFilter])

  // Reset visible count when filters change
  useEffect(() => { setVisibleCount(itemsPerPage); setCurrentPage(1) }, [searchQuery, availabilityFilter])

  // Pagination (desktop)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  // Mobile: show first visibleCount items
  const mobileProducts = filteredProducts.slice(0, visibleCount)
  const mobileHasMore = visibleCount < filteredProducts.length

  const mobileSentinelRef = useInfiniteScroll({
    hasMore: mobileHasMore,
    isLoading: loading,
    onLoadMore: () => setVisibleCount((v) => v + itemsPerPage),
  })

  // Auth guard — AFTER all hooks (Rules of Hooks)
  if (!user) return null

  // Stats
  const stats = useMemo(() => ({
    total: products.length,
    available: products.filter(p => p.available).length,
    unavailable: products.filter(p => !p.available).length,
  }), [products])

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = "Product name is required"
    if (!formData.description.trim()) errors.description = "Description is required"
    if (!formData.price || parseFloat(formData.price) <= 0) errors.price = "Valid price is required"
    if (!formData.category) errors.category = "Category is required"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      prep_time_min: 30,
      prep_time_max: 45,
      serves: 1,
      spice_level: 0,
      quantity: "",
      quantity_unit: "",
      tags: "",
      dietary_info: "",
      available: true,
      image_url: "",
      display_order: 1,
    })
    setFormErrors({})
    setImagePreview(null)
    setSelectedFile(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size too large (max 5MB)")
        return
      }
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddProduct = async () => {
    if (!validateForm() || !user || !kitchenId) return

    setIsSubmitting(true)
    try {
      const created = await fetchAPI<any>(`/kitchens/${kitchenId}/menu-items`, {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          is_available: formData.available,
          image_url: formData.image_url,
          prep_time_min: formData.prep_time_min,
          prep_time_max: formData.prep_time_max,
          serves: formData.serves,
          spice_level: formData.spice_level > 0 ? formData.spice_level : null,
          quantity: formData.quantity ? parseFloat(formData.quantity) : null,
          quantity_unit: formData.quantity_unit || null,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          dietary_info: formData.dietary_info.split(',').map(d => d.trim()).filter(Boolean),
          display_order: formData.display_order,
        }),
      })
      const newProduct: Product = {
        id: created.id,
        name: created.name,
        description: created.description || formData.description,
        price: Number(created.price ?? formData.price),
        category: created.category || formData.category,
        images: created.image_url ? [created.image_url] : ["/placeholder.svg"],
        available: created.is_available ?? formData.available,
        prepTimeMin: created.prep_time_min ?? formData.prep_time_min,
        prepTimeMax: created.prep_time_max ?? formData.prep_time_max,
        serves: created.serves,
        spiceLevel: created.spice_level,
        quantity: created.quantity,
        quantityUnit: created.quantity_unit,
        tags: created.tags || [],
        dietaryInfo: created.dietary_info || [],
        displayOrder: created.display_order ?? formData.display_order,
        businessId: user.id,
      }
      setProducts(prev => [newProduct, ...prev])
      setIsAddDialogOpen(false)
      resetForm()
      toast.success("Product added successfully")
    } catch (err) {
      showError(err)
    } finally {
      // Bug fix: was setIsSubmitting(true) — button would stay locked on error
      setIsSubmitting(false)
    }
  }

  const handleEditProduct = async () => {
    if (!validateForm() || !selectedProduct) return

    setIsSubmitting(true)
    try {
      const updateData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        is_available: formData.available,
        image_url: formData.image_url,
        prep_time_min: formData.prep_time_min,
        prep_time_max: formData.prep_time_max,
        serves: formData.serves,
        spice_level: formData.spice_level > 0 ? formData.spice_level : null,
        quantity: formData.quantity ? parseFloat(formData.quantity) : null,
        quantity_unit: formData.quantity_unit || null,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        dietary_info: formData.dietary_info.split(',').map(d => d.trim()).filter(Boolean),
        display_order: formData.display_order,
      }

      await fetchAPI(`/menu-items/${selectedProduct.id}`, {
        method: "PATCH",
        body: JSON.stringify(updateData),
      })

      setProducts(prev =>
        prev.map(p =>
          p.id === selectedProduct.id
            ? { 
                ...p, 
                name: formData.name, 
                description: formData.description, 
                price: parseFloat(formData.price), 
                category: formData.category, 
                available: formData.available,
                prepTimeMin: formData.prep_time_min,
                prepTimeMax: formData.prep_time_max,
                serves: formData.serves,
                spiceLevel: formData.spice_level,
                quantity: formData.quantity ? parseFloat(formData.quantity) : p.quantity,
                quantityUnit: formData.quantity_unit,
                tags: updateData.tags,
                dietaryInfo: updateData.dietary_info,
                displayOrder: formData.display_order,
                images: formData.image_url ? [formData.image_url] : p.images 
              }
            : p
        )
      )
      setIsEditDialogOpen(false)
      setSelectedProduct(null)
      resetForm()
      toast.success("Product updated successfully")
    } catch (err) {
      showError(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return

    setIsSubmitting(true)
    try {
      await fetchAPI(`/menu-items/${selectedProduct.id}`, { method: "DELETE" })
      setProducts(prev => prev.filter(p => p.id !== selectedProduct.id))
      setIsDeleteDialogOpen(false)
      setSelectedProduct(null)
      toast.success("Product deleted successfully")
    } catch (err) {
      showError(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleAvailability = async (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (!product) return
    // Optimistic update
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, available: !p.available } : p))
    try {
      await fetchAPI(`/menu-items/${productId}/availability`, {
        method: "PATCH",
        body: JSON.stringify({ is_available: !product.available }),
      })
      toast.success("Availability updated")
    } catch (err) {
      // Revert
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, available: product.available } : p))
      showError(err)
    }
  }

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      prep_time_min: product.prepTimeMin,
      prep_time_max: product.prepTimeMax,
      serves: product.serves || 1,
      spice_level: product.spiceLevel || 0,
      quantity: product.quantity?.toString() || "",
      quantity_unit: product.quantityUnit || "",
      tags: product.tags?.join(', ') || "",
      dietary_info: product.dietaryInfo?.join(', ') || "",
      available: product.available,
      image_url: product.images[0] !== "/placeholder.svg" ? product.images[0] : "",
      display_order: product.displayOrder,
    })
    setFormErrors({})
    setImagePreview(product.images[0] !== "/placeholder.svg" ? product.images[0] : null)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteDialogOpen(true)
  }

  return (
    <ProtectedRoute requireBusiness>
      <BusinessLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Products</h1>
              <p className="text-muted-foreground mt-1">Manage your product listings</p>
            </div>
            <Button size="sm" onClick={() => { resetForm(); setIsAddDialogOpen(true) }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
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
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.available}</p>
                    <p className="text-xs text-muted-foreground">Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.unavailable}</p>
                    <p className="text-xs text-muted-foreground">Unavailable</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
            <div className="flex gap-2">
              {(["all", "available", "unavailable"] as const).map(filter => (
                <Button
                  key={filter}
                  variant={availabilityFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setAvailabilityFilter(filter)
                    setCurrentPage(1)
                  }}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <SkeletonGrid count={6} />
          ) : filteredProducts.length === 0 ? (
            <Card>
              <CardContent className="p-0">
                <EmptyProducts onAction={() => setIsAddDialogOpen(true)} />
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Desktop: paginated grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 hidden md:grid">
                {paginatedProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      <Badge
                        className={`absolute top-3 right-3 ${
                          product.available
                            ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        {product.available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(product)}>
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleAvailability(product.id)}>
                              {product.available ? "Mark Unavailable" : "Mark Available"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => openDeleteDialog(product)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md">
                          <Clock className="w-3 h-3" />
                          <span>{product.prepTimeMin}-{product.prepTimeMax} min</span>
                        </div>
                        {product.serves && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md">
                            <span className="font-medium">Serves {product.serves}</span>
                          </div>
                        )}
                        {product.spiceLevel && product.spiceLevel > 0 && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md">
                            <span>{"\uD83C\uDF36\uFE0F".repeat(product.spiceLevel)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(product)}>
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Mobile: infinite scroll grid */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {mobileProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      <Badge
                        className={`absolute top-3 right-3 ${
                          product.available
                            ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        {product.available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(product)}>
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleAvailability(product.id)}>
                              {product.available ? "Mark Unavailable" : "Mark Available"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => openDeleteDialog(product)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md">
                          <Clock className="w-3 h-3" />
                          <span>{product.prepTimeMin}-{product.prepTimeMax} min</span>
                        </div>
                        {product.serves && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md">
                            <span className="font-medium">Serves {product.serves}</span>
                          </div>
                        )}
                        {product.spiceLevel && product.spiceLevel > 0 && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md">
                            <span>{"\uD83C\uDF36\uFE0F".repeat(product.spiceLevel)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(product)}>
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Mobile scroll sentinel — detaches when no more items */}
              {mobileHasMore && (
                <div ref={mobileSentinelRef} className="h-4 w-full md:hidden" aria-hidden="true" />
              )}
              {!mobileHasMore && mobileProducts.length > 0 && (
                <p className="text-center text-sm text-muted-foreground py-4 md:hidden">
                  All {filteredProducts.length} products shown
                </p>
              )}

              {/* Desktop pagination — hidden on mobile */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredProducts.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                className="hidden md:flex"
              />
            </>
          )}
        </div>

        {/* Add Product Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Add a new product to your menu.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                />
                {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your product"
                  rows={3}
                />
                {formErrors.description && <p className="text-xs text-destructive">{formErrors.description}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                  />
                  {formErrors.price && <p className="text-xs text-destructive">{formErrors.price}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {MENU_CATEGORY_OPTIONS.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.category && <p className="text-xs text-destructive">{formErrors.category}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prep_time_min">Min Prep Time (min)</Label>
                  <Input
                    id="prep_time_min"
                    type="number"
                    value={formData.prep_time_min}
                    onChange={(e) => setFormData({ ...formData, prep_time_min: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prep_time_max">Max Prep Time (min)</Label>
                  <Input
                    id="prep_time_max"
                    type="number"
                    value={formData.prep_time_max}
                    onChange={(e) => setFormData({ ...formData, prep_time_max: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serves">Serves (No. of people)</Label>
                  <Input
                    id="serves"
                    type="number"
                    value={formData.serves}
                    onChange={(e) => setFormData({ ...formData, serves: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spice_level">Spice Level</Label>
                  <Select value={formData.spice_level.toString()} onValueChange={(value) => setFormData({ ...formData, spice_level: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SPICE_LEVELS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Portion Size (e.g. 500)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity_unit">Unit</Label>
                  <Select value={formData.quantity_unit} onValueChange={(value) => setFormData({ ...formData, quantity_unit: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {QUANTITY_UNIT_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g. popular, spicy, vegan"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietary_info">Dietary Info (comma separated)</Label>
                <Input
                  id="dietary_info"
                  value={formData.dietary_info}
                  onChange={(e) => setFormData({ ...formData, dietary_info: e.target.value })}
                  placeholder="e.g. Gluten Free, Nut Free"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => {
                    setFormData({ ...formData, image_url: e.target.value });
                    setImagePreview(e.target.value || null);
                  }}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  💡 Image upload coming soon. Please provide a direct image URL for now.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Switch
                    id="available"
                    checked={formData.available}
                    onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                  />
                  <Label htmlFor="available">Available for order</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    className="w-16 h-8 text-center"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                  />
                  <Label>Order</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct} disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Product"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update the product details below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Product Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
                {formErrors.description && <p className="text-xs text-destructive">{formErrors.description}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price ($) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                  {formErrors.price && <p className="text-xs text-destructive">{formErrors.price}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {MENU_CATEGORY_OPTIONS.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.category && <p className="text-xs text-destructive">{formErrors.category}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-prep_time_min">Min Prep Time (min)</Label>
                  <Input
                    id="edit-prep_time_min"
                    type="number"
                    value={formData.prep_time_min}
                    onChange={(e) => setFormData({ ...formData, prep_time_min: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-prep_time_max">Max Prep Time (min)</Label>
                  <Input
                    id="edit-prep_time_max"
                    type="number"
                    value={formData.prep_time_max}
                    onChange={(e) => setFormData({ ...formData, prep_time_max: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-serves">Serves (No. of people)</Label>
                  <Input
                    id="edit-serves"
                    type="number"
                    value={formData.serves}
                    onChange={(e) => setFormData({ ...formData, serves: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-spice_level">Spice Level</Label>
                  <Select value={formData.spice_level.toString()} onValueChange={(value) => setFormData({ ...formData, spice_level: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SPICE_LEVELS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-quantity">Portion Size (e.g. 500)</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-quantity_unit">Unit</Label>
                  <Select value={formData.quantity_unit} onValueChange={(value) => setFormData({ ...formData, quantity_unit: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {QUANTITY_UNIT_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                <Input
                  id="edit-tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-dietary_info">Dietary Info (comma separated)</Label>
                <Input
                  id="edit-dietary_info"
                  value={formData.dietary_info}
                  onChange={(e) => setFormData({ ...formData, dietary_info: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-image_url">Image URL</Label>
                <Input
                  id="edit-image_url"
                  value={formData.image_url}
                  onChange={(e) => {
                    setFormData({ ...formData, image_url: e.target.value });
                    setImagePreview(e.target.value || null);
                  }}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Switch
                    id="edit-available"
                    checked={formData.available}
                    onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                  />
                  <Label htmlFor="edit-available">Available for order</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    className="w-16 h-8 text-center"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                  />
                  <Label>Order</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleEditProduct} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteProduct} disabled={isSubmitting}>
                {isSubmitting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </BusinessLayout>
    </ProtectedRoute>
  )
}
