"use client"

import { motion } from "framer-motion"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChefHat, Quote, Star, ArrowRight } from "lucide-react"

const stories = [
  {
    name: "Lakshmi Venkatesh",
    kitchen: "Amma's Kitchen",
    location: "North York",
    cuisine: "South Indian",
    quote:
      "I've been cooking for my family for 30 years. HomeBiz helped me share my recipes with the whole neighbourhood. Now I'm making extra income doing what I love!",
    stats: { orders: "890+", rating: 4.9, reviews: 156 },
  },
  {
    name: "Maria Rossi",
    kitchen: "Nonna Maria's Table",
    location: "Little Italy",
    cuisine: "Italian",
    quote:
      "My grandmother's recipes were going to be forgotten. Now people line up for my lasagna! HomeBiz gave my family traditions new life.",
    stats: { orders: "560+", rating: 4.8, reviews: 98 },
  },
  {
    name: "Fatima Ahmed",
    kitchen: "Fatima's Halal Bites",
    location: "Lawrence Park",
    cuisine: "Pakistani",
    quote:
      "Finding halal home cooking was hard for families in my area. Now I provide that for them while earning income from home. It's a blessing!",
    stats: { orders: "440+", rating: 4.7, reviews: 84 },
  },
  {
    name: "Joyce Williams",
    kitchen: "Auntie Joyce's Jamaican",
    location: "Little Jamaica",
    cuisine: "Jamaican",
    quote:
      "My jerk chicken recipe is famous in my church. Now it's famous across Toronto! HomeBiz helped me build a real business from my passion.",
    stats: { orders: "670+", rating: 4.9, reviews: 127 },
  },
]

export default function SuccessStoriesPage() {
  return (
    <MainLayout>
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/30 to-background">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-4">
                Real Stories
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Chef <span className="text-gradient">Success Stories</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Meet the home chefs who turned their passion for cooking into
                thriving businesses
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stories */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {stories.map((story, index) => (
                <motion.div
                  key={story.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                          <ChefHat className="w-8 h-8 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{story.name}</h3>
                          <p className="text-orange-600 font-medium">
                            {story.kitchen}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {story.cuisine} • {story.location}
                          </p>
                        </div>
                      </div>

                      <div className="relative mb-6">
                        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-orange-100" />
                        <p className="text-muted-foreground italic pl-6">
                          &quot;{story.quote}&quot;
                        </p>
                      </div>

                      <div className="flex items-center gap-6 pt-4 border-t">
                        <div>
                          <p className="font-bold text-lg">{story.stats.orders}</p>
                          <p className="text-xs text-muted-foreground">Orders</p>
                        </div>
                        <div>
                          <p className="font-bold text-lg flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {story.stats.rating}
                          </p>
                          <p className="text-xs text-muted-foreground">Rating</p>
                        </div>
                        <div>
                          <p className="font-bold text-lg">{story.stats.reviews}</p>
                          <p className="text-xs text-muted-foreground">Reviews</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to write your success story?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join hundreds of home chefs who are sharing their culinary passion
              and earning income doing what they love
            </p>
            <Link href="/business/signup">
              <Button size="lg" className="gap-2">
                Start Your Journey
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
    </MainLayout>
  )
}
