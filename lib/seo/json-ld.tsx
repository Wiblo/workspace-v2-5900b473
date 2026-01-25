/**
 * JSON-LD Structured Data Utilities
 *
 * Centralized schema generators for SEO. All schemas pull from business-info.ts
 * to ensure consistency across the site.
 *
 * Usage:
 * - LocalBusiness: app/layout.tsx (site-wide)
 * - FAQPage: FAQSection component (when FAQs are displayed)
 * - Review/AggregateRating: TestimonialsSection (when reviews are displayed)
 * - Service: Service detail pages
 * - BreadcrumbList: Pages with breadcrumb navigation
 *
 * @see https://schema.org
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */

import { businessInfo } from "@/lib/data/business-info"
import type { FAQ } from "@/lib/data/faqs"
import type { Testimonial } from "@/lib/data/testimonials"

// ============================================================================
// JSON-LD Component
// ============================================================================

interface JsonLdProps {
  data: Record<string, unknown>
}

/**
 * Renders a JSON-LD script tag with structured data.
 *
 * @example
 * <JsonLd data={generateLocalBusinessSchema()} />
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// ============================================================================
// LocalBusiness Schema (Site-wide)
// ============================================================================

/**
 * Generate LocalBusiness schema for the root layout.
 * This appears on every page and describes the business.
 *
 * @see https://schema.org/LocalBusiness
 */
export function generateLocalBusinessSchema() {
  // Build social links array from non-empty social profiles
  const sameAs = Object.values(businessInfo.social).filter(Boolean)

  // Build opening hours from business hours
  const openingHoursSpecification = Object.entries(businessInfo.hours)
    .filter(([, hours]) => hours.toLowerCase() !== "closed")
    .filter(([, hours]) => hours.includes(" - "))
    .map(([day, hours]) => {
      const [opens, closes] = hours.split(" - ")
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
        opens,
        closes,
      }
    })

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: businessInfo.name,
    description: businessInfo.description,
    telephone: businessInfo.phone,
    email: businessInfo.email,
    url: businessInfo.url,
    logo: `${businessInfo.url}${businessInfo.logo}`,
    image: `${businessInfo.url}${businessInfo.logo}`,
    priceRange: businessInfo.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: businessInfo.address.street,
      addressLocality: businessInfo.address.city,
      addressRegion: businessInfo.address.state,
      postalCode: businessInfo.address.zip,
      addressCountry: businessInfo.address.country,
    },
    // Only include geo if coordinates are set
    ...(businessInfo.geo.latitude && businessInfo.geo.longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: businessInfo.geo.latitude,
            longitude: businessInfo.geo.longitude,
          },
        }
      : {}),
    // Only include sameAs if there are social links
    ...(sameAs.length > 0 ? { sameAs } : {}),
    // Only include hours if there are open days
    ...(openingHoursSpecification.length > 0
      ? { openingHoursSpecification }
      : {}),
  }
}

// ============================================================================
// FAQPage Schema
// ============================================================================

/**
 * Generate FAQPage schema for FAQ sections.
 * Use this in the FAQSection component.
 *
 * @see https://schema.org/FAQPage
 * @see https://developers.google.com/search/docs/appearance/structured-data/faqpage
 */
export function generateFAQSchema(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

// ============================================================================
// Review & AggregateRating Schema
// ============================================================================

/**
 * Generate Review schema with AggregateRating for testimonials.
 * Use this in the TestimonialsSection component.
 *
 * @see https://schema.org/Review
 * @see https://schema.org/AggregateRating
 * @see https://developers.google.com/search/docs/appearance/structured-data/review-snippet
 */
export function generateReviewSchema(testimonials: Testimonial[]) {
  if (testimonials.length === 0) {
    return null
  }

  // Calculate aggregate rating
  const totalRating = testimonials.reduce((sum, t) => sum + t.rating, 0)
  const averageRating = Math.round((totalRating / testimonials.length) * 10) / 10

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: businessInfo.name,
    url: businessInfo.url,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: averageRating.toFixed(1),
      reviewCount: testimonials.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: testimonials.map((t) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: t.name,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: t.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: t.text,
      ...(t.date ? { datePublished: t.date } : {}),
    })),
  }
}

// ============================================================================
// Service Schema
// ============================================================================

export interface ServiceSchemaInput {
  name: string
  description: string
  slug: string
  price?: string
  duration?: string
  image?: string
}

/**
 * Generate Service schema for service detail pages.
 * Use this in /services/[slug]/page.tsx.
 *
 * @see https://schema.org/Service
 */
export function generateServiceSchema(service: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: `${businessInfo.url}/services/${service.slug}`,
    provider: {
      "@type": "LocalBusiness",
      name: businessInfo.name,
      url: businessInfo.url,
    },
    areaServed: {
      "@type": "City",
      name: businessInfo.address.city,
    },
    // Only include image if provided
    ...(service.image
      ? {
          image: service.image.startsWith("http")
            ? service.image
            : `${businessInfo.url}${service.image}`,
        }
      : {}),
    // Only include offers if price is provided
    ...(service.price
      ? {
          offers: {
            "@type": "Offer",
            price: service.price.replace(/[^0-9.]/g, ""),
            priceCurrency: "USD",
          },
        }
      : {}),
  }
}

// ============================================================================
// Breadcrumb Schema
// ============================================================================

export interface BreadcrumbItem {
  name: string
  url: string
}

/**
 * Generate BreadcrumbList schema for navigation.
 * Use this on pages with breadcrumb navigation.
 *
 * @see https://schema.org/BreadcrumbList
 * @see https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${businessInfo.url}${item.url}`,
    })),
  }
}

// ============================================================================
// WebSite Schema (Optional - for sitelinks search box)
// ============================================================================

/**
 * Generate WebSite schema with potential search action.
 * Add to layout if you want sitelinks search box in Google.
 *
 * @see https://schema.org/WebSite
 * @see https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox
 */
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: businessInfo.name,
    url: businessInfo.url,
  }
}
