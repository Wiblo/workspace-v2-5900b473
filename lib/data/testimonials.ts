/**
 * Testimonials data - customer reviews and ratings.
 * Used by: TestimonialsSection component (includes Review JSON-LD schema)
 *
 * The TestimonialsSection component automatically generates JSON-LD structured data
 * from this array, so search engines can display star ratings in results.
 */

export interface Testimonial {
  /** Customer's name */
  name: string
  /** The testimonial text/quote */
  quote: string
  /** Rating out of 5 (e.g., 5, 4.5, 4) */
  rating: number
  /** Optional: customer's role, title, or location */
  role?: string
  /** Optional: customer's photo URL */
  image?: string
  /** Optional: date of the review (ISO format: "2024-01-15") */
  date?: string
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
    name: "Customer Name One",
    quote:
      "Share what the customer said about your business. Include specific details about their experience and the results they achieved.",
    rating: 5,
    role: "Customer",
  },
  {
    name: "Customer Name Two",
    quote:
      "Another customer testimonial goes here. Highlight different aspects of your service to show variety in what customers appreciate.",
    rating: 5,
    role: "Customer",
  },
  {
    name: "Customer Name Three",
    quote:
      "A third testimonial that emphasizes a unique benefit or experience. Testimonials build trust and help potential customers make decisions.",
    rating: 5,
    role: "Customer",
  },
  {
    name: "Customer Name Four",
    quote:
      "Include testimonials that address common concerns or highlight exceptional service. Real stories resonate with potential customers.",
    rating: 4,
    role: "Customer",
  },
]

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
