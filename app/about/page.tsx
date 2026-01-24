import type { Metadata } from "next"
import { businessInfo } from "@/lib/data/business-info"

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn more about ${businessInfo.name} and our commitment to providing exceptional service.`,
  openGraph: {
    title: `About Us | ${businessInfo.name}`,
    description: `Learn more about ${businessInfo.name} and our commitment to providing exceptional service.`,
  },
}

/**
 * ABOUT PAGE
 *
 * This page is a template placeholder. Customize it for your client's business.
 *
 * TYPICAL ABOUT PAGE STRUCTURE:
 * 1. About Full Section - Company story, mission, values
 * 2. Team Section - Staff/owner profiles (if applicable)
 * 3. Features/Values - What makes the business unique
 * 4. Gallery Section - Photos of the business, team, or work
 * 5. CTA Section - Encourage visitors to take action
 *
 * AVAILABLE COMPONENTS (in components/sections/):
 * - about/AboutFullSection - Detailed about section with image
 * - features/AboutFeatures - Business values and differentiators
 * - gallery/GallerySection - Image gallery
 * - cta/CTASection - Call to action banner
 *
 * BEFORE ADDING COMPONENTS:
 * 1. Update lib/data/ with the client's business information
 * 2. Read docs/brand-guide.md for colors and typography
 * 3. Customize each component's content to match the business
 * 4. Follow the brand colors defined in globals.css
 *
 * EXAMPLE IMPLEMENTATION:
 * ```tsx
 * import { AboutFullSection } from "@/components/sections/about/AboutFullSection"
 * import { AboutFeatures } from "@/components/sections/features/AboutFeatures"
 * import { GallerySection } from "@/components/sections/gallery/GallerySection"
 *
 * export default function AboutPage() {
 *   return (
 *     <>
 *       <AboutFullSection />
 *       <AboutFeatures />
 *       <GallerySection />
 *     </>
 *   )
 * }
 * ```
 */
export default function AboutPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-balance">
        About Page Under Construction
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        This page is being customized for your business. Ask the AI to build
        your about page with your story and team information.
      </p>
    </div>
  )
}
