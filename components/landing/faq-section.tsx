/**
 * FAQ Section for HomeBiz Toronto Landing Page
 * "Frequently Asked Questions"
 *
 * Features:
 * - Accordion-style expandable items
 * - Smooth animations with Framer Motion
 * - Categorized FAQ items
 * - Glassmorphism design
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, ChefHat, Users, CreditCard, Shield } from "lucide-react";
import { mockFAQs as faqItems } from "@/lib/mock-data";

// Category icons mapping
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  general: HelpCircle,
  customers: Users,
  chefs: ChefHat,
  pricing: CreditCard,
  safety: Shield,
};

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  // Group FAQs by category
  const categories = [...new Set(faqItems.map((item) => item.category))];

  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass-emerald text-emerald-700 text-sm font-medium mb-4">
            Got Questions?
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about HomeBiz. Can&apos;t find what you&apos;re
            looking for? Contact us!
          </p>
        </motion.div>

        {/* FAQ Categories */}
        <div className="max-w-3xl mx-auto">
          {categories.map((category, catIndex) => {
            const Icon = categoryIcons[category] || HelpCircle;
            const categoryFaqs = faqItems.filter((item) => item.category === category);

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                className="mb-8"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl gradient-emerald-lime flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold capitalize">{category}</h3>
                </div>

                {/* FAQ Items */}
                <div className="space-y-3">
                  {categoryFaqs.map((faq) => (
                    <FAQItem
                      key={faq.id}
                      faq={faq}
                      isOpen={openId === faq.id}
                      onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Still Have Questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-3xl glass">
            <div className="w-12 h-12 rounded-full gradient-emerald-lime flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <p className="font-semibold">Still have questions?</p>
              <p className="text-sm text-muted-foreground">
                We&apos;re here to help! Reach out anytime.
              </p>
            </div>
            <a
              href="mailto:support@homebiz.ca"
              className="px-6 py-2.5 rounded-full gradient-emerald-lime text-white font-medium hover:opacity-90 transition-opacity"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * FAQ Item Component
 * Individual accordion item
 */
function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqItems)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl glass overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors"
      >
        <span className="font-medium pr-4">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-emerald-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pb-4 text-muted-foreground">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
