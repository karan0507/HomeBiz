"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { BusinessLayout } from "@/components/business/business-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { CardLoader } from "@/components/shared/table-loader"
import { EmptyGallery } from "@/components/shared/empty-state"
import { Pagination } from "@/components/shared/pagination"
import { toast } from "sonner"

export default function BusinessGalleryPage() {
  const [images, setImages] = useState([
    "/elegant-restaurant-interior.jpg",
    "/fine-dining-plate.png",
    "/wine-tasting.png",
    "/restaurant-exterior.jpg",
    "/chef-cooking.jpg",
    "/restaurant-bar.jpg",
  ])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Pagination
  const totalPages = Math.ceil(images.length / itemsPerPage)
  const paginatedImages = images.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleDeleteImage = (index: number) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index
    setImages(prev => prev.filter((_, i) => i !== actualIndex))
    toast.success("Photo deleted successfully")
  }

  return (
    <ProtectedRoute requireBusiness>
      <BusinessLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Photo Gallery</h1>
              <p className="text-muted-foreground mt-1">Showcase your business with photos</p>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Upload Photos
            </Button>
          </div>

          {/* Stats */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{images.length}</p>
                  <p className="text-xs text-muted-foreground">Total Photos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gallery Grid */}
          {loading ? (
            <CardLoader count={8} />
          ) : images.length === 0 ? (
            <Card>
              <CardContent className="p-0">
                <EmptyGallery />
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {paginatedImages.map((image, index) => (
                  <Card key={index} className="group overflow-hidden">
                    <CardContent className="p-0 relative aspect-square">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteImage(index)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={images.length}
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
