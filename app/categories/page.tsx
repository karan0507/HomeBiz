"use client";

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import { Utensils, Coffee, Heart, ShoppingBag, Briefcase, Home, type LucideIcon } from "lucide-react"
import { useCategories } from "@/hooks/useCategories"
import { KitchenCardSkeleton } from "@/components/ui/loading"
import { EmptyState, ErrorState } from "@/components/ui/empty-state"

const iconMap: Record<string, LucideIcon> = {
  utensils: Utensils,
  coffee: Coffee,
  heart: Heart,
  "shopping-bag": ShoppingBag,
  briefcase: Briefcase,
  home: Home,
}

export default function CategoriesPage() {
  const { categories, loading, error, refetch } = useCategories();

  return (
    <MainLayout>
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 text-balance">
              All Cuisine Categories
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
              Explore home kitchens across various cuisines and find exactly what you're craving
            </p>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <KitchenCardSkeleton key={i} />
              ))}
            </div>
          )}

          {error && (
            <ErrorState
              message={error.message}
              retry={refetch}
            />
          )}

          {!loading && !error && categories.length === 0 && (
            <EmptyState
              icon={Briefcase}
              title="No categories available"
              description="Check back soon for cuisine categories"
            />
          )}

          {!loading && !error && categories.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const IconComponent = iconMap[category.icon] || Briefcase
                return (
                  <Link key={category.id} href={`/categories/${category.slug}`}>
                    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                              {category.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
                              {category.description}
                            </p>
                            <p className="text-sm font-medium text-primary">
                              {category.kitchen_count} {category.kitchen_count === 1 ? 'kitchen' : 'kitchens'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  )
}
