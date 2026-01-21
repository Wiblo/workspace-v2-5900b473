import Image from "next/image"
import Link from "next/link"
import { Check, ChevronRight, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Container } from "@/components/layout/Container"
import { SectionWrapper } from "@/components/layout/SectionWrapper"
import { businessInfo } from "@/lib/data/business-info"
import type { Service } from "@/lib/data/services"

export interface ServiceDetailSectionProps {
  /** Service data (without icon - strip it before passing) */
  service: Omit<Service, "icon">
  /** Additional CSS classes */
  className?: string
}

/**
 * Service detail section for individual service pages.
 * Displays full service information with image, description, benefits, and CTA.
 *
 * @example
 * // In /services/[slug]/page.tsx
 * const service = getServiceBySlug(slug)
 * const { icon, ...serviceData } = service
 * <ServiceDetailSection service={serviceData} />
 */
export function ServiceDetailSection({
  service,
  className,
}: ServiceDetailSectionProps) {
  const bookingUrl = businessInfo.bookingUrl || "/contact"

  return (
    <SectionWrapper className={cn("bg-background", className)}>
      <Container>
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
          {/* Image - 5/12 width on desktop */}
          {service.image && (
            <div className="w-full md:w-5/12">
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-xl">
                <Image
                  src={service.image}
                  alt={service.imageAlt || service.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          )}

          {/* Content - 7/12 width on desktop */}
          <div className="w-full md:w-7/12">
            {/* Title */}
            <h1 className="font-heading mb-3 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              {service.name}
            </h1>

            {/* Short Description */}
            {service.shortDescription && (
              <p className="mb-6 text-xl font-medium text-primary">
                {service.shortDescription}
              </p>
            )}

            {/* Full Description */}
            <div className="prose prose-gray mb-8 max-w-none">
              <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </div>

            {/* Duration & Price */}
            {(service.duration || service.price) && (
              <div className="mb-8 flex gap-6">
                {service.duration && (
                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">Duration</p>
                    <p className="text-lg font-semibold text-foreground">
                      {service.duration}
                    </p>
                  </div>
                )}
                {service.price && (
                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">Price</p>
                    <p className="text-lg font-semibold text-foreground">
                      {service.price}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Benefits */}
            {service.benefits && service.benefits.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  Benefits:
                </h3>
                <div className="space-y-2">
                  {service.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ideal For */}
            {service.idealFor && service.idealFor.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  Ideal For:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {service.idealFor.map((item, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-primary/10 px-3 py-1 text-sm text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <Link
              href={bookingUrl}
              target={bookingUrl.startsWith("http") ? "_blank" : undefined}
              rel={bookingUrl.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Book This Service
              <span className="relative inline-block h-4 w-4">
                <ChevronRight className="absolute left-0 top-0 h-4 w-4 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-0" />
                <ArrowRight className="absolute left-0 top-0 h-4 w-4 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
              </span>
            </Link>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  )
}
