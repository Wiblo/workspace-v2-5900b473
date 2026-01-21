import { cn } from "@/lib/utils"
import { Container } from "@/components/layout/Container"
import { SectionWrapper } from "@/components/layout/SectionWrapper"
import { ServiceCard } from "./ServiceCard"
import { getAllServices } from "@/lib/data/services"

export interface ServicesGridProps {
  /** Additional CSS classes */
  className?: string
}

/**
 * Services grid section for the /services listing page.
 * Displays all services in a responsive grid.
 *
 * @example
 * // On /services page
 * <ServicesGrid />
 */
export function ServicesGrid({ className }: ServicesGridProps) {
  const services = getAllServices()

  return (
    <SectionWrapper className={cn("bg-background", className)}>
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.slug}
              service={service}
              variant="compact"
            />
          ))}
        </div>
      </Container>
    </SectionWrapper>
  )
}
