/**
 * Navigation configuration for the site.
 * Used by: Navbar, Footer, mobile menu
 */

export interface NavItem {
  label: string
  href: string
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
 * Get navigation items - can be extended with dynamic items.
 */
export function getNavItems(): NavItem[] {
  return navItems
}
