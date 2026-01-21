import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Container } from "@/components/layout/Container"
import { SectionWrapper } from "@/components/layout/SectionWrapper"
import { businessInfo } from "@/lib/data/business-info"
import { getAllServices } from "@/lib/data/services"

export interface TreatmentsListSectionProps {
  /** Additional CSS classes */
  className?: string
}

/**
 * Treatments list section showing all available services/treatments.
 * Alternating left/right layout with full treatment details.
 * Content is pulled from lib/data/services.ts
 *
 * @example
 * <TreatmentsListSection />
 */
export function TreatmentsListSection({ className }: TreatmentsListSectionProps) {
  const treatments = getAllServices()
  const bookingUrl = businessInfo.bookingUrl || "/contact"

  return (
    <SectionWrapper className={cn("bg-background", className)}>
      <Container>
        <div className="flex flex-col gap-24 md:gap-32">
          {treatments.map((treatment, index) => (
            <div key={treatment.slug} id={treatment.slug}>
              <div
                className={cn(
                  "flex flex-col items-center gap-8 md:gap-12",
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                {/* Image */}
                {treatment.image && (
                  <div className="w-full md:w-5/12">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-xl">
                      <Image
                        src={treatment.image}
                        alt={treatment.imageAlt || treatment.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="w-full md:w-7/12">
                  <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
                    {treatment.name}
                  </h2>
                  <p className="mb-6 text-xl font-medium text-primary">
                    {treatment.shortDescription}
                  </p>

                  <div className="prose prose-gray mb-8 max-w-none">
                    <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                      {treatment.description}
                    </p>
                  </div>

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
            </div>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  )
}
