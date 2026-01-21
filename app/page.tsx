import {
  HeroSection,
  FeaturedServices,
  AboutPreview,
  FeaturesSection,
  CTASection,
  LocationSection,
  FAQSection,
} from "@/components/sections"

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
