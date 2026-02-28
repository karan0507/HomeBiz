/**
 * Benefits Section for HomeBiz Toronto Landing Page
 * "Why Choose HomeBiz?"
 *
 * Features:
 * - 4-column grid layout showcasing key benefits
 * - Animated icons with Framer Motion
 * - Glassmorphism card design
 * - Responsive layout (stacks on mobile)
 */

"use client";

import { motion } from "framer-motion";
import { Heart, Users, Globe, Shield, ChefHat } from "lucide-react";
const benefits = [
  {
    title: "Made with Love",
    description: "Every meal is prepared by home chefs using traditional recipes and fresh, local ingredients.",
    icon: "Heart",
  },
  {
    title: "Built for Community",
    description: "Support your neighbors and discover the diverse culinary talents right in your community.",
    icon: "Users",
  },
  {
    title: "Authentic Flavors",
    description: "Experience genuine tastes from around the world, cooked exactly how they were meant to be.",
    icon: "Globe",
  },
  {
    title: "Safe and Trusted",
    description: "All our chefs are verified and maintain strict food safety standards for your peace of mind.",
    icon: "Shield",
  },
];

// Icon mapping for dynamic rendering
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  Users,
  Globe,
  Shield,
  ChefHat,
};

export function BenefitsSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/20">
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
            Why HomeBiz?
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            More Than Just{" "}
            <span className="text-gradient">Food Delivery</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with talented home chefs in your neighbourhood and experience
            authentic home-cooked meals made with love and tradition.
          </p>
        </motion.div>

        {/* Benefits Grid - 4 Columns */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = iconMap[benefit.icon] || ChefHat;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="group h-full p-6 rounded-3xl glass hover-lift cursor-pointer">
                  {/* Icon Container */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="w-16 h-16 rounded-2xl gradient-emerald-lime flex items-center justify-center mb-6 shadow-emerald"
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-gradient transition-all">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>

                  {/* Decorative Element */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "3rem" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="h-1 mt-6 rounded-full gradient-emerald-lime"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            Ready to taste the difference?{" "}
            <a
              href="/kitchens"
              className="text-primary hover:text-primary/80 font-semibold underline underline-offset-4"
            >
              Browse home kitchens near you
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
