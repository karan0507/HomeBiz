"use client"

import { motion } from "framer-motion"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Search,
  ShoppingCart,
  MapPin,
  Utensils,
  ChefHat,
  Star,
  Shield,
  Clock,
  ArrowRight,
} from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Browse Home Kitchens",
    description:
      "Explore our directory of verified home chefs in your Toronto neighbourhood. Filter by cuisine, dietary needs, or location.",
  },
  {
    icon: Utensils,
    title: "Choose Your Dishes",
    description:
      "Browse authentic home-cooked menus with photos, ingredients, and reviews. Add your favorites to your order.",
  },
  {
    icon: ShoppingCart,
    title: "Place Your Order",
    description:
      "Select a convenient pickup time. Pay directly to the chef via cash or e-Transfer - no middleman fees.",
  },
  {
    icon: MapPin,
    title: "Pick Up & Enjoy",
    description:
      "Collect your fresh, home-cooked meal from the chef's kitchen. Most pickups take less than 5 minutes!",
  },
]

const benefits = [
  {
    icon: ChefHat,
    title: "Authentic Recipes",
    description: "Family recipes passed down through generations",
  },
  {
    icon: Shield,
    title: "Verified Chefs",
    description: "All chefs have Food Handler Certificates",
  },
  {
    icon: Star,
    title: "Community Reviews",
    description: "Real ratings from real customers",
  },
  {
    icon: Clock,
    title: "Fresh & Made to Order",
    description: "No reheated food - everything is fresh",
  },
]

export default function HowItWorksPage() {
  return (
    <MainLayout>
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/30 to-background">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
                Simple & Easy
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                How <span className="text-gradient">HomeBiz</span> Works
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get authentic home-cooked meals from talented chefs in your
                neighbourhood in just 4 simple steps
              </p>
            </motion.div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center relative"
                  >
                    <div className="relative">
                      {/* Dotted line connector (hidden on mobile, shown on lg screens) */}
                      {index < steps.length - 1 && (
                        <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 border-t-2 border-dashed border-emerald-300 z-0" />
                      )}

                      <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-500 flex items-center justify-center mb-6 relative z-10">
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold z-10">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Why Choose Home-Cooked?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card p-6 rounded-2xl border"
                  >
                    <Icon className="w-10 h-10 text-emerald-600 mb-4" />
                    <h3 className="font-bold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to taste the difference?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of Torontonians enjoying authentic home-cooked meals
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/kitchens">
                <Button size="lg" className="gap-2">
                  Find Home Kitchens
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/business/signup">
                <Button size="lg" variant="outline" className="gap-2">
                  <ChefHat className="w-4 h-4" />
                  Become a Chef
                </Button>
              </Link>
            </div>
          </div>
        </section>
    </MainLayout>
  )
}
