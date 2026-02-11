/**
 * HomeBiz Landing Page
 * "Authentic Home Cooking from Your Toronto Neighbours"
 */

import { MainLayout } from "@/components/layout/main-layout";
import { HeroSection } from "@/components/landing/hero-section";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { FeaturedCategories } from "@/components/landing/featured-categories";
import { FeaturedKitchens } from "@/components/landing/featured-kitchens";
import { AboutSection } from "@/components/landing/about-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FAQSection } from "@/components/landing/faq-section";
import { ContactSection } from "@/components/landing/contact-section";

export default function LandingPage() {
  return (
    <MainLayout>
      <HeroSection />
      <BenefitsSection />
      <FeaturedCategories />
      <FeaturedKitchens />
      <TestimonialsSection />
      <AboutSection />
      <FAQSection />
      <ContactSection />
    </MainLayout>
  );
}
