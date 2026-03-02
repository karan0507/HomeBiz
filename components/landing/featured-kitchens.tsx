/**
 * Featured Kitchens Section for HomeBiz Toronto Landing Page
 * "Meet Our Home Chefs"
 *
 * Features:
 * - Kitchen cards with chef info and cuisine tags
 * - Star ratings and review counts
 * - Featured dish showcase
 * - Pickup-only indicator
 * - Responsive grid layout
 */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  Heart,
  ArrowRight,
  MapPin,
  Clock,
  ChefHat,
  Utensils,
  Badge as BadgeIcon,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFeaturedKitchens } from "@/hooks/useKitchens";
import type { Kitchen } from "@/lib/services/kitchens.service";
import { useCart } from "@/lib/cart-context";

export function FeaturedKitchens() {
  const { kitchens, loading, error } = useFeaturedKitchens(6);

  if (error && !loading) {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Utensils className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg font-medium">Unable to load kitchens right now.</p>
          <p className="text-sm text-muted-foreground mt-1">Please check back soon or <Link href="/kitchens" className="text-primary underline">browse all kitchens</Link>.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full glass-emerald text-primary text-sm font-medium mb-4">
              Meet Our Chefs
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Featured <span className="text-gradient">Home Kitchens</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl">
              Discover talented home chefs in your neighbourhood, each bringing
              authentic family recipes to your table.
            </p>
          </div>
          <Link href="/kitchens" className="mt-6 md:mt-0">
            <Button variant="outline" className="gap-2 group">
              View All Kitchens
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Kitchens Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1,2,3,4,5,6].map((i) => (
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
        ) : kitchens.length === 0 ? (
          <div className="text-center py-16">
            <ChefHat className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground">New home kitchens will be featured soon!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {kitchens.slice(0, 6).map((kitchen, index) => (
              <KitchenCard key={kitchen.id} kitchen={kitchen} index={index} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Are you a talented home cook?
          </p>
          <Link href="/business/signup">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-2"
            >
              <ChefHat className="w-5 h-5" />
              Start Your Home Kitchen
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

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

// Truncate text helper
function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return { text, truncated: false };
  return { text: text.slice(0, maxLength) + "...", truncated: true };
}

/**
 * Kitchen Card Component
 * Displays individual home kitchen with chef info
 */
function KitchenCard({ kitchen, index }: { kitchen: Kitchen; index: number }) {
  const { isInWishlist, toggleWishlist, isHydrated } = useCart();
  const isWishlisted = isHydrated && isInWishlist(kitchen.id);

  // Get cuisine emoji from first cuisine type
  const firstCuisine = kitchen.cuisineTypes?.[0] || "";
  const cuisineEmoji = cuisineEmojiMap[firstCuisine] || "🍽️";

  // Format minimum order as price range indicator
  const minOrder = kitchen.minimum_order || kitchen.minimumOrder || 0;
  const priceRange = minOrder >= 25 ? "$$" : minOrder >= 15 ? "$" : "$";

  // Get combined tags text
  const allTags = (kitchen.specialties || []).join(", ");
  const { text: displayTags, truncated: hasTruncatedTags } = truncateText(allTags, 40);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/kitchens/${kitchen.id}`}>
        <div className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          {/* Image Container */}
          <div className="relative aspect-[16/10] bg-muted overflow-hidden">
            {/* Placeholder with cuisine emoji */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-700 shadow-lg mx-auto flex items-center justify-center mb-3">
                  <span className="text-5xl">{cuisineEmoji}</span>
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
                  <BadgeIcon className="w-3 h-3" />
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
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(kitchen.id);
              }}
              className="absolute top-14 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-md flex items-center justify-center hover:scale-110 transition-transform"
              aria-label={isWishlisted ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"
                }`}
              />
            </motion.button>

            {/* Pickup Only Badge */}
            <div className="absolute bottom-4 left-4">
              <Badge variant="secondary" className="bg-white/90 text-foreground gap-1">
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
    </motion.div>
  );
}
