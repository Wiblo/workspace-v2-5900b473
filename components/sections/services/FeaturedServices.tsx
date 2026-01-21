import Link from "next/link"
import { ChevronRight, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Container } from "@/components/layout/Container"
import { SectionWrapper } from "@/components/layout/SectionWrapper"
import { ServiceCard } from "./ServiceCard"
import { getFeaturedServices } from "@/lib/data/services"

export interface FeaturedServicesProps {
  /** Section title */
  title?: string
  /** Section subtitle */
  subtitle?: string
  /** CTA text for "view all" link */
  ctaText?: string
  /** CTA URL for "view all" link */
  ctaUrl?: string
  /** Additional CSS classes */
  className?: string
}

/**
 * Featured services section for homepage.
 * Displays services marked as `featured: true` in services data.
 *
 * @example
 * <FeaturedServices
 *   title="Our Services"
 *   subtitle="What we offer"
 *   ctaText="View All Services"
 *   ctaUrl="/services"
 * />
 */
export function FeaturedServices({
  title = "Our Services",
  subtitle = "Explore our range of professional services designed to help you achieve your goals.",
  ctaText = "View All Services",
  ctaUrl = "/services",
  className,
}: FeaturedServicesProps) {
  const featuredServices = getFeaturedServices()

  return (
    <SectionWrapper className={cn("bg-background", className)}>
      <Container>
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="font-heading mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        {/* Services Grid */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {featuredServices.map((service) => (
            <ServiceCard
              key={service.slug}
              service={service}
              variant="detailed"
            />
          ))}
        </div>

        {/* View All CTA */}
        {ctaText && ctaUrl && (
          <div className="mt-12 text-center">
            <Link
              href={ctaUrl}
              className="group inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary"
            >
              {ctaText}
              <span className="relative inline-block h-4 w-4">
                <ChevronRight className="absolute left-0 top-0 h-4 w-4 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-0" />
                <ArrowRight className="absolute left-0 top-0 h-4 w-4 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
              </span>
            </Link>
          </div>
        )}
      </Container>
    </SectionWrapper>
  )
}
