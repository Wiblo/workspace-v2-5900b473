"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { businessInfo } from "@/lib/data/business-info"

export interface HeroSectionProps {
  className?: string
}

/**
 * Homepage hero section with full-width background image and centered content.
 * Edit the content variables below to customize for your business.
 */
export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section
      className={cn(
        "mx-auto mt-4 flex max-h-188 min-h-125 max-w-7xl flex-col items-center p-2 pt-0 md:h-[calc(100vh-136px)] md:min-h-160 xl:h-[calc(110vh-136px)] xl:max-w-none 2xl:px-48",
        className
      )}
    >
      <div className="relative flex w-full flex-1 flex-col overflow-hidden rounded-4xl bg-black">
        {/* Background Image */}
        <div className="absolute h-full w-full overflow-hidden rounded-4xl">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop"
            alt="Professional business environment"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content */}
        <div className="relative flex h-full flex-1 flex-col justify-end gap-8 p-8 pt-52 lg:p-20 lg:pb-20">
          <div className="max-w-200 bg-transparent">
            <div className="flex flex-col gap-6 text-balance">
              <h1 className="text-white">
                <span className="border-l-4 border-primary pl-4 text-lg font-medium md:text-xl">
                  Welcome to {businessInfo.name}
                </span>
              </h1>

              <span
                className="font-heading text-3xl leading-tight text-white md:text-4xl lg:text-5xl"
                style={{ fontWeight: 700 }}
              >
                Your Compelling Headline Goes Here
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href={businessInfo.bookingUrl || "/contact"}
                className="group relative flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-white transition-all ease-in-out hover:rounded-xl hover:bg-primary/90"
              >
                <span className="flex flex-1 items-center justify-center gap-x-2">
                  <span className="flex flex-row items-center gap-x-1">
                    Get Started
                    <span className="relative inline-block h-4 w-4">
                      <ChevronRight className="absolute left-0 top-0 h-4 w-4 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-0" />
                      <ArrowRight className="absolute left-0 top-0 h-4 w-4 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                    </span>
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
