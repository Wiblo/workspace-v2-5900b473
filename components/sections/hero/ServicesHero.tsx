import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

// =============================================================================
// CONFIGURATION - Edit these variables to customize the services hero
// =============================================================================

/** Hero height: "large" | "medium" | "small" */
const size: "large" | "medium" | "small" = "small"

/** Overlay opacity: 0-100 (percentage) */
const overlayOpacity = 20

/** Hero content - edit these values directly */
const heroContent = {
  subtitle: "What We Offer",
  title: "Our Services",
  backgroundImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop",
  backgroundImageAlt: "Our services",
  ctaText: "Contact Us",
  ctaUrl: "/contact",
}

// =============================================================================
// SIZE CLASSES
// =============================================================================

const sizeClasses = {
  large:
    "mx-auto mt-4 flex max-h-188 min-h-125 max-w-7xl flex-col items-center p-2 pt-0 md:h-[calc(100vh-136px)] md:min-h-160 xl:h-[calc(110vh-136px)] xl:max-w-none 2xl:px-48",
  medium:
    "mx-auto mt-4 flex max-h-140 min-h-100 max-w-7xl flex-col items-center p-2 pt-0 md:min-h-120 xl:max-w-none 2xl:px-48",
  small:
    "mx-auto mt-4 flex max-h-100 min-h-80 max-w-7xl flex-col items-center p-2 pt-0 md:min-h-80 xl:max-w-none 2xl:px-48",
}

// =============================================================================
// COMPONENT
// =============================================================================

export interface ServicesHeroProps {
  className?: string
}

/**
 * Services page hero section.
 * Configuration is done via variables at the top of this file.
 */
export function ServicesHero({ className }: ServicesHeroProps) {
  return (
    <section className={cn(sizeClasses[size], className)}>
      <div className="relative flex w-full flex-1 flex-col overflow-hidden rounded-4xl bg-black">
        {/* Background Image */}
        <div className="absolute h-full w-full overflow-hidden rounded-4xl">
          <Image
            src={heroContent.backgroundImage}
            alt={heroContent.backgroundImageAlt}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})` }}
          />
        </div>

        {/* Content */}
        <div className="relative flex h-full flex-1 flex-col justify-end gap-8 p-8 pt-52 lg:p-20 lg:pb-20">
          <div className="max-w-200 bg-transparent">
            <div className="flex flex-col gap-6 text-balance">
              {/* Subtitle */}
              <span className="text-white">
                <span className="border-l-4 border-primary pl-4 text-lg font-medium md:text-xl">
                  {heroContent.subtitle}
                </span>
              </span>

              {/* Headline */}
              <h1
                className="font-heading text-3xl leading-tight text-white md:text-4xl lg:text-5xl"
                style={{ fontWeight: 700 }}
              >
                {heroContent.title}
              </h1>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex">
            <Link
              href={heroContent.ctaUrl}
              className="group relative flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors ease-in-out hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="flex flex-1 items-center justify-center gap-x-2">
                <span className="flex flex-row items-center gap-x-1">
                  {heroContent.ctaText}
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
        </div>
      </div>
    </section>
  )
}
