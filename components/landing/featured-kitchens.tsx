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

import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getFeaturedKitchens, type Kitchen } from "@/lib/mock-data";

export function FeaturedKitchens() {
  const kitchens = getFeaturedKitchens();

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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {kitchens.slice(0, 6).map((kitchen, index) => (
            <KitchenCard key={kitchen.id} kitchen={kitchen} index={index} />
          ))}
        </div>

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

/**
 * Kitchen Card Component
 * Displays individual home kitchen with chef info
 */
function KitchenCard({ kitchen, index }: { kitchen: Kitchen; index: number }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Get cuisine emoji from first cuisine type
  const cuisineEmoji = cuisineEmojiMap[kitchen.cuisineTypes[0]] || "🍽️";

  // Format minimum order as price range indicator
  const priceRange = kitchen.minimumOrder >= 25 ? "$$" : kitchen.minimumOrder >= 15 ? "$" : "$";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/kitchens/${kitchen.slug}`}>
        <div className="group relative bg-card rounded-3xl overflow-hidden border border-border hover-lift">
          {/* Image Container */}
          <div className="relative aspect-[4/3] bg-secondary/50 overflow-hidden">
            {/* Placeholder with gradient and icon */}
            <div className="absolute inset-0 gradient-emerald-lime-subtle flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-white/80 mx-auto flex items-center justify-center mb-2">
                  <span className="text-4xl">{cuisineEmoji}</span>
                </div>
                <span className="text-sm font-medium text-emerald-700/70">
                  {kitchen.cuisineTypes[0]}
                </span>
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {kitchen.isVerified && (
                <Badge className="gradient-emerald-lime text-white border-0 gap-1">
                  <BadgeIcon className="w-3 h-3" />
                  Verified
                </Badge>
              )}
              {kitchen.rating >= 4.8 && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-0">
                  Top Rated
                </Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center"
              aria-label={isWishlisted ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isWishlisted ? "fill-red-500 text-red-500" : "text-foreground"
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
          <div className="p-6">
            {/* Kitchen Name */}
            <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {kitchen.name}
            </h3>

            {/* Cuisine Types & Location */}
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <ChefHat className="w-4 h-4" />
              <span>{kitchen.cuisineTypes.join(", ")}</span>
              <span className="text-border">•</span>
              <MapPin className="w-4 h-4" />
              <span>{kitchen.neighborhood}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(kitchen.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{kitchen.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({kitchen.reviewCount} reviews)
              </span>
            </div>

            {/* Short Description */}
            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
              {kitchen.tagline}
            </p>

            {/* Cuisine Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {kitchen.specialties.slice(0, 3).map((specialty) => (
                <span
                  key={specialty}
                  className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                >
                  {specialty}
                </span>
              ))}
            </div>

            {/* Footer - Price Range & Availability */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Min ${kitchen.minimumOrder} {priceRange}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span className={kitchen.acceptingOrders ? "text-primary font-medium" : "text-muted-foreground"}>
                  {kitchen.acceptingOrders ? "Accepting Orders" : "Currently Closed"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
