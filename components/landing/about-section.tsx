"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  Users,
  Target,
  Lightbulb,
  ArrowRight,
  ChefHat,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const teamMembers = [
  {
    name: "Sarah Chen",
    role: "Founder & CEO",
    bio: "Former Uber Eats PM who saw how corporate food giants were hurting local communities",
  },
  {
    name: "Marcus Williams",
    role: "Head of Community",
    bio: "Toronto native passionate about connecting cultures through food",
  },
  {
    name: "Priya Sharma",
    role: "Chef Relations",
    bio: "Certified nutritionist helping home chefs succeed",
  },
];

const values = [
  {
    icon: Heart,
    title: "Community First",
    description: "We believe every neighbourhood deserves access to authentic, home-cooked food made with love.",
  },
  {
    icon: Users,
    title: "Empowering Chefs",
    description: "We help talented home cooks turn their passion into income while keeping 100% of their earnings.",
  },
  {
    icon: Target,
    title: "Quality & Safety",
    description: "All our chefs are certified and verified. We maintain the highest food safety standards.",
  },
  {
    icon: Lightbulb,
    title: "Cultural Connection",
    description: "Food is culture. We're preserving family recipes and traditions for future generations.",
  },
];

export function AboutSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Dark Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-900 to-black" />

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            About HomeBiz
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Our Story &{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
              Vision
            </span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            We started HomeBiz with a simple belief: the best food comes from home kitchens,
            cooked by passionate people who pour love into every dish.
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 items-center mb-20"
        >
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">The Journey</h3>
            <div className="space-y-4 text-zinc-400">
              <p>
                In 2024, during countless late-night study sessions and overtime work hours,
                our founders realized something was broken. They were surrounded by fast food
                and overpriced delivery apps, but what they really craved was a home-cooked meal.
              </p>
              <p>
                Meanwhile, talented home cooks across Toronto - grandmothers with secret recipes,
                newcomers wanting to share their culture, parents looking for flexible income -
                had no easy way to share their gifts with the community.
              </p>
              <p>
                HomeBiz was born to bridge this gap. We connect busy Torontonians with
                neighbourhood home chefs who cook authentic meals with the same love they&apos;d
                put into feeding their own families.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-emerald-500/30 rounded-3xl blur-xl" />
            <div className="relative bg-zinc-800/50 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                  <ChefHat className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Our Mission</h4>
                <p className="text-zinc-400">
                  To make authentic home-cooked food accessible to everyone while empowering
                  home chefs to share their culinary heritage and earn a living doing what they love.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-10">What We Stand For</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{value.title}</h4>
                <p className="text-sm text-zinc-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-10">Meet the Team</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h4 className="text-lg font-semibold text-white">{member.name}</h4>
                <p className="text-primary text-sm mb-2">{member.role}</p>
                <p className="text-sm text-zinc-400">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-zinc-400 mb-6">Ready to taste the difference?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/kitchens">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90">
                Browse Kitchens
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/business/signup">
              <Button size="lg" variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/10">
                <ChefHat className="w-4 h-4" />
                Become a Chef
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
