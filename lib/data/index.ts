// Business Information
export { businessInfo } from "./business-info"
export type { BusinessInfo } from "./business-info"

// Navigation
export { navItems, getNavItems } from "./navigation"
export type { NavItem } from "./navigation"

// Services
export {
  services,
  getServiceBySlug,
  getFeaturedServices,
  getAllServices,
  getAllServiceSlugs,
} from "./services"
export type { Service } from "./services"

// FAQs
export { faqs, getAllFAQs, getFAQsPreview } from "./faqs"
export type { FAQ } from "./faqs"

// Testimonials
export {
  testimonials,
  getAllTestimonials,
  getTestimonialsPreview,
  getAverageRating,
  getTestimonialCount,
} from "./testimonials"
export type { Testimonial } from "./testimonials"
