import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockBusinesses } from "@/lib/mock-data"
import { MainLayout } from "@/components/layout/main-layout"
import { Star, MapPin, Clock, CheckCircle } from "lucide-react"

export default function BusinessesPage() {
  return (
    <MainLayout>
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 text-balance">
                All Businesses
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
                Browse through our directory of verified local businesses
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockBusinesses.map((business) => (
                <Card key={business.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={business.coverImage || "/placeholder.svg"}
                      alt={business.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {business.isVerified && (
                      <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">Verified</Badge>
                    )}
                  </div>

                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <Link href={`/kitchens/${business.slug}`}>
                          <h3 className="text-xl font-display font-semibold hover:text-primary transition-colors truncate">
                            {business.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-2">
                          {business.isVerified && (
                            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" aria-label="Verified" />
                          )}
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="font-semibold">{business.rating}</span>
                            <span className="text-sm text-muted-foreground">({business.reviewCount})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{business.description}</p>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        {business.neighborhood}, {business.city}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span>Open until {business.operatingHours.monday?.close || "9:00 PM"}</span>
                    </div>

                    <Link href={`/kitchens/${business.slug}`} className="block mt-4">
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                      >
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
    </MainLayout>
  )
}
