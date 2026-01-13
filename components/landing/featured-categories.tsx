import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { mockCategories } from "@/lib/mock-data"
import { Utensils, Coffee, Heart, ShoppingBag, Briefcase, Home } from "lucide-react"

const iconMap: Record<string, any> = {
  utensils: Utensils,
  coffee: Coffee,
  heart: Heart,
  "shopping-bag": ShoppingBag,
  briefcase: Briefcase,
  home: Home,
}

export function FeaturedCategories() {
  const featuredCategories = mockCategories.filter((cat) => cat.featured)

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-balance">Browse by Category</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Explore businesses across various categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredCategories.map((category) => {
            const IconComponent = iconMap[category.icon] || Briefcase
            return (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.businessCount} businesses</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-8">
          <Link href="/categories" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
            View all categories
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
