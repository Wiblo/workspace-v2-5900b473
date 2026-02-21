/**
 * Testimonials data - customer reviews and ratings.
 * Used by: TestimonialsSection component (includes Review JSON-LD schema)
 */

export interface Testimonial {
  id: string
  name: string
  text: string
  rating: number
  role?: string
  avatar?: string
  date?: string
  source?: "google" | "facebook" | "yelp" | "website"
  isGoogleVerified?: boolean
}

export interface GoogleRating {
  average: number
  count: number
  url: string
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah M.",
    text: "After my knee surgery, Proactive Therapy got me back on my feet faster than I expected. The team created a recovery plan that actually worked, and they kept me motivated every step of the way.",
    rating: 5,
    source: "google",
    isGoogleVerified: true,
    date: "2 weeks ago",
  },
  {
    id: "2",
    name: "James P.",
    text: "I've been dealing with chronic back pain for years. The therapists here finally helped me understand why I was in pain and gave me tools to manage it. I'm more active now than I've been in a decade.",
    rating: 5,
    source: "google",
    isGoogleVerified: true,
    date: "1 month ago",
  },
  {
    id: "3",
    name: "Michelle K.",
    text: "As a runner, I was devastated when I tore my hamstring. The sports physio team at Proactive Therapy not only got me running again but helped me fix the underlying issues that caused the injury.",
    rating: 5,
    source: "google",
    isGoogleVerified: true,
    date: "1 month ago",
  },
  {
    id: "4",
    name: "David R.",
    text: "Professional, knowledgeable, and genuinely caring. Every session is focused and productive. I always leave feeling better than when I walked in. The best physio practice I've been to.",
    rating: 5,
    source: "google",
    isGoogleVerified: true,
    date: "2 months ago",
  },
  {
    id: "5",
    name: "Lisa T.",
    text: "The dry needling treatment here has been a game changer for my shoulder tension. The therapists take the time to explain everything and make sure you're comfortable throughout.",
    rating: 4,
    source: "google",
    isGoogleVerified: true,
    date: "3 months ago",
  },
]

export const googleRating: GoogleRating = {
  average: 4.8,
  count: 127,
  url: "https://g.page/r/proactive-therapy",
}

// ============================================================================
// Helper Functions
// ============================================================================

export function getAllTestimonials(): Testimonial[] {
  return testimonials
}

export function getTestimonialsPreview(count: number = 3): Testimonial[] {
  return testimonials.slice(0, count)
}

export function getGoogleReviews(): Testimonial[] {
  return testimonials.filter((t) => t.source === "google" || t.isGoogleVerified)
}

export function getAverageRating(): number {
  if (testimonials.length === 0) return 0
  const total = testimonials.reduce((sum, t) => sum + t.rating, 0)
  return Math.round((total / testimonials.length) * 10) / 10
}

export function getTestimonialCount(): number {
  return testimonials.length
}
