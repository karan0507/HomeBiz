"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCachedCuisineTypes } from "@/lib/services/data.service";
import type { CuisineType } from "@/types/database";

const cuisineImages: Record<string, string> = {
  "south-indian":
    "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&q=80&w=400",
  italian:
    "https://images.unsplash.com/photo-1498579150354-977475b7e8b2?auto=format&fit=crop&q=80&w=400",
  jamaican:
    "https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&q=80&w=400",
  chinese:
    "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=400",
  halal:
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=400",
  "middle-eastern":
    "https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&q=80&w=400",
  ethiopian:
    "https://images.unsplash.com/photo-1614917646191-235da1713e28?auto=format&fit=crop&q=80&w=400",
  mexican:
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400",
  greek:
    "https://images.unsplash.com/photo-1529312266912-b33cfce2eefd?auto=format&fit=crop&q=80&w=400",
  thai: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&q=80&w=400",
  japanese:
    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400",
  korean:
    "https://images.unsplash.com/photo-1580651315530-69c8e0026377?auto=format&fit=crop&q=80&w=400",
  vietnamese:
    "https://images.unsplash.com/photo-1582878826629-29b7ad1cb438?auto=format&fit=crop&q=80&w=400",
  filipino:
    "https://images.unsplash.com/photo-1603501726715-998845fc867a?auto=format&fit=crop&q=80&w=400",
  lebanese:
    "https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&q=80&w=400",
  african:
    "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=400",
  default:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400",
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
    <section className="py-20 md:py-28 bg-white border-t border-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
        >
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-sm font-semibold mb-4 tracking-wide uppercase">
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                World Flavours
              </span>
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Explore{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                your cuisine today
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-xl leading-relaxed">
              From South Indian dosas to Italian pasta - discover authentic
              dishes from talented home chefs across Toronto.
            </p>
          </div>
          <Link href="/kitchens" className="mt-8 md:mt-0">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-white text-primary border-primary hover:bg-white"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-[2rem] bg-muted animate-pulse border border-muted-foreground/10"
              />
            ))}
          </div>
        ) : cuisineTypes.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-[2rem] border border-muted/50">
            <Utensils className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              Coming Soon
            </h3>
            <p className="text-muted-foreground">
              New cuisines will be available soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {cuisineTypes.map((ct, index) => {
              const bgUrl = cuisineImages[ct.slug] || cuisineImages["default"];
              return (
                <motion.div
                  key={ct.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link
                    href={`/kitchens?cuisine=${ct.slug}`}
                    className="block h-full"
                  >
                    <div className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
                      {/* Background Image */}
                      <Image
                        src={bgUrl}
                        alt={`${ct.name} cuisine`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-colors duration-300" />

                      {/* Content */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <h3 className="font-bold text-xl md:text-2xl text-white group-hover:text-primary-foreground transition-colors mb-2">
                          {ct.name}
                        </h3>

                        <div className="flex items-center text-white/80 text-sm font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                          <span>Explore menu</span>
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
