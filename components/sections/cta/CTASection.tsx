import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { SectionWrapper } from "@/components/layout/SectionWrapper"
import { businessInfo } from "@/lib/data/business-info"

export interface CTASectionProps {
  className?: string
}

/**
 * Homepage call-to-action section with full-width background image and content card.
 * Edit the content below to customize for your business.
 */
export function CTASection({ className }: CTASectionProps) {
  return (
    <SectionWrapper className={cn("bg-background", className)}>
      <div className="relative mx-auto min-h-[600px] max-h-screen max-w-7xl bg-transparent p-2 xl:max-w-none 2xl:px-48 md:max-h-full">
        <div className="relative flex bg-transparent md:items-center">
          {/* Background Image */}
          <div className="absolute h-full w-full overflow-hidden rounded-4xl bg-muted">
            <Image
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop"
              alt="Professional office environment"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 1200px, 1400px"
              priority
            />
            {/* Dark overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Content Card */}
          <div className="flex w-full px-2 pb-2 pt-[200px] md:p-20">
            <div className="flex w-full items-center rounded-4xl bg-background/80 p-8 shadow-xl backdrop-blur-2xl md:min-h-[640px] md:max-w-[632px] md:p-20">
              <div className="flex w-full flex-col gap-6">
                {/* Title */}
                <div className="flex w-full">
                  <h2 className="font-heading text-balance text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                    Ready to Get Started?
                  </h2>
                </div>

                {/* Description and CTA */}
                <div className="flex w-full flex-col gap-8">
                  <div className="flex flex-col gap-1 text-base font-medium text-muted-foreground">
                    <p>
                      Take the first step towards achieving your goals. Contact us
                      today to schedule a consultation and discover how we can help
                      you succeed.
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div className="flex">
                    <Link
                      href={businessInfo.bookingUrl || "/contact"}
                      className="group relative flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-[background-color,border-radius] ease-in-out hover:rounded-xl hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <span className="pointer-events-none absolute inset-0 rounded-lg bg-black/10 opacity-0 transition-opacity group-hover:opacity-100 group-hover:rounded-xl" />

                      <span className="flex flex-1 items-center justify-center gap-x-2">
                        <span className="flex flex-row items-center gap-x-1">
                          Get Started
                          <span className="relative inline-block h-4 w-4" aria-hidden="true">
                            <ChevronRight className="absolute left-0 top-0 h-4 w-4 transition-[transform,opacity] duration-200 group-hover:translate-x-1 group-hover:opacity-0" />
                            <ArrowRight className="absolute left-0 top-0 h-4 w-4 -translate-x-1 opacity-0 transition-[transform,opacity] duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                          </span>
                        </span>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
