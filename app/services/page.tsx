import type { Metadata } from "next"
import { ServicesHero, ServicesGrid } from "@/components/sections"
import { businessInfo } from "@/lib/data/business-info"

export const metadata: Metadata = {
  title: "Our Services",
  description: `Explore our range of professional services at ${businessInfo.name}.`,
}

/**
 * Services listing page.
 * Services are pulled from lib/data/services.ts
 */
export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesGrid />
    </>
  )
}
