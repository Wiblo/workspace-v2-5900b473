/**
 * Central business information - single source of truth.
 * Update this file to change business details across the entire site.
 *
 * Used by: Navbar, Footer, JSON-LD schemas, contact pages, metadata
 */
export const businessInfo = {
  // Core Business Details
  name: "Proactive Therapy",
  tagline: "Expert physiotherapy to keep you moving",
  description:
    "Proactive Therapy is a physiotherapy practice dedicated to helping you recover from injury, manage pain, and achieve your movement goals through evidence-based treatment.",

  // Contact Information
  phone: "(555) 123-4567",
  phoneSecondary: "",
  email: "hello@proactivetherapy.com",

  // Physical Location
  address: {
    street: "123 Wellness Avenue",
    area: "Suite 200",
    city: "Your City",
    state: "ST",
    zip: "00000",
    country: "US",
  },

  // Coordinates for maps (optional - set to 0 if unknown)
  geo: {
    latitude: 0,
    longitude: 0,
  },

  // Google Maps configuration
  maps: {
    placeId: "",
    locationName: "Proactive Therapy",
    apiKey: "",
  },

  // Business Hours
  hours: {
    monday: "7:00 AM - 7:00 PM",
    tuesday: "7:00 AM - 7:00 PM",
    wednesday: "7:00 AM - 7:00 PM",
    thursday: "7:00 AM - 7:00 PM",
    friday: "7:00 AM - 5:00 PM",
    saturday: "8:00 AM - 1:00 PM",
    sunday: "Closed",
  } as Record<string, string>,

  // Timezone for open/closed status calculation
  timezone: "America/New_York",

  // Social Media (leave empty string if not used)
  social: {
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    youtube: "",
  },

  // Website
  url: "https://proactivetherapy.com",
  logo: "/images/logo-icon.png",

  // Booking
  bookingUrl: "/contact",
  showBookingButton: true,

  // Optional: Price range for schema.org ($, $$, $$$, $$$$)
  priceRange: "$$",
}

// Type export for use in other files
export type BusinessInfo = typeof businessInfo

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get Google Maps embed URL using Place ID or coordinates
 */
export function getGoogleMapsEmbedUrl(): string {
  const { maps, geo, address } = businessInfo

  // Prefer Place ID if available
  if (maps.placeId) {
    return `https://www.google.com/maps/embed/v1/place?key=${maps.apiKey || "AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"}&q=place_id:${maps.placeId}`
  }

  // Fall back to coordinates
  if (geo.latitude && geo.longitude) {
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${geo.longitude}!3d${geo.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sen!2sus!4v1600000000000!5m2!1sen!2sus`
  }

  // Fall back to address search
  const addressString = `${address.street}, ${address.city}, ${address.state} ${address.zip}`
  return `https://www.google.com/maps/embed/v1/place?key=${maps.apiKey || "AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"}&q=${encodeURIComponent(addressString)}`
}

/**
 * Get Google Maps directions URL
 */
export function getGoogleMapsDirectionsUrl(): string {
  const { maps, address } = businessInfo

  if (maps.placeId) {
    return `https://www.google.com/maps/dir/?api=1&destination_place_id=${maps.placeId}`
  }

  const addressString = `${address.street}, ${address.city}, ${address.state} ${address.zip}`
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressString)}`
}

/**
 * Get tel: link for phone number
 */
export function getPhoneLink(phone?: string): string {
  const phoneNumber = phone || businessInfo.phone
  return `tel:${phoneNumber.replace(/[^0-9+]/g, "")}`
}

/**
 * Get mailto: link for email
 */
export function getEmailLink(): string {
  return `mailto:${businessInfo.email}`
}

/**
 * Get formatted full address string
 */
export function getFullAddress(): string {
  const { address } = businessInfo
  const parts = [address.street]
  if (address.area) parts.push(address.area)
  parts.push(`${address.city}, ${address.state} ${address.zip}`)
  return parts.join(", ")
}
