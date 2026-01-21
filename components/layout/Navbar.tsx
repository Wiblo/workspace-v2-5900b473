"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Menu,
  X,
  ChevronRight,
  ArrowRight,
  Phone,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { businessInfo, getPhoneLink } from "@/lib/data/business-info"
import { navItems } from "@/lib/data/navigation"

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-lg px-6 pb-6 pt-8">
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Main Navigation" className="relative inset-0 z-30 flex w-full grid-cols-[auto_1fr_auto] md:grid">
          {/* Logo Section */}
          <div className="flex gap-x-4">
            {/* Mobile hamburger button */}
            <button
              className="flex items-center justify-center rounded-lg hover:bg-secondary/20 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-8 w-8" />
              ) : (
                <Menu className="h-8 w-8" />
              )}
            </button>

            {/* Brand logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:relative md:left-0 md:top-0 md:translate-x-0 md:translate-y-0 md:-mt-3">
              <Link
                href="/"
                className="flex items-end gap-2"
              >
                <Image
                  src={businessInfo.logo}
                  alt={`${businessInfo.name} Logo`}
                  width={64}
                  height={64}
                  className="h-10 w-10 sm:h-16 sm:w-16 object-contain"
                  priority
                />
                <div className="pb-0.5">
                  <p className="text-base sm:text-2xl font-signature font-semibold text-foreground leading-tight whitespace-nowrap">
                    {businessInfo.name}
                  </p>
                  <p className="text-[8px] sm:text-[10px] font-heading font-semibold tracking-[0.15em] sm:tracking-[0.25em] text-muted-foreground uppercase whitespace-nowrap">
                    {businessInfo.tagline}
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="ml-8 flex hidden items-center md:flex">
            <ul className="flex h-full flex-row items-center gap-x-2">
              {navItems.map((item, index) => (
                <li key={index} className="flex items-center">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex min-h-10 items-center whitespace-nowrap rounded-lg px-3 py-2 font-medium transition-colors hover:text-foreground hover:bg-secondary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      pathname === item.href
                        ? "bg-secondary/30 text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right-hand CTA */}
          <div className="relative flex flex-1 items-center justify-end md:h-12">
            {/* Phone (desktop only) */}
            <a
              href={getPhoneLink()}
              className="hidden items-center gap-2 text-sm text-muted-foreground hover:text-primary md:flex mr-4 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Phone className="h-4 w-4" />
              <span>{businessInfo.phone}</span>
            </a>

            {/* Book Appointment CTA (desktop only) */}
            {businessInfo.showBookingButton && businessInfo.bookingUrl && (
              <div className="ml-2 hidden md:block">
                <div className="flex items-center justify-end">
                  <a
                    href={businessInfo.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex min-h-10 items-center justify-center rounded-lg bg-primary px-3 py-2 font-medium text-primary-foreground transition-colors ease-in-out hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <span className="pointer-events-none absolute inset-0 rounded-lg bg-black/10 opacity-0 transition-opacity group-hover:opacity-100 hover:rounded-xl"></span>
                    <span className="flex flex-1 items-center justify-center gap-x-2">
                      Book Appointment
                      <span className="relative inline-block h-4 w-4">
                        <ChevronRight className="absolute left-0 top-0 h-4 w-4 transition-[transform,opacity] duration-200 group-hover:translate-x-1 group-hover:opacity-0" aria-hidden="true" />
                        <ArrowRight className="absolute left-0 top-0 h-4 w-4 -translate-x-1 opacity-0 transition-[transform,opacity] duration-200 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={cn(
          "absolute left-0 top-full w-full overflow-hidden rounded-b-lg bg-background shadow-lg transition-all duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="w-full">
          <ul className="flex flex-col gap-y-2 px-4 py-6">
            {navItems.map((item, index) => (
              <li key={index} className="flex items-center">
                <Link
                  href={item.href}
                  className="flex min-h-10 w-full items-center whitespace-nowrap rounded-lg px-3 py-2 font-medium text-muted-foreground transition-colors hover:bg-secondary/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {businessInfo.showBookingButton && businessInfo.bookingUrl && (
              <li className="flex items-center pt-4">
                <a
                  href={businessInfo.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-10 w-full items-center justify-center rounded-lg bg-primary px-3 py-2 font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Book Appointment
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  )
}
