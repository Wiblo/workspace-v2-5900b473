/**
 * JSON-LD structured data utilities for SEO.
 * Generates schema.org structured data for search engines.
 *
 * Note: LocalBusiness schema is built inline in app/layout.tsx
 * This file provides helpers for page-level schemas (Service, Breadcrumb).
 */

import { businessInfo } from "@/lib/data/business-info"

// ============================================================================
// JSON-LD Component
// ============================================================================

interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>
}

/**
 * Renders a JSON-LD script tag with structured data.
 * Use this component in pages that need additional schemas.
 *
 * @example
 * <JsonLd data={generateServiceSchema(service)} />
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
// Schema Generators
// ============================================================================

/**
 * Generate Service schema for individual service pages.
 * Add this to service detail pages (/services/[slug]).
 *
 * @see https://schema.org/Service
 */
export function generateServiceSchema(service: {
  name: string
  description: string
  price?: string
  duration?: string
  slug: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "LocalBusiness",
      name: businessInfo.name,
      url: businessInfo.url,
    },
    url: `${businessInfo.url}/services/${service.slug}`,
    areaServed: {
      "@type": "City",
      name: businessInfo.address.city,
    },
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

/**
 * Generate BreadcrumbList schema for navigation.
 * Add this to pages with breadcrumb navigation.
 *
 * @see https://schema.org/BreadcrumbList
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
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
