/**
 * Services data - defines all services offered by the business.
 * Used by: FeaturedServices, ServicesGrid, ServiceCard, /services/[slug] pages
 *
 * This data drives:
 * - Service cards on homepage (FeaturedServices)
 * - Services listing page (ServicesGrid)
 * - Individual service detail pages (ServiceDetailSection)
 * - Service JSON-LD schema
 */

export interface Service {
  /** URL-friendly identifier (e.g., "deep-tissue-massage") */
  slug: string
  /** Display name */
  name: string
  /** Short description for cards (1-2 sentences) */
  shortDescription: string
  /** Full description for detail page (can be multiple paragraphs) */
  description: string
  /** Lucide icon name (e.g., "Heart", "Zap", "Clock") */
  icon?: string
  /** Image path or URL */
  image?: string
  /** Alt text for image */
  imageAlt?: string
  /** Show on homepage featured section */
  featured?: boolean
  /** Duration (e.g., "60 minutes") */
  duration?: string
  /** Price (e.g., "$80" or "From $50") */
  price?: string
  /** List of benefits/features */
  benefits?: string[]
  /** Who this service is ideal for */
  idealFor?: string[]
}

/**
 * All services offered by the business.
 * Edit this array to add, remove, or modify services.
 */
export const services: Service[] = [
  {
    slug: "service-one",
    name: "Service One",
    shortDescription:
      "Brief description of this service. Explain the key benefit in one or two sentences.",
    description:
      "Full description of Service One. Explain what the service includes, who it's for, and what benefits customers can expect.\n\nThis text appears on the individual service page. You can include multiple paragraphs to provide comprehensive information about the service.",
    icon: "Star",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
    imageAlt: "Service one image description",
    featured: true,
    duration: "60 min",
    price: "$100",
    benefits: [
      "First benefit of this service",
      "Second benefit of this service",
      "Third benefit of this service",
      "Fourth benefit of this service",
    ],
    idealFor: [
      "First time clients",
      "Specific condition",
      "Another use case",
    ],
  },
  {
    slug: "service-two",
    name: "Service Two",
    shortDescription:
      "Brief description of this service. Explain the key benefit in one or two sentences.",
    description:
      "Full description of Service Two. Explain what the service includes, who it's for, and what benefits customers can expect.\n\nThis text appears on the individual service page.",
    icon: "Heart",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop",
    imageAlt: "Service two image description",
    featured: true,
    duration: "45 min",
    price: "$80",
    benefits: [
      "First benefit of this service",
      "Second benefit of this service",
      "Third benefit of this service",
    ],
    idealFor: [
      "Returning clients",
      "Maintenance care",
    ],
  },
  {
    slug: "service-three",
    name: "Service Three",
    shortDescription:
      "Brief description of this service. Explain the key benefit in one or two sentences.",
    description:
      "Full description of Service Three. Explain what the service includes, who it's for, and what benefits customers can expect.",
    icon: "Zap",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=600&fit=crop",
    imageAlt: "Service three image description",
    featured: true,
    duration: "30 min",
    price: "$60",
    benefits: [
      "First benefit of this service",
      "Second benefit of this service",
    ],
  },
  {
    slug: "service-four",
    name: "Service Four",
    shortDescription:
      "Brief description of this service. Explain the key benefit in one or two sentences.",
    description:
      "Full description of Service Four. Explain what the service includes, who it's for, and what benefits customers can expect.",
    icon: "Shield",
    image: "https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=800&h=600&fit=crop",
    imageAlt: "Service four image description",
    featured: false,
    duration: "90 min",
    price: "$150",
  },
]

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get a single service by its slug.
 * Returns undefined if not found.
 */
export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug)
}

/**
 * Get all services marked as featured.
 * Used for homepage featured services section.
 */
export function getFeaturedServices(): Service[] {
  return services.filter((service) => service.featured)
}

/**
 * Get all services.
 * Used for services listing page.
 */
export function getAllServices(): Service[] {
  return services
}

/**
 * Get all service slugs.
 * Used for generateStaticParams in dynamic routes.
 */
export function getAllServiceSlugs(): string[] {
  return services.map((service) => service.slug)
}
