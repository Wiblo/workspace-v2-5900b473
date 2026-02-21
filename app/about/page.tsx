import type { Metadata } from "next"
import { businessInfo } from "@/lib/data/business-info"
import { AboutFullSection } from "@/components/sections/about/AboutFullSection"
import { AboutFeatures } from "@/components/sections/features/AboutFeatures"
import { GallerySection } from "@/components/sections/gallery/GallerySection"

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${businessInfo.name} — our mission, values, and commitment to evidence-based physiotherapy care.`,
  openGraph: {
    title: `About Us | ${businessInfo.name}`,
    description: `Learn about ${businessInfo.name} — our mission, values, and commitment to evidence-based physiotherapy care.`,
  },
}

export default function AboutPage() {
  return (
    <>
      <AboutFullSection />
      <AboutFeatures />
      <GallerySection />
    </>
  )
}
