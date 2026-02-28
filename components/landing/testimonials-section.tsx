/**
 * Testimonials Section for HomeBiz Toronto Landing Page
 * "What Our Community Says"
 *
 * Features:
 * - Animated testimonial cards
 * - Customer photos and ratings
 * - Auto-rotating carousel on mobile
 * - Glassmorphism design
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
const testimonials = [
  {
    id: "t1",
    name: "Sarah Jenkins",
    role: "Regular Customer",
    quote: "The best homemade food I've ever had in Toronto. It feels like my mom's cooking!",
    rating: 5,
    location: "North York",
    kitchenOrdered: "Auntie's Kitchen",
  },
  {
    id: "t2",
    name: "Michael Chen",
    role: "Local Foodie",
    quote: "Finding authentic Sichuan food was hard until I joined HomeBiz. Simply amazing.",
    rating: 5,
    location: "Scarborough",
    kitchenOrdered: "Chef Wang's Spices",
  },
  {
    id: "t3",
    name: "Priya Sharma",
    role: "Working Professional",
    quote: "Perfect for my busy weeknights. Healthy, delicious, and supporting local chefs.",
    rating: 5,
    location: "Downtown",
    kitchenOrdered: "Priya's Home Tiffin",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass-emerald text-primary text-sm font-medium mb-4">
            Community Love
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            What Our <span className="text-gradient">Community</span> Says
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real stories from real people - customers and chefs sharing their
            HomeBiz experiences.
          </p>
        </motion.div>

        {/* Desktop: Grid Layout */}
        <div className="hidden lg:grid grid-cols-3 gap-4">
          {testimonials.slice(0, 6).map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* Mobile/Tablet: Carousel */}
        <div className="lg:hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <TestimonialCard
                testimonial={testimonials[currentIndex]}
                index={0}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.slice(0, 6).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-6 bg-primary"
                      : "bg-primary/30"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Testimonial Card Component
 */
function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <div className="h-full flex flex-col p-4 md:p-5 rounded-2xl glass hover-lift">
        {/* Header Row - Quote Icon + Rating */}
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary flex items-center justify-center">
            <Quote className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 md:w-3.5 md:h-3.5 ${
                  i < testimonial.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Quote - smaller text, limited lines */}
        <p className="text-sm text-foreground/90 leading-relaxed mb-4 line-clamp-4 flex-1">
          &quot;{testimonial.quote}&quot;
        </p>

        {/* Author - compact */}
        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate">{testimonial.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {testimonial.role} {testimonial.location && `• ${testimonial.location}`}
            </p>
          </div>
        </div>

        {/* Featured Kitchen Tag - fixed at bottom */}
        {testimonial.kitchenOrdered && (
          <div className="mt-3 px-2.5 py-1 rounded-full bg-secondary text-xs text-center truncate">
            Ordered from <span className="font-medium">{testimonial.kitchenOrdered}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
