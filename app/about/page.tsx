import type { Metadata } from "next"
import {
  AboutFullSection,
  AboutFeatures,
  GallerySection,
} from "@/components/sections"
import { businessInfo } from "@/lib/data/business-info"

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn more about ${businessInfo.name} and our commitment to providing exceptional service.`,
  openGraph: {
    title: `About Us | ${businessInfo.name}`,
    description: `Learn more about ${businessInfo.name} and our commitment to providing exceptional service.`,
  },
}

/**
 * About page composed of sections.
 * To customize content, edit the individual section components in components/sections/
 */
export default function AboutPage() {
  return (
    <>
      <AboutFullSection />
      <AboutFeatures />
      <GallerySection />
    </>
  )
}
