import type { Metadata } from "next"
import { businessInfo } from "@/lib/data/business-info"

export const metadata: Metadata = {
  title: "Our Services",
  description: `Explore our range of professional services at ${businessInfo.name}.`,
}

/**
 * SERVICES PAGE
 *
 * This page is a template placeholder. Customize it for your client's business.
 *
 * TYPICAL SERVICES PAGE STRUCTURE:
 * 1. Services Hero - Page title and brief intro
 * 2. Services Grid - All services with links to detail pages
 * 3. CTA Section - Encourage booking or contact
 *
 * AVAILABLE COMPONENTS (in components/sections/):
 * - hero/ServicesHero - Services page header
 * - services/ServicesGrid - Grid of all services (pulls from lib/data/services.ts)
 * - services/FeaturedServices - Subset of highlighted services
 * - cta/CTASection - Call to action banner
 *
 * BEFORE ADDING COMPONENTS:
 * 1. Update lib/data/services.ts with the client's actual services
 * 2. Read docs/brand-guide.md for colors and typography
 * 3. Customize each component's content to match the business
 * 4. Follow the brand colors defined in globals.css
 *
 * EXAMPLE IMPLEMENTATION:
 * ```tsx
 * import { ServicesHero } from "@/components/sections/hero/ServicesHero"
 * import { ServicesGrid } from "@/components/sections/services/ServicesGrid"
 *
 * export default function ServicesPage() {
 *   return (
 *     <>
 *       <ServicesHero />
 *       <ServicesGrid />
 *     </>
 *   )
 * }
 * ```
 */
export default function ServicesPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-balance">
        Services Page Under Construction
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        This page is being customized for your business. Ask the AI to build
        your services page with your offerings.
      </p>
    </div>
  )
}
