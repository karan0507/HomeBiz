"use client"

import { motion } from "framer-motion"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Check, ChefHat, Users, ArrowRight } from "lucide-react"

const customerPlan = {
  name: "For Food Lovers",
  price: "FREE",
  description: "First 25 customers get lifetime free access",
  features: [
    "Browse all home kitchens",
    "View menus and photos",
    "Read reviews and ratings",
    "Place unlimited orders",
    "Direct contact with chefs",
    "No platform fees",
  ],
}

const chefPlans = [
  {
    name: "Starter",
    price: "FREE",
    period: "for first 25 chefs",
    description: "Everything you need to start",
    features: [
      "Create your kitchen profile",
      "List unlimited menu items",
      "Receive orders",
      "Customer reviews",
      "Basic analytics",
      "Keep 100% of earnings",
    ],
    cta: "Start Cooking",
    popular: true,
  },
  {
    name: "Pro",
    price: "$5",
    period: "/month",
    description: "For established home chefs",
    features: [
      "Everything in Starter",
      "Featured placement",
      "Priority support",
      "Advanced analytics",
      "Promotional tools",
      "Keep 100% of earnings",
    ],
    cta: "Go Pro",
    popular: false,
  },
]

export default function PricingPage() {
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
                Simple Pricing
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Fair Pricing for <span className="text-gradient">Everyone</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                No hidden fees. No commission on sales. Home chefs keep 100% of
                what they earn.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Customer Pricing */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <Users className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold">For Customers</h2>
            </div>

            <Card className="max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {customerPlan.name}
                  <Badge className="bg-emerald-100 text-emerald-700">
                    Limited Offer
                  </Badge>
                </CardTitle>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-bold">{customerPlan.price}</span>
                  <span className="text-muted-foreground">forever</span>
                </div>
                <p className="text-muted-foreground">{customerPlan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {customerPlan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-emerald-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/kitchens" className="block mt-6">
                  <Button className="w-full gap-2">
                    Start Ordering
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Chef Pricing */}
        <section className="py-12 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <ChefHat className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold">For Home Chefs</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
              {chefPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={plan.popular ? "border-emerald-500 border-2" : ""}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{plan.name}</CardTitle>
                        {plan.popular && (
                          <Badge className="bg-emerald-500 text-white">
                            Most Popular
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground">
                          {plan.period}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{plan.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-emerald-600" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Link href="/business/signup" className="block mt-6">
                        <Button
                          className="w-full"
                          variant={plan.popular ? "default" : "outline"}
                        >
                          {plan.cta}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ CTA */}
        <section className="py-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground mb-4">Have questions?</p>
            <Link href="/faq">
              <Button variant="outline">View FAQ</Button>
            </Link>
          </div>
        </section>
    </MainLayout>
  )
}
