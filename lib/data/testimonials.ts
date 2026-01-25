/**
 * Testimonials data - customer reviews and ratings.
 * Used by: TestimonialsSection component (includes Review JSON-LD schema)
 *
 * The TestimonialsSection component automatically generates JSON-LD structured data
 * from this array, so search engines can display star ratings in results.
 */

export interface Testimonial {
  /** Unique identifier */
  id: string
  /** Customer's name */
  name: string
  /** The testimonial text/quote */
  text: string
  /** Rating out of 5 (e.g., 5, 4.5, 4) */
  rating: number
  /** Optional: customer's role, title, or location */
  role?: string
  /** Optional: customer's photo URL */
  avatar?: string
  /** Optional: date of the review */
  date?: string
  /** Optional: source of the review */
  source?: "google" | "facebook" | "yelp" | "website"
  /** Optional: whether this is a verified Google review */
  isGoogleVerified?: boolean
}

/** Google Business rating info */
export interface GoogleRating {
  /** Average rating (e.g., 4.8) */
  average: number
  /** Total number of reviews */
  count: number
  /** URL to Google Business page */
  url: string
}

/**
 * Customer testimonials.
 * Edit this array to add, remove, or modify testimonials.
 *
 * Tips:
 * - Use real customer feedback when possible
 * - Include specific details about their experience
 * - Vary the length of quotes for visual interest
 * - Higher ratings (4-5 stars) are more impactful
 */
export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah M.",
    text: "Excellent service from start to finish. The staff was professional and friendly, and I saw real results after just a few sessions. Highly recommend to anyone looking for quality care.",
    rating: 5,
    source: "google",
    isGoogleVerified: true,
    date: "2 weeks ago",
  },
  {
    id: "2",
    name: "James P.",
    text: "I've been coming here for months now and the improvement in my condition has been remarkable. The team really takes the time to understand your needs and create a personalized treatment plan.",
    rating: 5,
    source: "google",
    isGoogleVerified: true,
    date: "1 month ago",
  },
  {
    id: "3",
    name: "Michelle K.",
    text: "After trying several other places, I finally found a practice that actually listens. They explained everything clearly and I felt comfortable throughout the entire process.",
    rating: 5,
    source: "google",
    isGoogleVerified: true,
    date: "1 month ago",
  },
  {
    id: "4",
    name: "David R.",
    text: "Great experience overall. The facility is clean and modern, appointments run on time, and the results speak for themselves. Will definitely continue my treatment here.",
    rating: 5,
    source: "google",
    isGoogleVerified: true,
    date: "2 months ago",
  },
  {
    id: "5",
    name: "Lisa T.",
    text: "Very impressed with the level of care and attention. They genuinely care about their patients and it shows in everything they do.",
    rating: 4,
    source: "google",
    isGoogleVerified: true,
    date: "3 months ago",
  },
]

/**
 * Google Business rating info.
 * Update this with your actual Google Business data.
 */
export const googleRating: GoogleRating = {
  average: 4.8,
  count: 127,
  url: "https://g.page/r/your-google-business-url",
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get all testimonials.
 */
export function getAllTestimonials(): Testimonial[] {
  return testimonials
}

/**
 * Get a subset of testimonials (e.g., for homepage).
 */
export function getTestimonialsPreview(count: number = 3): Testimonial[] {
  return testimonials.slice(0, count)
}

/**
 * Get only Google-verified reviews.
 */
export function getGoogleReviews(): Testimonial[] {
  return testimonials.filter((t) => t.source === "google" || t.isGoogleVerified)
}

/**
 * Calculate average rating from all testimonials.
 * Used for AggregateRating JSON-LD schema.
 */
export function getAverageRating(): number {
  if (testimonials.length === 0) return 0
  const total = testimonials.reduce((sum, t) => sum + t.rating, 0)
  return Math.round((total / testimonials.length) * 10) / 10 // Round to 1 decimal
}

/**
 * Get total number of testimonials.
 * Used for AggregateRating JSON-LD schema.
 */
export function getTestimonialCount(): number {
  return testimonials.length
}
