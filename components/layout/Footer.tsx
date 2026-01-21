import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"
import { businessInfo } from "@/lib/data/business-info"
import { navItems } from "@/lib/data/navigation"

/**
 * Footer component with business info, navigation, and contact details.
 * Pulls data from lib/data/business-info.ts and lib/data/navigation.ts
 */
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Description */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold">{businessInfo.name}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {businessInfo.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Contact</h3>
            <ul className="space-y-3">
              {businessInfo.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {businessInfo.address.street}
                    <br />
                    {businessInfo.address.city}, {businessInfo.address.state}{" "}
                    {businessInfo.address.zip}
                  </span>
                </li>
              )}
              {businessInfo.phone && (
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <a
                    href={`tel:${businessInfo.phone.replace(/[^0-9+]/g, "")}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {businessInfo.phone}
                  </a>
                </li>
              )}
              {businessInfo.email && (
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <a
                    href={`mailto:${businessInfo.email}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {businessInfo.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Hours</h3>
            <ul className="space-y-1">
              {Object.entries(businessInfo.hours).map(([day, hours]) => (
                <li
                  key={day}
                  className="flex justify-between text-sm text-muted-foreground"
                >
                  <span className="capitalize">{day}</span>
                  <span>{hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {businessInfo.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
