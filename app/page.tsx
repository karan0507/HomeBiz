/**
 * HomeBiz Landing Page
 * "Authentic Home Cooking from Your Toronto Neighbours"
 */

import { MainLayout } from "@/components/layout/main-layout";
import { HeroSection } from "@/components/landing/hero-section";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { FeaturedKitchens } from "@/components/landing/featured-kitchens";
import { FeaturedCategories } from "@/components/landing/featured-categories";
import { AboutSection } from "@/components/landing/about-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FAQSection } from "@/components/landing/faq-section";

export default function LandingPage() {
  return (
    <MainLayout>
      <HeroSection />
      <BenefitsSection />
      <FeaturedKitchens />
      <FeaturedCategories />
      <TestimonialsSection />
      <AboutSection />
      <FAQSection />
    </MainLayout>
  );
}
