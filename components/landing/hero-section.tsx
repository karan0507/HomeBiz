"use client"

import type React from "react"

import { useState } from "react"
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set("q", searchQuery)
    if (location) params.set("location", location)
    router.push(`/businesses?${params.toString()}`)
  }

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-balance mb-6">
            Discover Local Businesses Near You
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-pretty mb-8 leading-relaxed">
            Connect with trusted local businesses, explore services, and support your community
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3 bg-card p-3 rounded-lg shadow-lg border">
              <div className="flex-1 flex items-center gap-2 px-3 bg-background rounded-md border">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search businesses, services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                />
              </div>
              <div className="flex-1 flex items-center gap-2 px-3 bg-background rounded-md border">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                />
              </div>
              <Button type="submit" size="lg" className="md:w-auto w-full">
                Search
              </Button>
            </div>
          </form>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-xl mx-auto">
            <div>
              <div className="text-3xl md:text-4xl font-display font-bold text-primary">2,500+</div>
              <div className="text-sm text-muted-foreground mt-1">Businesses</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-display font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground mt-1">Reviews</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-display font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground mt-1">Categories</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
