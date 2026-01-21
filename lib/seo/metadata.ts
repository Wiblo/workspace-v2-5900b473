/**
 * Metadata Generation Utilities
 *
 * Centralized metadata helpers for consistent SEO across all pages.
 * Uses Next.js Metadata API with OpenGraph and Twitter card support.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */

import type { Metadata } from "next"
import { businessInfo } from "@/lib/data/business-info"

// ============================================================================
// Types
// ============================================================================

export interface PageMetadataOptions {
  /** Page title (will be combined with site name) */
  title: string
  /** Page description for search results */
  description: string
  /** Path relative to site root (e.g., "/about", "/services/massage") */
  path?: string
  /** OpenGraph image URL (defaults to site logo) */
  image?: string
  /** OpenGraph image alt text */
  imageAlt?: string
  /** Prevent search engines from indexing this page */
  noIndex?: boolean
}

export interface ServiceMetadataOptions {
  /** Service name */
  name: string
  /** Service description */
  description: string
  /** Service slug */
  slug: string
  /** Service image URL */
  image?: string
}

// ============================================================================
// Page Metadata Generator
// ============================================================================

/**
 * Generate metadata for a standard page.
 *
 * @example
 * // app/about/page.tsx
 * export const metadata = generatePageMetadata({
 *   title: "About Us",
 *   description: "Learn about our team and approach.",
 *   path: "/about",
 * })
 */
export function generatePageMetadata({
  title,
  description,
  path = "",
  image,
  imageAlt,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = `${businessInfo.url}${path}`
  const imageUrl = image || `${businessInfo.url}${businessInfo.logo}`

  return {
    title,
    description,
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title,
      description,
      url,
      siteName: businessInfo.name,
      type: "website",
      images: [
        {
          url: imageUrl,
          alt: imageAlt || title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  }
}

// ============================================================================
// Service Page Metadata Generator
// ============================================================================

/**
 * Generate metadata for a service detail page.
 *
 * @example
 * // app/services/[slug]/page.tsx
 * export async function generateMetadata({ params }) {
 *   const service = getServiceBySlug(params.slug)
 *   return generateServiceMetadata({
 *     name: service.name,
 *     description: service.shortDescription,
 *     slug: service.slug,
 *     image: service.image,
 *   })
 * }
 */
export function generateServiceMetadata({
  name,
  description,
  slug,
  image,
}: ServiceMetadataOptions): Metadata {
  return generatePageMetadata({
    title: `${name} | ${businessInfo.name}`,
    description,
    path: `/services/${slug}`,
    image,
    imageAlt: name,
  })
}

// ============================================================================
// Homepage Metadata
// ============================================================================

/**
 * Generate metadata for the homepage.
 * Uses business tagline and description.
 *
 * @example
 * // app/page.tsx
 * export const metadata = generateHomeMetadata()
 */
export function generateHomeMetadata(): Metadata {
  return {
    title: `${businessInfo.name} | ${businessInfo.tagline}`,
    description: businessInfo.description,
    openGraph: {
      title: businessInfo.name,
      description: businessInfo.description,
      url: businessInfo.url,
      siteName: businessInfo.name,
      type: "website",
      images: [
        {
          url: `${businessInfo.url}${businessInfo.logo}`,
          alt: businessInfo.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: businessInfo.name,
      description: businessInfo.description,
      images: [`${businessInfo.url}${businessInfo.logo}`],
    },
    alternates: {
      canonical: businessInfo.url,
    },
  }
}

// ============================================================================
// Root Layout Metadata
// ============================================================================

/**
 * Generate base metadata for the root layout.
 * This sets defaults that pages can override.
 *
 * @example
 * // app/layout.tsx
 * export const metadata = generateRootMetadata()
 */
export function generateRootMetadata(): Metadata {
  return {
    title: {
      default: `${businessInfo.name} | ${businessInfo.tagline}`,
      template: `%s | ${businessInfo.name}`,
    },
    description: businessInfo.description,
    metadataBase: new URL(businessInfo.url),
    openGraph: {
      title: businessInfo.name,
      description: businessInfo.description,
      url: businessInfo.url,
      siteName: businessInfo.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
  }
}
