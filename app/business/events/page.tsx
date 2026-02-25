"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { BusinessLayout } from "@/components/business/business-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Clock, MapPin, MoreVertical } from "lucide-react"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SkeletonGrid } from "@/components/shared/skeleton-cards"
import { EmptyEvents } from "@/components/shared/empty-state"
import { Pagination } from "@/components/shared/pagination"
import { toast } from "sonner"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  image: string
}

export default function BusinessEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Pagination
  const totalPages = Math.ceil(events.length / itemsPerPage)
  const paginatedEvents = events.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId))
    toast.success("Event cancelled successfully")
  }

  return (
    <ProtectedRoute requireBusiness>
      <BusinessLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Events</h1>
              <p className="text-muted-foreground mt-1">Manage your upcoming events</p>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>

          {/* Stats */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{events.length}</p>
                  <p className="text-xs text-muted-foreground">Upcoming Events</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Events Grid */}
          {loading ? (
            <SkeletonGrid count={3} />
          ) : events.length === 0 ? (
            <Card>
              <CardContent className="p-0">
                <EmptyEvents />
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                {paginatedEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Event</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              Cancel Event
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="w-full mt-4">
                        View Registrations
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={events.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </BusinessLayout>
    </ProtectedRoute>
  )
}
