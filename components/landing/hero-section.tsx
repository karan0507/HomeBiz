"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  Clock,
  ChefHat,
  Star,
  MapPin,
  Utensils,
  Heart,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCachedCuisineTypes } from "@/lib/services/data.service";
import type { CuisineType } from "@/types/database";

const stats = [
  { value: "50+", label: "Home Chefs" },
  { value: "25+", label: "Cuisines" },
  { value: "4.9", label: "Avg Rating" },
  { value: "2K+", label: "Happy Customers" },
];

const quickCategories = [
  { emoji: "🍛", label: "Indian" },
  { emoji: "🍝", label: "Italian" },
  { emoji: "🥟", label: "Chinese" },
  { emoji: "🌮", label: "Mexican" },
  { emoji: "🍖", label: "Jamaican" },
  { emoji: "🥙", label: "Middle Eastern" },
];

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [cuisineTypes, setCuisineTypes] = useState<CuisineType[]>([]);
  const hasFetchedCuisines = useRef(false);

  // Fetch cuisine types once for quick category links
  useEffect(() => {
    if (hasFetchedCuisines.current) return;
    hasFetchedCuisines.current = true;
    getCachedCuisineTypes()
      .then(setCuisineTypes)
      .catch(() => setCuisineTypes([]));
  }, []);

  // Map quick category labels to UUIDs from fetched cuisine types
  const quickCategoriesWithIds = quickCategories.map(cat => {
    const match = cuisineTypes.find(ct =>
      ct.name.toLowerCase() === cat.label.toLowerCase() ||
      ct.slug?.toLowerCase() === cat.label.toLowerCase()
    );
    return {
      ...cat,
      id: match?.id || "", // Fallback to empty string if not found
    };
  }).filter(cat => cat.id); // Only show categories that have matching IDs

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      router.push(`/kitchens?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/kitchens");
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>No time to cook? We got you covered</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Home-Cooked Meals from{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-orange-600 bg-clip-text text-transparent">
                Toronto&apos;s Best
              </span>{" "}
              Home Chefs
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Skip the meal prep. Order authentic home-cooked food from your neighbourhood&apos;s talented home chefs. Real recipes, real flavours, ready for pickup.
            </motion.p>

            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onSubmit={handleSearch}
              className="mb-8 max-w-xl mx-auto lg:mx-0"
            >
              <div className="relative flex items-center bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-primary/10 border-2 border-primary/20 hover:border-primary/40 focus-within:border-primary focus-within:shadow-primary/20 transition-all p-1.5">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 ml-1">
                  <Search className="w-5 h-5 text-primary" />
                </div>
                <input
                  type="text"
                  placeholder="Search cuisines, dishes, or chefs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 h-11 px-4 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-10 px-5 rounded-xl  hover:opacity-90 transition-opacity gap-2 shadow-md"
                >
                  <span className="hidden sm:inline">Find Food</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.form>

            {/* Quick Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-10"
            >
              <p className="text-sm text-muted-foreground mb-3 font-bold">Popular cuisines:</p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {quickCategoriesWithIds.map((cat) => (
                  <Link key={cat.id} href={`/kitchens?cuisine=${cat.id}`}>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border hover:border-primary hover:bg-primary/5 transition-colors text-sm">
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </button>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-4 gap-4 max-w-lg mx-auto lg:mx-0"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold  bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="relative">
              <img
                src="/images/hero1.jpg"
                alt="Delicious Home-Cooked Food"
                className="w-full h-auto object-cover rounded-2xl"
                style={{
                  maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                  maskComposite: 'intersect',
                  WebkitMaskComposite: 'source-in'
                }}
              />
            </div>
          </motion.div>

          {/* Right Column - Visual Card (Commented) */}
          {/* <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-emerald-500/20 -rotate-3 scale-105" />

              <div className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg">
                    <ChefHat className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Featured Kitchen</h3>
                    <p className="text-muted-foreground text-sm">Ready for pickup</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">4.9</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {[
                    { name: "Butter Chicken", price: "$14.99", emoji: "🍛" },
                    { name: "Garlic Naan (3 pcs)", price: "$4.99", emoji: "🫓" },
                    { name: "Mango Lassi", price: "$3.99", emoji: "🥤" },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50">
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="flex-1 font-medium">{item.name}</span>
                      <span className="font-bold text-primary">{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Ready in 30-45 min</span>
                  </div>
                  <Button size="sm" className="gap-2 ">
                    Order Now
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute -top-4 -right-4 bg-white dark:bg-zinc-800 rounded-2xl p-4 shadow-xl border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">25+ Cuisines</p>
                    <p className="text-xs text-muted-foreground">to explore</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -bottom-4 -left-4 bg-white dark:bg-zinc-800 rounded-2xl p-4 shadow-xl border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">2K+ Happy</p>
                    <p className="text-xs text-muted-foreground">Customers</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div> */}
        </div>
      </div>
    </section>
  );
}
