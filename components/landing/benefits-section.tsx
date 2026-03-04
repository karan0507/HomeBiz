/**
 * Benefits Section for HomeBiz Toronto Landing Page
 * "Why Choose HomeBiz?"
 *
 * Features:
 * - 4-column grid layout showcasing key benefits
 * - Animated interactions with Framer Motion
 * - Premium card design with deep orange accents and step numbers
 * - Responsive layout (stacks on mobile)
 */

"use client";

import { motion } from "framer-motion";
import { ChefHat, Users, Globe, ShieldCheck } from "lucide-react";

const benefits = [
  {
    step: "01",
    title: "Made with Love",
    description:
      "Every meal is prepared by home chefs using traditional recipes and fresh, local ingredients.",
    icon: ChefHat,
    accent: "from-primary to-accent",
  },
  {
    step: "02",
    title: "Built for Community",
    description:
      "Support your neighbors and discover the diverse culinary talents right in your community.",
    icon: Users,
    accent: "from-primary to-accent",
  },
  {
    step: "03",
    title: "Authentic Flavors",
    description:
      "Experience genuine tastes from around the world, cooked exactly how they were meant to be.",
    icon: Globe,
    accent: "from-accent to-primary",
  },
  {
    step: "04",
    title: "Safe and Trusted",
    description:
      "All our chefs are verified and maintain strict food safety standards for your peace of mind.",
    icon: ShieldCheck,
    accent: "from-primary to-primary",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-20 md:py-28 bg-primary/5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-sm font-semibold tracking-wide mb-6 uppercase">
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Why HomeBiz?
            </span>
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            More Than Just <br className="md:hidden" />
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Food Delivery
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Connect with talented home chefs in your neighbourhood and
            experience authentic home-cooked meals made with love and tradition.
          </p>
        </motion.div>

        {/* Benefits Grid - 4 Columns */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => {
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="group h-full p-8 rounded-[2rem] bg-white border-2 border-primary/20 shadow-xl shadow-soft hover:shadow-2xl hover:shadow-soft-lg hover:border-primary/40 transition-all duration-300 relative overflow-hidden text-center">
                  {/* Step Number
                  <div className="absolute top-6 right-6 text-5xl font-black text-primary/10 group-hover:text-primary/20 transition-colors duration-300 leading-none select-none">
                    {benefit.step}
                  </div> */}

                  {/* Icon Container — centered at top */}
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.accent} flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  >
                    <benefit.icon className="w-7 h-7 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {benefit.description}
                  </p>
                  {/* Decorative Element */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "3rem" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="h-1 mt-6 rounded-full gradient-warm"
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
          className="text-center mt-16"
        >
          <p className="text-lg text-muted-foreground">
            Ready to taste the difference?{" "}
            <a
              href="/kitchens"
              className="text-primary hover:text-primary/80 font-bold underline underline-offset-4 decoration-2 transition-colors"
            >
              Browse home kitchens near you
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
