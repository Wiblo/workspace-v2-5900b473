import Image from "next/image"
import Link from "next/link"
import { Check, ChevronRight, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Container } from "@/components/layout/Container"
import { SectionWrapper } from "@/components/layout/SectionWrapper"
import { businessInfo } from "@/lib/data/business-info"
import type { Service } from "@/lib/data/services"

// Type without icon for serialization across server/client boundary
type TreatmentData = Omit<Service, "icon">

export interface TreatmentDetailSectionProps {
  /** Treatment data (service data without icon) */
  treatment: TreatmentData
  /** Additional CSS classes */
  className?: string
}

/**
 * Treatment detail section for individual treatment pages.
 * Displays full treatment information with image, description, benefits, and CTA.
 *
 * @example
 * // In /treatments/[slug]/page.tsx
 * const service = getServiceBySlug(slug)
 * const { icon, ...treatmentData } = service
 * <TreatmentDetailSection treatment={treatmentData} />
 */
export function TreatmentDetailSection({
  treatment,
  className,
}: TreatmentDetailSectionProps) {
  const bookingUrl = businessInfo.bookingUrl || "/contact"

  return (
    <SectionWrapper className={cn("bg-background", className)}>
      <Container>
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
          {/* Image - 5/12 width on desktop */}
          {treatment.image && (
            <div className="w-full md:w-5/12">
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-xl">
                <Image
                  src={treatment.image}
                  alt={treatment.imageAlt || treatment.name}
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
            <h1 className="mb-3 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              {treatment.name}
            </h1>

            {/* Short Description */}
            {treatment.shortDescription && (
              <p className="mb-6 text-xl font-medium text-primary">
                {treatment.shortDescription}
              </p>
            )}

            {/* Full Description */}
            {treatment.description && (
              <div className="prose prose-gray mb-8 max-w-none">
                <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                  {treatment.description}
                </p>
              </div>
            )}

            {/* Duration & Price */}
            {(treatment.duration || treatment.price) && (
              <div className="mb-8 flex gap-6">
                {treatment.duration && (
                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">Duration</p>
                    <p className="text-lg font-semibold text-foreground">
                      {treatment.duration}
                    </p>
                  </div>
                )}
                {treatment.price && (
                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">Price</p>
                    <p className="text-lg font-semibold text-foreground">
                      {treatment.price}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Benefits */}
            {treatment.benefits && treatment.benefits.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  Clinical Benefits:
                </h3>
                <div className="space-y-2">
                  {treatment.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check
                        className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ideal For */}
            {treatment.idealFor && treatment.idealFor.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  Indicated For:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {treatment.idealFor.map((condition, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-primary/10 px-3 py-1 text-sm text-muted-foreground"
                    >
                      {condition}
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
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Book This Treatment
              <span className="relative inline-block h-4 w-4" aria-hidden="true">
                <ChevronRight className="absolute left-0 top-0 h-4 w-4 transition-[transform,opacity] duration-200 group-hover:translate-x-1 group-hover:opacity-0" />
                <ArrowRight className="absolute left-0 top-0 h-4 w-4 -translate-x-1 opacity-0 transition-[transform,opacity] duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
              </span>
            </Link>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  )
}
