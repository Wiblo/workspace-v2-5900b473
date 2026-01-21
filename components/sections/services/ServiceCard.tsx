import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ArrowRight, Star } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { cn } from "@/lib/utils"
import type { Service } from "@/lib/data/services"

interface ServiceCardProps {
  service: Service
  /** Show full details (benefits list, duration, price) */
  variant?: "compact" | "detailed"
  className?: string
}

/**
 * Renders a Lucide icon by name.
 * Falls back to Star if icon not found.
 */
function ServiceIcon({ name, className }: { name?: string; className?: string }) {
  if (!name) return <Star className={className} />
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icons = LucideIcons as any
  const IconComponent = icons[name]
  if (!IconComponent) return <Star className={className} />
  return <IconComponent className={className} />
}

/**
 * Reusable service card component.
 * Used by FeaturedServices (detailed) and ServicesGrid (compact).
 */
export function ServiceCard({
  service,
  variant = "detailed",
  className,
}: ServiceCardProps) {

  if (variant === "compact") {
    return (
      <Link
        href={`/services/${service.slug}`}
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-[box-shadow,border-color] hover:border-primary/50 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
      >
        {/* Image */}
        {service.image && (
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={service.image}
              alt={service.imageAlt || service.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col gap-4 p-6">
          <h3 className="font-heading text-xl font-bold text-foreground transition-colors group-hover:text-primary">
            {service.name}
          </h3>

          <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
            {service.shortDescription}
          </p>

          {/* Learn More */}
          <div className="flex items-center gap-2 pt-2 text-sm font-medium text-primary">
            <span>Learn More</span>
            <span className="relative inline-block h-4 w-4" aria-hidden="true">
              <ChevronRight className="absolute left-0 top-0 h-4 w-4 transition-[transform,opacity] duration-200 group-hover:translate-x-1 group-hover:opacity-0" />
              <ArrowRight className="absolute left-0 top-0 h-4 w-4 -translate-x-1 opacity-0 transition-[transform,opacity] duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
            </span>
          </div>
        </div>
      </Link>
    )
  }

  // Detailed variant
  return (
    <div
      className={cn(
        "group h-full overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow hover:shadow-lg",
        className
      )}
    >
      {/* Image */}
      {service.image && (
        <div className="relative h-56 w-full flex-shrink-0 overflow-hidden bg-muted">
          <Image
            src={service.image}
            alt={service.imageAlt || service.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col p-5">
        {/* Icon & Title */}
        <div className="mb-3 flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ServiceIcon name={service.icon} className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-lg font-semibold text-foreground">
              {service.name}
            </h3>
            {(service.duration || service.price) && (
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                {service.duration && <span>{service.duration}</span>}
                {service.duration && service.price && <span>•</span>}
                {service.price && (
                  <span className="font-medium text-primary">{service.price}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
          {service.shortDescription}
        </p>

        {/* Benefits */}
        {service.benefits && service.benefits.length > 0 && (
          <ul className="mb-4 space-y-1">
            {service.benefits.slice(0, 4).map((benefit, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <ChevronRight className="h-3 w-3 flex-shrink-0 text-primary" aria-hidden="true" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        )}

        {/* CTA Button */}
        <div className="mt-auto border-t border-border pt-4">
          <Link
            href={`/services/${service.slug}`}
            className="group/btn flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Learn More
            <span className="relative inline-block h-4 w-4" aria-hidden="true">
              <ChevronRight className="absolute left-0 top-0 h-4 w-4 transition-[transform,opacity] duration-200 group-hover/btn:translate-x-1 group-hover/btn:opacity-0" />
              <ArrowRight className="absolute left-0 top-0 h-4 w-4 -translate-x-1 opacity-0 transition-[transform,opacity] duration-200 group-hover/btn:translate-x-0 group-hover/btn:opacity-100" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
