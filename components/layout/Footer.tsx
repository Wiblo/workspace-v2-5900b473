import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, ChevronRight, ArrowRight } from "lucide-react"
import {
  businessInfo,
  getGoogleMapsDirectionsUrl,
  getPhoneLink,
  getEmailLink,
} from "@/lib/data/business-info"
import {
  getSocialLinksWithUrls,
  getQuickLinksWithBooking,
} from "@/lib/data/navigation"

/**
 * Footer component with business info, navigation, contact details, and social links.
 * Pulls data from lib/data/business-info.ts and lib/data/navigation.ts
 */
export function Footer() {
  const currentYear = new Date().getFullYear()
  const socialLinks = getSocialLinksWithUrls(businessInfo)
  const quickLinks = getQuickLinksWithBooking(businessInfo.bookingUrl)

  return (
    <footer className="bg-background pb-16 pt-2 md:pb-4">
      <div className="mx-auto max-w-7xl px-2 xl:max-w-none 2xl:px-48">
        <div className="w-full overflow-hidden rounded-4xl bg-secondary/10 px-6 py-8 md:px-8">
          {/* Main Footer Content Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Business Info */}
            <div className="space-y-4">
              <div className="flex items-end space-x-2">
                <Image
                  src={businessInfo.logo}
                  alt={businessInfo.name}
                  width={64}
                  height={64}
                  className="mb-4 h-12 w-12 flex-shrink-0 object-contain sm:h-14 sm:w-14"
                />
                <div className="min-w-0 pb-0.5">
                  <h3 className="text-lg font-semibold leading-tight text-foreground sm:text-2xl">
                    {businessInfo.name}
                  </h3>
                  <p className="mt-0.5 break-words text-[8px] font-semibold uppercase tracking-[0.1em] text-muted-foreground sm:text-[10px] sm:tracking-[0.25em]">
                    {businessInfo.tagline}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {businessInfo.description}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4 font-semibold text-foreground">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary hover:underline"
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="mb-4 font-semibold text-foreground">
                Contact Info
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 text-primary" aria-hidden="true" />
                  <a
                    href={getGoogleMapsDirectionsUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <p>{businessInfo.address.street}</p>
                    {businessInfo.address.area && (
                      <p>{businessInfo.address.area}</p>
                    )}
                    <p>
                      {businessInfo.address.city}, {businessInfo.address.state}{" "}
                      {businessInfo.address.zip}
                    </p>
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
                  <div className="text-sm text-muted-foreground">
                    <a
                      href={getPhoneLink(businessInfo.phone)}
                      className="hover:text-primary"
                    >
                      {businessInfo.phone}
                    </a>
                    {businessInfo.phoneSecondary && (
                      <>
                        <span className="mx-2">|</span>
                        <a
                          href={getPhoneLink(businessInfo.phoneSecondary)}
                          className="hover:text-primary"
                        >
                          {businessInfo.phoneSecondary}
                        </a>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                  <a
                    href={getEmailLink()}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {businessInfo.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Office Hours & CTA */}
            <div>
              <h4 className="mb-4 font-semibold text-foreground">
                Office Hours
              </h4>
              <div className="mb-6 space-y-1 text-sm text-muted-foreground">
                {Object.entries(businessInfo.hours).map(([day, hours]) => (
                  <p key={day}>
                    <span className="capitalize">{day}</span>: {hours}
                  </p>
                ))}
              </div>

              {/* Book Appointment CTA */}
              {businessInfo.bookingUrl && (
                <a
                  href={businessInfo.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <span className="flex items-center gap-2">
                    Book Appointment
                    <span className="relative inline-block h-4 w-4">
                      <ChevronRight className="absolute left-0 top-0 h-4 w-4 transition-[transform,opacity] duration-200 group-hover:translate-x-1 group-hover:opacity-0" aria-hidden="true" />
                      <ArrowRight className="absolute left-0 top-0 h-4 w-4 -translate-x-1 opacity-0 transition-[transform,opacity] duration-200 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
                    </span>
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 px-8 md:mt-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid grow grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-[auto_1fr_auto] md:gap-x-8 md:gap-y-10 lg:gap-x-12 xl:grid-cols-[auto_1fr_auto]">
            {/* Social Icons */}
            <div className="flex gap-2 md:items-center">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/30 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                    aria-label={`View ${social.label} page (opens in new tab)`}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>

            {/* Copyright */}
            <div className="flex md:items-center md:justify-center">
              <p className="text-xs font-medium text-muted-foreground">
                &copy; {businessInfo.name} {currentYear} All Rights Reserved
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 md:justify-end">
              <Link href="/terms" className="shrink-0 hover:underline">
                <span className="text-xs font-medium text-muted-foreground">
                  Terms & Policies
                </span>
              </Link>

              <Link href="/accessibility" className="shrink-0 hover:underline">
                <span className="text-xs font-medium text-muted-foreground">
                  Accessibility
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
