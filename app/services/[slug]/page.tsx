import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { HeroWithImage, ServiceDetailSection } from "@/components/sections"
import { getServiceBySlug, getAllServiceSlugs } from "@/lib/data/services"
import { businessInfo } from "@/lib/data/business-info"

// =============================================================================
// TYPES
// Next.js 16+ requires params to be a Promise
// =============================================================================
type Props = {
  params: Promise<{ slug: string }>
}

// =============================================================================
// STATIC PARAMS
// Pre-generate pages for all services at build time.
// This creates /services/service-one, /services/service-two, etc.
// =============================================================================
export async function generateStaticParams() {
  const slugs = getAllServiceSlugs()
  return slugs.map((slug) => ({ slug }))
}

// =============================================================================
// METADATA
// Dynamic metadata based on the service being viewed.
// =============================================================================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    return {
      title: "Service Not Found",
    }
  }

  return {
    title: `${service.name} | ${businessInfo.name}`,
    description: service.shortDescription,
    openGraph: {
      title: service.name,
      description: service.shortDescription,
      images: service.image ? [{ url: service.image }] : undefined,
    },
  }
}

// =============================================================================
// PAGE COMPONENT
// Dynamic service detail page using [slug] parameter.
//
// How it works:
// 1. URL like /services/service-one extracts slug = "service-one"
// 2. getServiceBySlug() finds the matching service in lib/data/services.ts
// 3. If not found, notFound() shows the 404 page
// 4. Service data is passed to ServiceDetailSection
//
// To add a new service:
// 1. Add it to the services array in lib/data/services.ts
// 2. The page is automatically created at /services/[your-slug]
// =============================================================================
export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  // If service not found, show 404
  if (!service) {
    notFound()
  }

  // Strip the icon field before passing to client component
  // (React components can't be serialized across server/client boundary)
  const { icon: _icon, ...serviceData } = service

  // Build JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "LocalBusiness",
      name: businessInfo.name,
      url: businessInfo.url,
    },
    areaServed: {
      "@type": "City",
      name: businessInfo.address.city,
    },
    ...(service.price && {
      offers: {
        "@type": "Offer",
        price: service.price.replace(/[^0-9.]/g, ""),
        priceCurrency: "USD", // Update for your currency
      },
    }),
  }

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero with service image */}
      <HeroWithImage
        subtitle="Our Services"
        title={service.name}
        backgroundImage={
          service.image ||
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop"
        }
        backgroundImageAlt={service.imageAlt || service.name}
        ctaText="Book Now"
        ctaUrl={businessInfo.bookingUrl || "/contact"}
        size="small"
      />

      {/* Service Detail Section */}
      <ServiceDetailSection service={serviceData} />
    </>
  )
}
