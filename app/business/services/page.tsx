"use client"

import { useState, useEffect, useMemo } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { BusinessLayout } from "@/components/business/business-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
interface Service {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price: number;
  prepTime: string;
  available: boolean;
}

const demoServices: Service[] = [
  {
    id: "s1",
    businessId: "kitchen-1",
    name: "Standard Catering",
    description: "Full catering service for small events and gatherings.",
    price: 150.0,
    prepTime: "2-3 days",
    available: true,
  }
];

import { Plus, MoreVertical, Clock, Search, Wrench, CheckCircle, XCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SkeletonGrid } from "@/components/shared/skeleton-cards"
import { EmptyState } from "@/components/shared/empty-state"
import { Pagination } from "@/components/shared/pagination"
import { toast } from "sonner"

export default function BusinessServicesPage() {
  const [services, setServices] = useState<Service[]>(demoServices)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "unavailable">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Filter services
  const filteredServices = useMemo(() => {
    return services.filter((service: Service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && service.available) ||
        (availabilityFilter === "unavailable" && !service.available)
      return matchesSearch && matchesAvailability
    })
  }, [services, searchQuery, availabilityFilter])

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage)
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Stats
  const stats = useMemo(() => ({
    total: services.length,
    available: services.filter((s: Service) => s.available).length,
    unavailable: services.filter((s: Service) => !s.available).length,
  }), [services])

  const handleDeleteService = (serviceId: string) => {
    setServices(prev => prev.filter((s: Service) => s.id !== serviceId))
    toast.success("Service deleted successfully")
  }

  const handleToggleAvailability = (serviceId: string) => {
    setServices((prev: Service[]) =>
      prev.map((s: Service) =>
        s.id === serviceId ? { ...s, available: !s.available } : s
      )
    )
    toast.success("Service availability updated")
  }

  return (
    <ProtectedRoute requireBusiness>
      <BusinessLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Services</h1>
              <p className="text-muted-foreground mt-1">Manage your service offerings</p>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.available}</p>
                    <p className="text-xs text-muted-foreground">Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.unavailable}</p>
                    <p className="text-xs text-muted-foreground">Unavailable</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
            <div className="flex gap-2">
              {(["all", "available", "unavailable"] as const).map(filter => (
                <Button
                  key={filter}
                  variant={availabilityFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setAvailabilityFilter(filter)
                    setCurrentPage(1)
                  }}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          {loading ? (
            <SkeletonGrid count={3} />
          ) : paginatedServices.length === 0 ? (
            <Card>
              <CardContent className="p-0">
                <EmptyState
                  icon={Wrench}
                  title="No services yet"
                  description="Add your first service to start receiving bookings."
                />
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedServices.map((service: Service) => (
                  <Card key={service.id}>
                    <CardHeader className="pb-2">
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
                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Service</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleAvailability(service.id)}>
                              {service.available ? "Mark Unavailable" : "Mark Available"}
                            </DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteService(service.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">${service.price.toFixed(2)}</span>
                        <Badge
                          className={
                            service.available
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }
                        >
                          {service.available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Manage Bookings
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredServices.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </BusinessLayout>
    </ProtectedRoute>
  )
}
