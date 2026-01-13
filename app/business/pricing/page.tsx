"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { BusinessSidebar } from "@/components/business/business-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

export default function BusinessPricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Basic listing for small businesses",
      features: [
        "Basic business listing",
        "Up to 5 photos",
        "Contact information",
        "Opening hours",
        "3 product listings",
      ],
      current: false,
    },
    {
      name: "Premium",
      price: "$29",
      description: "Enhanced visibility and features",
      features: [
        "Everything in Free",
        "Unlimited photos",
        "Priority placement",
        "Verified badge",
        "Unlimited products",
        "Analytics dashboard",
        "Customer reviews",
        "Event listings",
      ],
      current: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      description: "Full-featured solution for growing businesses",
      features: [
        "Everything in Premium",
        "Custom branding",
        "API access",
        "Dedicated support",
        "Multi-location support",
        "Advanced analytics",
        "Priority customer support",
        "Custom integrations",
      ],
      current: false,
    },
  ]

  return (
    <ProtectedRoute requireBusiness>
      <div className="flex min-h-screen bg-background">
        <BusinessSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-display font-bold">Pricing Plans</h1>
              <p className="text-muted-foreground mt-2">Choose the right plan for your business</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan.name} className={plan.current ? "border-primary shadow-lg" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle>{plan.name}</CardTitle>
                      {plan.current && <Badge>Current Plan</Badge>}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={plan.current ? "outline" : "default"} disabled={plan.current}>
                      {plan.current ? "Current Plan" : "Upgrade"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
