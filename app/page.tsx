import { HeroSection } from "@/components/sections/hero/HeroSection"
import { FeaturedServices } from "@/components/sections/services/FeaturedServices"
import { AboutPreview } from "@/components/sections/about/AboutPreview"
import { FeaturesSection } from "@/components/sections/features/FeaturesSection"
import { CTASection } from "@/components/sections/cta/CTASection"
import { LocationSection } from "@/components/sections/location/LocationSection"
import { FAQSection } from "@/components/sections/faq/FAQSection"

/**
 * Home page composed of sections.
 * To customize content, edit the individual section components in components/sections/
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedServices />
      <AboutPreview />
      <FeaturesSection />
      <CTASection />
      <LocationSection />
      <FAQSection />
    </>
  )
}
