import type { Metadata } from "next"
import { businessInfo } from "@/lib/data/business-info"
import { ContactSection } from "@/components/sections/contact/ContactSection"

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${businessInfo.name}. Book an appointment, ask a question, or visit our clinic.`,
}

export default function ContactPage() {
  return <ContactSection />
}
