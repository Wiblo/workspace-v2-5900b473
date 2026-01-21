"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface HeroSectionProps {
  className?: string
}

/**
 * Services page hero section.
 * Edit the content below to customize for your business.
 */
export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section
      className={cn(
        "mx-auto mt-4 flex max-h-100 min-h-80 max-w-7xl flex-col items-center p-2 pt-0 md:min-h-80 xl:max-w-none 2xl:px-48",
        className
      )}
    >
      <div className="relative flex w-full flex-1 flex-col overflow-hidden rounded-4xl bg-black">
        {/* Background Image */}
        <div className="absolute h-full w-full overflow-hidden rounded-4xl">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop"
            alt="Our services"
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
              <span className="text-white">
                <span className="border-l-4 border-primary pl-4 text-lg font-medium md:text-xl">
                  What We Offer
                </span>
              </span>

              <h1
                className="font-heading text-3xl leading-tight text-white md:text-4xl lg:text-5xl"
                style={{ fontWeight: 700 }}
              >
                Our Services
              </h1>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex">
            <Link
              href="/contact"
              className="group relative flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-white transition-all ease-in-out hover:rounded-xl hover:bg-primary/90"
            >
              <span className="flex flex-1 items-center justify-center gap-x-2">
                <span className="flex flex-row items-center gap-x-1">
                  Contact Us
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
    </section>
  )
}
