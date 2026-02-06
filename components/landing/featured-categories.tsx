/**
 * Featured Cuisines Section for HomeBiz Toronto Landing Page
 * "Explore Cuisines"
 *
 * Features:
 * - Grid of cuisine category cards
 * - Country flags as visual identifiers
 * - Animated hover effects
 * - Kitchen count per category
 */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockCategories as categories } from "@/lib/mock-data";

// Cuisine emoji/flag mapping
const cuisineEmojis: Record<string, string> = {
  "south-indian": "🇮🇳",
  "italian": "🇮🇹",
  "jamaican": "🇯🇲",
  "chinese": "🇨🇳",
  "halal": "☪️",
  "middle-eastern": "🥙",
  "ethiopian": "🇪🇹",
  "mexican": "🇲🇽",
  "greek": "🇬🇷",
  "thai": "🇹🇭",
  "japanese": "🇯🇵",
  "korean": "🇰🇷",
  "vietnamese": "🇻🇳",
  "filipino": "🇵🇭",
  "lebanese": "🇱🇧",
  "african": "🌍",
};

export function FeaturedCategories() {
  // Get featured categories (limit to 8 for clean layout)
  const featuredCategories = categories.filter((cat) => cat.featured).slice(0, 8);

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-secondary/20">
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
              World Flavours
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Explore <span className="text-gradient">Cuisines</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl">
              From South Indian dosas to Italian pasta - discover 25+ cuisines
              from talented home chefs across Toronto.
            </p>
          </div>
          <Link href="/categories" className="mt-6 md:mt-0">
            <Button variant="outline" className="gap-2 group">
              All Cuisines
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featuredCategories.map((category, index) => {
            const emoji = cuisineEmojis[category.slug] || "🍽️";

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link href={`/kitchens?cuisine=${category.slug}`}>
                  <div className="group p-6 rounded-3xl glass hover-lift cursor-pointer text-center">
                    {/* Emoji */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-3xl"
                    >
                      {emoji}
                    </motion.div>

                    {/* Category Name */}
                    <h3 className="font-bold text-lg group-hover:text-gradient transition-all mb-1">
                      {category.name}
                    </h3>

                    {/* Kitchen Count */}
                    <p className="text-sm text-muted-foreground">
                      {category.kitchenCount || Math.floor(Math.random() * 15) + 5} kitchens
                    </p>

                    {/* Decorative Line */}
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "2rem" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
                      className="h-1 mx-auto mt-4 rounded-full gradient-emerald-lime"
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Popular Dietary Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Looking for specific dietary options?
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {["Vegetarian", "Vegan", "Halal", "Gluten-Free", "Keto"].map((diet) => (
              <Link
                key={diet}
                href={`/kitchens?dietary=${diet.toLowerCase()}`}
                className="px-4 py-2 rounded-full glass hover:bg-primary/10 transition-colors text-sm font-medium"
              >
                {diet}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
