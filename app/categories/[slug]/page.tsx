"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockBusinesses, mockCategories } from "@/lib/mock-data"
import {
  Star,
  MapPin,
  Clock,
  ChefHat,
  ArrowLeft,
  Heart,
  BadgeCheck,
} from "lucide-react"

export default function CategoryDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const category = mockCategories.find((c) => c.slug === slug)

  // Filter kitchens by category
  const kitchens = mockBusinesses.filter((k) =>
    k.categoryId === category?.id ||
    k.cuisineTypes.some((c) =>
      c.toLowerCase().includes(category?.name.toLowerCase() || "")
    )
  )

  if (!category) {
    return (
      <MainLayout>
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="text-center">
            <ChefHat className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The category you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link href="/categories">
              <Button>Browse All Categories</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-secondary/30 to-background">
          <div className="container mx-auto px-4">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              All Categories
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                <span className="text-gradient">{category.name}</span> Kitchens
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {category.description}
              </p>
              <p className="text-emerald-600 font-medium mt-4">
                {kitchens.length} kitchens available
              </p>
            </motion.div>
          </div>
        </section>

        {/* Kitchens Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {kitchens.map((kitchen, index) => (
                <motion.div
                  key={kitchen.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/kitchens/${kitchen.slug}`}>
                    <div className="group bg-card rounded-3xl overflow-hidden border hover:shadow-lg transition-all">
                      {/* Image */}
                      <div className="relative aspect-[4/3] bg-gradient-to-br from-emerald-100 to-lime-100 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-white/80 mx-auto flex items-center justify-center mb-2">
                            <ChefHat className="w-8 h-8 text-emerald-600" />
                          </div>
                          <span className="text-sm font-medium text-emerald-700/70">
                            {kitchen.cuisineTypes[0]}
                          </span>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          {kitchen.isVerified && (
                            <Badge className="bg-emerald-500 text-white border-0 gap-1">
                              <BadgeCheck className="w-3 h-3" />
                              Verified
                            </Badge>
                          )}
                        </div>

                        {/* Wishlist */}
                        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-bold text-lg group-hover:text-emerald-600 transition-colors">
                          {kitchen.name}
                        </h3>

                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{kitchen.neighborhood}</span>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{kitchen.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({kitchen.reviewCount} reviews)
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {kitchen.tagline}
                        </p>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <span className="text-sm text-muted-foreground">
                            Min ${kitchen.minimumOrder}
                          </span>
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="w-4 h-4 text-emerald-500" />
                            <span
                              className={
                                kitchen.acceptingOrders
                                  ? "text-emerald-600"
                                  : "text-muted-foreground"
                              }
                            >
                              {kitchen.acceptingOrders ? "Open" : "Closed"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {kitchens.length === 0 && (
              <div className="text-center py-16">
                <ChefHat className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No kitchens found</h3>
                <p className="text-muted-foreground mb-4">
                  No kitchens available in this category yet
                </p>
                <Link href="/kitchens">
                  <Button>Browse All Kitchens</Button>
                </Link>
              </div>
            )}
          </div>
        </section>
    </MainLayout>
  )
}
