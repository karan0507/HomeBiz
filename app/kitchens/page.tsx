"use client";

import { useState, useMemo, Suspense, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  Star,
  MapPin,
  Clock,
  ChefHat,
  Heart,
  X,
  BadgeCheck,
  Grid3X3,
  List,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MainLayout } from "@/components/layout/main-layout";
import { useCart } from "@/lib/cart-context";
import { getKitchens } from "@/lib/services/kitchens.service";
import { getCachedCuisineTypes } from "@/lib/services/data.service";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import type { CuisineType, Kitchen, KitchenFilters } from "@/types/database";

const PER_PAGE = 12;

function KitchensContent() {
  const searchParams = useSearchParams();
  const initialCuisine = searchParams.get("cuisine") || "";
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCuisine, setSelectedCuisine] = useState(initialCuisine);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("rating");
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [maxDistance, setMaxDistance] = useState(10);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  // Infinite scroll state
  const [page, setPage] = useState(1);
  const [allKitchens, setAllKitchens] = useState<Kitchen[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stable filter snapshot — changes reset to page 1
  const filtersRef = useRef<KitchenFilters>({});

  const { isInWishlist, toggleWishlist, isHydrated } = useCart();

  const dietaryOptions = ["Vegetarian", "Vegan", "Halal", "Gluten-Free", "Dairy-Free"];
  const ratingOptions = [4.5, 4.0, 3.5, 3.0];

  // Fetch user location once
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
        },
        (err) => {
          console.warn("Geolocation error:", err.message);
          // Fallback: Continue without location (filters already handle null userLocation)
          setUserLocation(null);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      // No geolocation support: Continue without location
      setUserLocation(null);
    }
  }, []);

  // Fetch cuisine types once
  const [cuisineTypes, setCuisineTypes] = useState<CuisineType[]>([]);
  const [cuisinesLoading, setCuisinesLoading] = useState(true);
  const hasFetchedCuisines = useRef(false);

  useEffect(() => {
    if (hasFetchedCuisines.current) return;
    hasFetchedCuisines.current = true;
    getCachedCuisineTypes()
      .then(setCuisineTypes)
      .catch(() => setCuisineTypes([]))
      .finally(() => setCuisinesLoading(false));
  }, []);

  // Build current filter object (stable for the current render)
  // Only send radius + lat/lon when geolocation succeeded — sending radius without
  // coordinates causes the backend search_kitchens RPC to throw a 500 error.
  const currentFilters = useMemo<KitchenFilters>(() => ({
    query: searchQuery || undefined,
    cuisines: selectedCuisine ? [selectedCuisine] : undefined,
    dietary: selectedDietary.length > 0 ? selectedDietary : undefined,
    min_rating: minRating > 0 ? minRating : undefined,
    ...(userLocation
      ? { lat: userLocation.lat, lon: userLocation.lon, radius: maxDistance }
      : {}),
    sort: sortBy === "rating" ? "rating" : sortBy === "orders" ? "orders" : undefined,
    per_page: PER_PAGE,
  }), [searchQuery, selectedCuisine, selectedDietary, minRating, userLocation, maxDistance, sortBy]);

  // When filters change → reset to page 1 and clear accumulated list
  const prevFiltersKey = useRef("");
  const filtersKey = useMemo(() => JSON.stringify(currentFilters), [currentFilters]);

  useEffect(() => {
    if (filtersKey === prevFiltersKey.current) return;
    prevFiltersKey.current = filtersKey;
    filtersRef.current = currentFilters;
    setPage(1);
    setAllKitchens([]);
    setHasMore(true);
  }, [filtersKey, currentFilters]);

  // Fetch a single page — append or replace based on page number
  const fetchPage = useCallback(async (pageNum: number, signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const filters: KitchenFilters = { ...filtersRef.current, page: pageNum };
      const data = await getKitchens(filters, signal);

      if (signal?.aborted) return;

      // Apply client-side price filter + name sort (server handles rating/orders sort)
      let result = [...data];
      if (priceRange[0] > 0 || priceRange[1] < 50) {
        result = result.filter((k) => {
          const min = k.minimum_order || k.minimumOrder || 0;
          return min >= priceRange[0] && min <= priceRange[1];
        });
      }
      if (sortBy === "name") {
        result.sort((a, b) => a.name.localeCompare(b.name));
      }

      if (pageNum === 1) {
        setAllKitchens(result);
      } else {
        setAllKitchens((prev) => {
          // Deduplicate by id (safety net)
          const existingIds = new Set(prev.map((k) => k.id));
          const newItems = result.filter((k) => !existingIds.has(k.id));
          return [...prev, ...newItems];
        });
      }

      // If we got fewer than PER_PAGE — no more pages
      setHasMore(data.length === PER_PAGE);
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setError("Error loading kitchens. Please try again.");
      setHasMore(false);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [priceRange, sortBy]); // These are client-side only — safe to keep

  // Trigger fetch whenever page or filter-reset changes
  useEffect(() => {
    const controller = new AbortController();
    fetchPage(page, controller.signal);
    return () => controller.abort();
  }, [page, filtersKey]); // filtersKey change resets page → triggers this too

  // Infinite scroll sentinel — mobile only (md+ uses native scrolling in desktop layout)
  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: loading,
    onLoadMore: () => setPage((p) => p + 1),
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCuisine("");
    setSelectedDietary([]);
    setSortBy("rating");
    setMinRating(0);
    setPriceRange([0, 50]);
    setMaxDistance(10);
  };

  const hasFilters = searchQuery || selectedCuisine || selectedDietary.length > 0 || minRating > 0 || priceRange[0] > 0 || priceRange[1] < 50;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Find Home Kitchens</h1>
          <p className="text-muted-foreground mt-1">
            {loading && page === 1
              ? "Loading..."
              : `${allKitchens.length} home chefs ready to cook for you in Toronto`}
          </p>
          {error && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search cuisines, dishes, or neighbourhoods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-foreground"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* View Toggle (Desktop only) */}
          <div className="hidden md:flex border rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-2.5 py-1.5 ${viewMode === "grid" ? "bg-primary text-white" : "bg-background hover:bg-muted"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-2.5 py-1.5 ${viewMode === "list" ? "bg-primary text-white" : "bg-background hover:bg-muted"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Filter Kitchens</SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-6 overflow-y-auto">
                <div>
                  <label className="text-sm font-medium mb-3 block">Cuisine Type</label>
                  <div className="flex flex-wrap gap-2">
                    {cuisinesLoading ? (
                      <div className="text-sm text-muted-foreground">Loading...</div>
                    ) : (
                      cuisineTypes.slice(0, 10).map((cat) => (
                        <Button
                          key={cat.id}
                          variant={selectedCuisine === cat.slug ? "default" : "outline"}
                          size="sm"
                          className="h-9"
                          onClick={() =>
                            setSelectedCuisine(selectedCuisine === cat.slug ? "" : cat.slug)
                          }
                        >
                          {cat.name}
                        </Button>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Dietary Options</label>
                  <div className="flex flex-wrap gap-2">
                    {dietaryOptions.map((option) => (
                      <Button
                        key={option}
                        variant={selectedDietary.includes(option) ? "default" : "outline"}
                        size="sm"
                        className="h-9"
                        onClick={() =>
                          setSelectedDietary((prev) =>
                            prev.includes(option)
                              ? prev.filter((d) => d !== option)
                              : [...prev, option]
                          )
                        }
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Minimum Rating</label>
                  <div className="flex flex-wrap gap-2">
                    {ratingOptions.map((rating) => (
                      <Button
                        key={rating}
                        variant={minRating === rating ? "default" : "outline"}
                        size="sm"
                        className="h-9 gap-1"
                        onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                      >
                        <Star className="w-3 h-3 fill-current" />
                        {rating}+
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Price Range (Min Order)</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground mb-1 block">Min ($)</label>
                      <Input
                        type="number"
                        min={0}
                        max={priceRange[1]}
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="h-9"
                      />
                    </div>
                    <span className="text-muted-foreground mt-4">-</span>
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground mb-1 block">Max ($)</label>
                      <Input
                        type="number"
                        min={priceRange[0]}
                        max={100}
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Distance (km)</label>
                  <div className="flex flex-wrap gap-2">
                    {[2, 5, 10, 15].map((dist) => (
                      <Button
                        key={dist}
                        variant={maxDistance === dist ? "default" : "outline"}
                        size="sm"
                        className="h-9"
                        onClick={() => setMaxDistance(dist)}
                      >
                        {dist} km
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Sort By</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "rating", label: "Top Rated" },
                      { value: "orders", label: "Most Popular" },
                      { value: "name", label: "Name A-Z" },
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant={sortBy === option.value ? "default" : "outline"}
                        size="sm"
                        className="h-9"
                        onClick={() => setSortBy(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" className="flex-1" onClick={clearFilters}>
                    Clear All
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-primary to-emerald-600"
                    onClick={() => setFilterOpen(false)}
                  >
                    Show {allKitchens.length} Results
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Quick Filters */}
        {!cuisinesLoading && cuisineTypes.length > 0 && (
          <div className="relative mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {cuisineTypes.slice(0, 8).map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCuisine === cat.slug ? "default" : "secondary"}
                  size="sm"
                  className={`shrink-0 h-8 gap-1 transition-all text-xs ${selectedCuisine === cat.slug ? "bg-gradient-to-r from-primary to-emerald-600 shadow-sm" : "hover:bg-muted"}`}
                  onClick={() => setSelectedCuisine(selectedCuisine === cat.slug ? "" : cat.slug)}
                >
                  <span className="text-sm">{cat.icon}</span>
                  {cat.name}
                </Button>
              ))}
            </div>
            <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
          </div>
        )}

        {/* Active Filters */}
        {hasFilters && (
          <div className="flex items-center gap-2 mb-6 flex-wrap bg-muted/30 p-3 rounded-lg">
            <span className="text-sm text-muted-foreground font-medium">Filters:</span>
            {selectedCuisine && (
              <Badge variant="secondary" className="gap-1.5 h-7 pl-3 pr-2 bg-primary/10 text-primary border-primary/20">
                {selectedCuisine}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-destructive transition-colors" onClick={() => setSelectedCuisine("")} />
              </Badge>
            )}
            {selectedDietary.map((d) => (
              <Badge key={d} variant="secondary" className="gap-1.5 h-7 pl-3 pr-2 bg-accent/10 text-accent border-accent/20">
                {d}
                <X
                  className="w-3.5 h-3.5 cursor-pointer hover:text-destructive transition-colors"
                  onClick={() => setSelectedDietary((prev) => prev.filter((x) => x !== d))}
                />
              </Badge>
            ))}
            <button onClick={clearFilters} className="text-sm text-destructive hover:underline font-medium ml-auto">
              Clear all
            </button>
          </div>
        )}

        {/* Kitchen Grid/List */}
        {loading && page === 1 ? (
          // Initial skeleton
          <div className={viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            : "space-y-3"
          }>
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-32 bg-muted animate-pulse" />
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : allKitchens.length === 0 && !loading ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
              <ChefHat className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No kitchens found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
            <Button variant="outline" onClick={clearFilters}>Clear all filters</Button>
          </div>
        ) : (
          <div className={viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            : "space-y-3"
          }>
            {allKitchens.map((kitchen) =>
              viewMode === "grid" ? (
                // Grid View Card
                <Card key={kitchen.id} className="overflow-hidden group hover:shadow-lg transition-all hover:border-primary/50">
                  <Link href={`/kitchens/${kitchen.id}`}>
                    <div className="h-32 relative overflow-hidden">
                      {kitchen.cover_image_url ? (
                        <img
                          src={kitchen.cover_image_url}
                          alt={kitchen.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-emerald-500/10" />
                      )}

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white flex items-center justify-center shadow-lg relative border-2 border-background">
                          {kitchen.logo_url ? (
                            <img src={kitchen.logo_url} alt={kitchen.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary via-primary to-emerald-600 flex items-center justify-center">
                              <ChefHat className="w-8 h-8 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      {kitchen.isVerified && (
                        <Badge className="absolute top-3 left-3 bg-primary/90 text-white border-0 gap-1">
                          <BadgeCheck className="w-3 h-3" />
                          Verified
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(kitchen.id);
                        }}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isHydrated && isInWishlist(kitchen.id) ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {kitchen.name}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate mt-0.5">
                        {kitchen.cuisineTypes?.slice(0, 2).join(" • ") || ""}
                      </p>

                      <div className="flex items-center gap-3 mt-3 text-sm">
                        <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{kitchen.rating}</span>
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground text-xs">
                          <MapPin className="w-3 h-3" />
                          {kitchen.neighborhood}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <div className="flex gap-1">
                          {kitchen.dietaryOptions?.slice(0, 2).map((opt: string) => (
                            <Badge key={opt} variant="outline" className="text-[10px] h-5 px-1.5">
                              {opt}
                            </Badge>
                          ))}
                        </div>
                        <Badge
                          className={
                            kitchen.accepting_orders
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]"
                              : "bg-red-100 text-red-700 border-red-200 text-[10px]"
                          }
                        >
                          {kitchen.accepting_orders ? "Open" : "Closed"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ) : (
                // List View Card
                <Card key={kitchen.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <Link href={`/kitchens/${kitchen.id}`}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-emerald-500/10 flex items-center justify-center shrink-0 relative">
                          {kitchen.logo_url ? (
                            <img src={kitchen.logo_url} alt={kitchen.name} className="w-full h-full object-cover" />
                          ) : (
                            <ChefHat className="w-10 h-10 text-primary" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold truncate">{kitchen.name}</h3>
                                {kitchen.is_verified && (
                                  <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {kitchen.cuisineTypes?.slice(0, 3).join(" • ") || ""}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0"
                              onClick={(e) => {
                                e.preventDefault();
                                toggleWishlist(kitchen.id);
                              }}
                            >
                              <Heart
                                className={`w-4 h-4 ${
                                  isHydrated && isInWishlist(kitchen.id) ? "fill-red-500 text-red-500" : ""
                                }`}
                              />
                            </Button>
                          </div>

                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{kitchen.rating}</span>
                              <span className="text-muted-foreground">({kitchen.reviewCount})</span>
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="w-3.5 h-3.5" />
                              {kitchen.neighborhood}
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-3.5 h-3.5" />
                              {kitchen.preparation_time || kitchen.preparationTime}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            {kitchen.dietaryOptions?.slice(0, 3).map((opt: string) => (
                              <Badge key={opt} variant="outline" className="text-xs h-6">
                                {opt}
                              </Badge>
                            ))}
                            <Badge
                              className={`ml-auto ${
                                kitchen.accepting_orders
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {kitchen.accepting_orders ? "Open Now" : "Closed"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              )
            )}
          </div>
        )}

        {/* Infinite scroll sentinel (mobile) — hidden on md+ */}
        {hasMore && (
          <div ref={sentinelRef} className="h-4 w-full md:hidden" aria-hidden="true" />
        )}

        {/* Bottom spinner — loading next page (mobile) */}
        {loading && page > 1 && (
          <div className="flex justify-center py-6 md:hidden">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {/* End of results message (mobile) — only when explicitly no more data */}
        {!hasMore && allKitchens.length > 0 && (
          <p className="text-center text-sm text-muted-foreground py-6 md:hidden">
            You&apos;ve seen all {allKitchens.length} kitchens
          </p>
        )}
      </div>
    </MainLayout>
  );
}

export default function KitchensPage() {
  return (
    <Suspense
      fallback={
        <MainLayout>
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="animate-pulse space-y-6">
              <div className="h-10 bg-muted rounded w-64" />
              <div className="h-11 bg-muted rounded" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-64 bg-muted rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </MainLayout>
      }
    >
      <KitchensContent />
    </Suspense>
  );
}
