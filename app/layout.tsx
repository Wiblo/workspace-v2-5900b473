import { Plus_Jakarta_Sans, DM_Sans, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { JsonLd, generateLocalBusinessSchema } from "@/lib/seo/json-ld"
import { generateRootMetadata } from "@/lib/seo/metadata"
import { WibloDesignBridge } from "@/components/wiblo-design-bridge"

const heading = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800"],
})

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata = generateRootMetadata()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <WibloDesignBridge />

        {/* Skip link for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to main content
        </a>

        {/* LocalBusiness JSON-LD for SEO */}
        <JsonLd data={generateLocalBusinessSchema()} />

        <Navbar />

        <main id="main-content">{children}</main>

        <Footer />
      </body>
    </html>
  )
}
