import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Container } from "@/components/layout/Container"
import { SectionWrapper } from "@/components/layout/SectionWrapper"
import { getAllServices } from "@/lib/data/services"

export interface TreatmentsOverviewSectionProps {
  /** Additional CSS classes */
  className?: string
}

/**
 * Treatments overview section with clickable cards.
 * Shows all services as cards that link to individual treatment pages.
 * Content is pulled from lib/data/services.ts
 *
 * @example
 * <TreatmentsOverviewSection />
 */
export function TreatmentsOverviewSection({ className }: TreatmentsOverviewSectionProps) {
  const treatments = getAllServices()

  return (
    <SectionWrapper className={cn("bg-background", className)}>
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {treatments.map((treatment) => (
            <Link
              key={treatment.slug}
              href={`/treatments/${treatment.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-[box-shadow,border-color] hover:border-primary/50 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {/* Image */}
              {treatment.image && (
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={treatment.image}
                    alt={treatment.imageAlt || treatment.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex flex-1 flex-col gap-4 p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                  {treatment.name}
                </h3>

                {/* Description - truncated with line clamp */}
                <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {treatment.shortDescription}
                </p>

                {/* Learn More Button */}
                <div className="flex items-center gap-2 pt-2 text-sm font-medium text-primary">
                  <span>Learn More</span>
                  <span className="relative inline-block h-4 w-4" aria-hidden="true">
                    <ChevronRight className="absolute left-0 top-0 h-4 w-4 transition-[transform,opacity] duration-200 group-hover:translate-x-1 group-hover:opacity-0" />
                    <ArrowRight className="absolute left-0 top-0 h-4 w-4 -translate-x-1 opacity-0 transition-[transform,opacity] duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  )
}
