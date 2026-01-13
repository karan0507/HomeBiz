import { HeroSection } from "@/components/landing/hero-section"
import { FeaturedCategories } from "@/components/landing/featured-categories"
import { PopularBusinesses } from "@/components/landing/popular-businesses"
import { LandingNav } from "@/components/landing/landing-nav"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNav />
      <main className="flex-1">
        <HeroSection />
        <FeaturedCategories />
        <PopularBusinesses />
      </main>
      <Footer />
    </div>
  )
}
