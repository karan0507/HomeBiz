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

// Cuisine emoji mapping
const cuisineEmojiMap: Record<string, string> = {
  "South Indian": "🇮🇳",
  "Tamil": "🇮🇳",
  "Italian": "🇮🇹",
  "Neapolitan": "🇮🇹",
  "Jamaican": "🇯🇲",
  "Caribbean": "🇯🇲",
  "Chinese": "🇨🇳",
  "Cantonese": "🇨🇳",
  "Halal": "☪️",
  "Middle Eastern": "🥙",
  "Lebanese": "🇱🇧",
  "Ethiopian": "🇪🇹",
  "African": "🌍",
  "Mexican": "🇲🇽",
  "Greek": "🇬🇷",
  "Thai": "🇹🇭",
  "Japanese": "🇯🇵",
  "Korean": "🇰🇷",
  "Vietnamese": "🇻🇳",
  "Filipino": "🇵🇭",
  "Indian": "🇮🇳",
};

function getCuisineEmoji(cuisine: string): string {
  return cuisineEmojiMap[cuisine] || "🍽️";
}

function KitchensContent() {
  const searchParams = useSearchParams();
  const initialCuisine = searchParams.get("cuisine") || "";
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(initialQuery);
  const [selectedCuisine, setSelectedCuisine] = useState(initialCuisine);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("rating");
  const [filterOpen, setFilterOpen] = useState(false);
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

  // Search debouncer (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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
  // Map cuisine slug to ID, dietary names to IDs
  // Only send radius + lat/lon when geolocation succeeded — sending radius without
  // coordinates causes the backend search_kitchens RPC to throw a 500 error.
  const currentFilters = useMemo<KitchenFilters>(() => {
    // Find cuisine ID from slug
    const cuisineId = selectedCuisine
      ? cuisineTypes.find(c => c.slug === selectedCuisine)?.id
      : undefined;

    return {
      query: debouncedSearchQuery || undefined,
      cuisines: cuisineId ? [cuisineId] : undefined,
      dietary: selectedDietary.length > 0 ? selectedDietary : undefined,
      min_rating: minRating > 0 ? minRating : undefined,
      ...(userLocation
        ? { lat: userLocation.lat, lon: userLocation.lon, radius: maxDistance }
        : {}),
      sort: sortBy === "rating" ? "rating" : sortBy === "orders" ? "orders" : undefined,
      per_page: PER_PAGE,
    };
  }, [debouncedSearchQuery, selectedCuisine, selectedDietary, minRating, userLocation, maxDistance, sortBy, cuisineTypes]);

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
        {/* Header - Commented out */}
        {/*
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Find Home Kitchens</h1>
          <p className="text-muted-foreground mt-1">
            {loading && page === 1
              ? "Loading..."
              : `${allKitchens.length} home chefs ready to cook for you in Toronto`}
          </p>
        </div>
        */}
        {error && (
          <div className="mt-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Search - Commented out, using nav search instead */}
        {/*
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
        </div>
        */}

        {/* Quick Filters + Filter Button */}
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
              <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 shrink-0 h-8">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="hidden sm:inline">More Filters</span>
                    {hasFilters && (
                      <X
                        className="w-3.5 h-3.5 ml-1 hover:text-destructive transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          clearFilters();
                        }}
                      />
                    )}
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
            <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
          </div>
        )}

        {/* Active Filters - Removed as per requirements */}

        {/* Kitchen Grid - Grid View Only */}
        {loading && page === 1 ? (
          // Initial skeleton
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl glass overflow-hidden animate-pulse">
                <div className="h-48 bg-muted" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : allKitchens.length === 0 && !loading ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
              <ChefHat className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No kitchens found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
            <Button variant="outline" onClick={clearFilters}>Clear filters</Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {allKitchens.map((kitchen) => (
                // Grid View Card (matching landing page design)
                <Link key={kitchen.id} href={`/kitchens/${kitchen.id}`}>
                  <div className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    {/* Image Container */}
                    <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                      {/* Placeholder with cuisine emoji */}
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-700 shadow-lg mx-auto flex items-center justify-center mb-3">
                            <span className="text-5xl">{getCuisineEmoji(kitchen.cuisineTypes?.[0] || "")}</span>
                          </div>
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            {kitchen.cuisineTypes?.[0] || "Home Kitchen"}
                          </span>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {kitchen.is_verified && (
                          <Badge className="bg-blue-600 text-white border-0 text-xs gap-1 shadow-sm">
                            <BadgeCheck className="w-3 h-3" />
                            Verified
                          </Badge>
                        )}
                        {kitchen.is_featured && (
                          <Badge className="bg-amber-600 text-white border-0 text-xs shadow-sm">
                            Featured
                          </Badge>
                        )}
                        {kitchen.rating >= 4.8 && (
                          <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-xs shadow-sm">
                            ⭐ Top Rated
                          </Badge>
                        )}
                      </div>

                      {/* Open/Closed Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge className={kitchen.is_active ? "bg-green-600 text-white shadow-sm" : "bg-slate-500 text-white shadow-sm"}>
                          {kitchen.is_active ? "Open" : "Closed"}
                        </Badge>
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(kitchen.id);
                        }}
                        className="absolute top-14 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                        aria-label={isHydrated && isInWishlist(kitchen.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isHydrated && isInWishlist(kitchen.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"
                          }`}
                        />
                      </button>

                      {/* Pickup Only Badge */}
                      <div className="absolute bottom-4 left-4">
                        <Badge variant="secondary" className="bg-white/90 text-foreground gap-1 text-xs">
                          <MapPin className="w-3 h-3" />
                          Pickup Only
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Kitchen Name & Rating */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-lg md:text-xl line-clamp-1 group-hover:text-primary transition-colors">
                          {kitchen.name}
                        </h3>
                        <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-2.5 py-1 rounded-full shrink-0">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-semibold">{kitchen.rating}</span>
                        </div>
                      </div>

                      {/* Cuisine & Location */}
                      <div className="flex items-center gap-1.5 mt-2 text-sm md:text-base text-muted-foreground">
                        <span>{kitchen.cuisineTypes?.slice(0, 2).join(" • ") || ""}</span>
                        {kitchen.cuisineTypes && kitchen.cuisineTypes.length > 2 && (
                          <span className="text-xs text-muted-foreground">+{kitchen.cuisineTypes.length - 2}</span>
                        )}
                        <span>•</span>
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span>{kitchen.neighborhood}</span>
                      </div>

                      {/* Address */}
                      {kitchen.address && (
                        <div className="mt-1.5 text-sm text-muted-foreground line-clamp-1">
                          <span className="font-medium">📍</span> {kitchen.address}
                        </div>
                      )}

                      {/* Dietary Options */}
                      {kitchen.dietaryOptions && kitchen.dietaryOptions.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className="text-xs font-medium text-muted-foreground">Dietary:</span>
                          {kitchen.dietaryOptions.slice(0, 2).map((opt: string) => (
                            <Badge key={opt} variant="outline" className="text-xs h-6 px-2">
                              {opt}
                            </Badge>
                          ))}
                          {kitchen.dietaryOptions.length > 2 && (
                            <span className="text-xs text-muted-foreground">+{kitchen.dietaryOptions.length - 2}</span>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium text-muted-foreground">Min:</span>
                          <span className="text-sm font-semibold text-foreground">
                            ${kitchen.minimum_order || kitchen.minimumOrder || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {kitchen.prep_time_min}-{kitchen.prep_time_max} min
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
            ))}
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
