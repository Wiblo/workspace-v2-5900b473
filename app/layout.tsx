import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { businessInfo } from "@/lib/data/business-info"

const geistSans = Geist({
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // LocalBusiness JSON-LD schema - appears on every page
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: businessInfo.name,
    description: businessInfo.description,
    telephone: businessInfo.phone,
    email: businessInfo.email,
    url: businessInfo.url,
    image: businessInfo.logo,
    priceRange: businessInfo.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: businessInfo.address.street,
      addressLocality: businessInfo.address.city,
      addressRegion: businessInfo.address.state,
      postalCode: businessInfo.address.zip,
      addressCountry: businessInfo.address.country,
    },
    ...(businessInfo.geo.latitude && businessInfo.geo.longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: businessInfo.geo.latitude,
            longitude: businessInfo.geo.longitude,
          },
        }
      : {}),
    openingHoursSpecification: Object.entries(businessInfo.hours)
      .filter(([, hours]) => hours.toLowerCase() !== "closed")
      .map(([day, hours]) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
        opens: hours.split(" - ")[0],
        closes: hours.split(" - ")[1],
      })),
  }

  return (
    <html lang="en" className={geistSans.className}>
      <body className={`${geistMono.variable} antialiased`}>
        {/* LocalBusiness JSON-LD for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />

        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
