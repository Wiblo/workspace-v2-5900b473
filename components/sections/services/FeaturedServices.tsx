"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ChevronLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { SectionWrapper } from "@/components/layout/SectionWrapper"
import { getFeaturedServices, type Service } from "@/lib/data/services"

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
 * Service card for the carousel.
 * Clean design with image, title+duration, description, price, and CTA.
 */
function ServiceCarouselCard({ service }: { service: Service }) {
  return (
    <div className="group relative w-[264px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-lg md:w-[296px]">
      {/* Image */}
      <div className="relative h-[248px] w-full overflow-hidden bg-muted md:h-[280px]">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.imageAlt || service.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 264px, 296px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4">
        {/* Title + Duration */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-lg font-semibold text-foreground">
            {service.name}
          </h3>
          {service.duration && (
            <span className="shrink-0 text-sm font-medium text-primary">
              {service.duration}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {service.shortDescription}
        </p>

        {/* Price */}
        {service.price && (
          <p className="text-base font-semibold text-foreground">
            {service.price}
          </p>
        )}

        {/* CTA Button */}
        <Link
          href={`/services/${service.slug}`}
          className="mt-1 flex items-center justify-center rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Learn More
        </Link>
      </div>
    </div>
  )
}

/**
 * Featured services section with horizontal scrolling carousel.
 * Displays services marked as `featured: true` in services data.
 */
export function FeaturedServices({
  title = "Most Popular Services",
  subtitle = "Discover the treatments our patients love most.",
  ctaText = "View All Services",
  ctaUrl = "/services",
  className,
}: FeaturedServicesProps) {
  const featuredServices = getFeaturedServices()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [showArrows, setShowArrows] = useState(false)

  const checkScrollability = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      const hasOverflow = scrollWidth > clientWidth
      setCanScrollLeft(scrollLeft > 1)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
      setShowArrows(hasOverflow)
    }
  }, [])

  useEffect(() => {
    checkScrollability()
    window.addEventListener("resize", checkScrollability)
    return () => window.removeEventListener("resize", checkScrollability)
  }, [checkScrollability])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 280
      scrollContainerRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 280
      scrollContainerRef.current.scrollBy({ left: cardWidth, behavior: "smooth" })
    }
  }

  if (featuredServices.length === 0) {
    return null
  }

  return (
    <SectionWrapper className={cn("bg-background", className)}>
      {/* Header */}
      <div className="mx-auto mb-12 max-w-2xl px-6 text-center md:px-8">
        <h2 className="font-heading mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="scrollbar-hide flex justify-center snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 py-2 md:px-8"
          onScroll={checkScrollability}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {featuredServices.map((service) => (
            <ServiceCarouselCard key={service.slug} service={service} />
          ))}
        </div>

        {/* Hide scrollbar styles */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      {/* Navigation Arrows */}
      {showArrows && (
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
              canScrollLeft
                ? "border-border text-muted-foreground hover:border-primary hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                : "cursor-not-allowed border-border/50 text-muted-foreground/50"
            )}
            aria-label="Previous services"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
              canScrollRight
                ? "border-border text-muted-foreground hover:border-primary hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                : "cursor-not-allowed border-border/50 text-muted-foreground/50"
            )}
            aria-label="Next services"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* View All CTA */}
      {ctaText && ctaUrl && (
        <div className="mt-10 flex justify-center px-6 md:px-8">
          <Link
            href={ctaUrl}
            className="group inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-[background-color,border-radius] hover:rounded-xl hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span className="flex items-center gap-1">
              {ctaText}
              <span className="relative inline-block h-4 w-4" aria-hidden="true">
                <ChevronRight className="absolute left-0 top-0 h-4 w-4 transition-[transform,opacity] duration-200 group-hover:translate-x-1 group-hover:opacity-0" />
                <ArrowRight className="absolute left-0 top-0 h-4 w-4 -translate-x-1 opacity-0 transition-[transform,opacity] duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
              </span>
            </span>
          </Link>
        </div>
      )}
    </SectionWrapper>
  )
}
