"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { BusinessSidebar } from "@/components/business/business-sidebar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockServices } from "@/lib/mock-data"
import { Plus, MoreVertical, Clock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function BusinessServicesPage() {
  const businessServices = mockServices.filter((s) => s.businessId === "1")

  return (
    <ProtectedRoute requireBusiness>
      <div className="flex min-h-screen bg-background">
        <BusinessSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-display font-bold">Services</h1>
                <p className="text-muted-foreground mt-2">Manage your service offerings</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businessServices.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{service.name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{service.prepTime}</span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Service</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">${service.price}</span>
                      <Badge variant={service.available ? "default" : "secondary"}>
                        {service.available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      Manage Bookings
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
