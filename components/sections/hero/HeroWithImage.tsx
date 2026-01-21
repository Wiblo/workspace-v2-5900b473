import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { businessInfo } from "@/lib/data/business-info"

// =============================================================================
// CONFIGURATION - Edit these variables to customize the hero
// =============================================================================

/** Hero height: "large" | "medium" | "small" */
const size: "large" | "medium" | "small" = "large"

/** Overlay opacity: 0-100 (percentage) */
const overlayOpacity = 20

/** Hero content - edit these values directly */
const heroContent = {
  subtitle: `Welcome to ${businessInfo.name}`,
  title: "Experience Relief Through Expert Chiropractic Care",
  backgroundImage: "/images/hero-background.jpg",
  backgroundImageAlt: "Professional chiropractic treatment room with modern equipment",
  ctaText: "Book Your Appointment",
  ctaUrl: businessInfo.bookingUrl || "/contact",
}

// =============================================================================
// SIZE CLASSES
// =============================================================================

const sizeClasses = {
  large:
    "flex mt-4 max-h-188 min-h-125 max-w-7xl xl:max-w-none 2xl:px-48 flex-col items-center p-2 pt-0 md:min-h-160 md:h-[calc(100vh-136px)] xl:h-[calc(110vh-136px)]",
  medium:
    "flex mt-4 max-h-140 min-h-100 max-w-7xl xl:max-w-none 2xl:px-48 flex-col items-center p-2 pt-0 md:min-h-120",
  small:
    "flex mt-4 max-h-100 min-h-80 max-w-7xl xl:max-w-none 2xl:px-48 flex-col items-center p-2 pt-0 md:min-h-80",
}

// =============================================================================
// PROPS INTERFACE (for dynamic pages like service details)
// =============================================================================

export interface HeroWithImageProps {
  /** Override subtitle text */
  subtitle?: string
  /** Override main headline */
  title?: string
  /** Override background image URL */
  backgroundImage?: string
  /** Override alt text for background image */
  backgroundImageAlt?: string
  /** Override CTA button text */
  ctaText?: string
  /** Override CTA button URL */
  ctaUrl?: string
  /** Override hero size */
  size?: "large" | "medium" | "small"
  /** Override overlay opacity (0-100) */
  overlayOpacity?: number
  /** Additional CSS classes */
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Hero section with full-width background image.
 *
 * Configuration is done via variables at the top of this file.
 * Props can override for dynamic pages (e.g., service detail pages).
 *
 * @example
 * // Default usage (uses variables defined above)
 * <HeroWithImage />
 *
 * @example
 * // Override for dynamic page
 * <HeroWithImage
 *   title={service.name}
 *   backgroundImage={service.image}
 *   size="small"
 * />
 */
export function HeroWithImage(props: HeroWithImageProps = {}) {
  // Use props if provided, otherwise fall back to variables
  const displaySubtitle = props.subtitle ?? heroContent.subtitle
  const displayTitle = props.title ?? heroContent.title
  const displayImage = props.backgroundImage ?? heroContent.backgroundImage
  const displayImageAlt = props.backgroundImageAlt ?? heroContent.backgroundImageAlt
  const displayCtaText = props.ctaText ?? heroContent.ctaText
  const displayCtaUrl = props.ctaUrl ?? heroContent.ctaUrl
  const displaySize = props.size ?? size
  const displayOverlay = props.overlayOpacity ?? overlayOpacity

  return (
    <section className={cn(sizeClasses[displaySize], props.className)}>
      <div className="relative flex w-full flex-1 flex-col overflow-hidden rounded-4xl bg-black">
        {/* Background Image */}
        <div className="absolute h-full w-full overflow-hidden rounded-4xl">
          <Image
            src={displayImage}
            alt={displayImageAlt}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          {/* Overlay - opacity controlled by variable/prop */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(0, 0, 0, ${displayOverlay / 100})` }}
          />
        </div>

        {/* Content */}
        <div className="relative flex h-full flex-1 flex-col justify-end gap-8 p-8 pt-52 lg:p-20 lg:pb-20">
          <div className="max-w-200 bg-transparent">
            <div className="flex flex-col gap-6 text-balance">
              {/* Subtitle */}
              {displaySubtitle && (
                <span className="text-white">
                  <span className="border-l-4 border-primary pl-4 text-lg font-medium md:text-xl">
                    {displaySubtitle}
                  </span>
                </span>
              )}

              {/* Headline */}
              <h1
                className="font-heading text-3xl leading-tight text-white md:text-4xl lg:text-5xl"
                style={{ fontWeight: 700 }}
              >
                {displayTitle}
              </h1>
            </div>
          </div>

          {/* CTA Button */}
          {displayCtaText && displayCtaUrl && (
            <div className="flex">
              <Link
                href={displayCtaUrl}
                className="group relative flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors ease-in-out hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="flex flex-1 items-center justify-center gap-x-2">
                  <span className="flex flex-row items-center gap-x-1">
                    {displayCtaText}
                    <span className="relative inline-block h-4 w-4">
                      <ChevronRight
                        className="absolute left-0 top-0 h-4 w-4 transition-[transform,opacity] duration-200 group-hover:translate-x-1 group-hover:opacity-0"
                        aria-hidden="true"
                      />
                      <ArrowRight
                        className="absolute left-0 top-0 h-4 w-4 -translate-x-1 opacity-0 transition-[transform,opacity] duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
