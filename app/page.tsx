/**
 * HOME PAGE
 *
 * This page is a template placeholder. Customize it for your client's business.
 *
 * TYPICAL HOME PAGE STRUCTURE:
 * 1. Hero Section - Main headline, value proposition, CTA
 * 2. Featured Services - Highlight 3-4 key services
 * 3. About Preview - Brief intro with link to full about page
 * 4. Features/Benefits - Why choose this business
 * 5. CTA Section - Call to action (book appointment, contact, etc.)
 * 6. Location Section - Address, map, hours
 * 7. FAQ Section - Common questions
 *
 * AVAILABLE COMPONENTS (in components/sections/):
 * - hero/HeroSection - Full hero with image and CTA
 * - services/FeaturedServices - Grid of featured services
 * - about/AboutPreview - Short about section with link
 * - features/FeaturesSection - Benefits/features grid
 * - cta/CTASection - Call to action banner
 * - location/LocationSection - Business location and hours
 * - faq/FAQSection - Frequently asked questions
 *
 * BEFORE ADDING COMPONENTS:
 * 1. Update lib/data/ with the client's business information
 * 2. Read docs/brand-guide.md for colors and typography
 * 3. Customize each component's content to match the business
 * 4. Follow the brand colors defined in globals.css
 *
 * EXAMPLE IMPLEMENTATION:
 * ```tsx
 * import { HeroSection } from "@/components/sections/hero/HeroSection"
 * import { FeaturedServices } from "@/components/sections/services/FeaturedServices"
 * import { AboutPreview } from "@/components/sections/about/AboutPreview"
 * import { FeaturesSection } from "@/components/sections/features/FeaturesSection"
 * import { CTASection } from "@/components/sections/cta/CTASection"
 * import { LocationSection } from "@/components/sections/location/LocationSection"
 * import { FAQSection } from "@/components/sections/faq/FAQSection"
 *
 * export default function HomePage() {
 *   return (
 *     <>
 *       <HeroSection />
 *       <FeaturedServices />
 *       <AboutPreview />
 *       <FeaturesSection />
 *       <CTASection />
 *       <LocationSection />
 *       <FAQSection />
 *     </>
 *   )
 * }
 * ```
 */
export default function HomePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-balance">
        Home Page Under Construction
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        This page is being customized for your business. Ask the AI to build
        your home page with your brand and content.
      </p>
    </div>
  )
}
