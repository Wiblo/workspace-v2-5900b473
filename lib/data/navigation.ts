/**
 * Navigation configuration for the site.
 * Used by: Navbar, Footer, mobile menu
 */

import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  label: string
  href: string
  external?: boolean
}

export interface SocialLink {
  label: string
  href: string
  icon: LucideIcon
}

/**
 * Main navigation items shown in header and footer.
 * Add or remove items as needed for your site.
 */
export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

/**
 * Footer quick links (can include booking link)
 */
export const quickLinks: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

/**
 * Social media link definitions.
 * URLs are populated dynamically from businessInfo.
 */
export const socialLinks: SocialLink[] = [
  { label: "Facebook", href: "", icon: Facebook },
  { label: "Instagram", href: "", icon: Instagram },
  { label: "Twitter", href: "", icon: Twitter },
  { label: "LinkedIn", href: "", icon: Linkedin },
  { label: "YouTube", href: "", icon: Youtube },
  { label: "Email", href: "", icon: Mail },
]

/**
 * Get navigation items - can be extended with dynamic items.
 */
export function getNavItems(): NavItem[] {
  return navItems
}

/**
 * Get social links with URLs populated from businessInfo.
 * Filters out links that don't have a URL configured.
 */
export function getSocialLinksWithUrls(businessInfo: {
  social?: Record<string, string | undefined>
  email?: string
}): SocialLink[] {
  return socialLinks
    .map((link) => {
      let href = link.href

      // Map social links from businessInfo
      if (link.label === "Facebook" && businessInfo.social?.facebook) {
        href = businessInfo.social.facebook
      } else if (link.label === "Instagram" && businessInfo.social?.instagram) {
        href = businessInfo.social.instagram
      } else if (link.label === "Twitter" && businessInfo.social?.twitter) {
        href = businessInfo.social.twitter
      } else if (link.label === "LinkedIn" && businessInfo.social?.linkedin) {
        href = businessInfo.social.linkedin
      } else if (link.label === "YouTube" && businessInfo.social?.youtube) {
        href = businessInfo.social.youtube
      } else if (link.label === "Email" && businessInfo.email) {
        href = `mailto:${businessInfo.email}`
      }

      return { ...link, href }
    })
    .filter((link) => link.href)
}

/**
 * Get quick links with optional booking URL appended.
 */
export function getQuickLinksWithBooking(bookingUrl?: string): NavItem[] {
  const links = [...quickLinks]

  if (bookingUrl) {
    links.push({
      label: "Book Appointment",
      href: bookingUrl,
      external: true,
    })
  }

  return links
}
