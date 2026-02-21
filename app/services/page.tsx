import type { Metadata } from "next"
import { businessInfo } from "@/lib/data/business-info"
import { ServicesHero } from "@/components/sections/hero/ServicesHero"
import { ServicesGrid } from "@/components/sections/services/ServicesGrid"

export const metadata: Metadata = {
  title: "Our Services",
  description: `Explore physiotherapy services at ${businessInfo.name}. Sports physio, manual therapy, rehabilitation, chronic pain management, and dry needling.`,
}

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesGrid />
    </>
  )
}
