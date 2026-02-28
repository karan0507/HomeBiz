"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCachedCuisineTypes } from "@/lib/services/data.service";
import type { CuisineType } from "@/types/database";

const cuisineEmojis: Record<string, string> = {
  "south-indian": "🇮🇳", "italian": "🇮🇹", "jamaican": "🇯🇲", "chinese": "🇨🇳",
  "halal": "☪️", "middle-eastern": "🥙", "ethiopian": "🇪🇹", "mexican": "🇲🇽",
  "greek": "🇬🇷", "thai": "🇹🇭", "japanese": "🇯🇵", "korean": "🇰🇷",
  "vietnamese": "🇻🇳", "filipino": "🇵🇭", "lebanese": "🇱🇧", "african": "🌍",
};

export function FeaturedCategories() {
  const [cuisineTypes, setCuisineTypes] = useState<CuisineType[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    getCachedCuisineTypes()
      .then((types) => setCuisineTypes(types.slice(0, 12))) // Show first 12
      .catch(() => setCuisineTypes([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
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
              From South Indian dosas to Italian pasta - discover 25+ cuisines from talented home chefs across Toronto.
            </p>
          </div>
          <Link href="/kitchens" className="mt-6 md:mt-0">
            <Button variant="outline" className="gap-2 group">
              All Cuisines
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} className="p-6 rounded-3xl glass animate-pulse">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted" />
                <div className="h-4 bg-muted rounded mb-2 w-3/4 mx-auto" />
                <div className="h-3 bg-muted rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : cuisineTypes.length === 0 ? (
          <div className="text-center py-16">
            <Utensils className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground">New cuisines will be available soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {cuisineTypes.map((ct, index) => {
              const emoji = ct.icon || cuisineEmojis[ct.slug] || "🍽️";
              return (
                <motion.div
                  key={ct.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link href={`/kitchens?cuisines=${ct.id}`}>
                    <div className="group p-6 rounded-3xl glass hover-lift cursor-pointer text-center">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-3xl"
                      >
                        {emoji}
                      </motion.div>
                      <h3 className="font-bold text-lg group-hover:text-gradient transition-all mb-1">
                        {ct.name}
                      </h3>
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
        )}

        {/* TODO: Dietary options section - requires fetching dietary options and mapping to UUIDs */}
      </div>
    </section>
  );
}
