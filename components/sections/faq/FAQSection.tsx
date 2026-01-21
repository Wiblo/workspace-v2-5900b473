"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Container } from "@/components/layout/Container"
import { SectionWrapper } from "@/components/layout/SectionWrapper"
import { faqs as defaultFaqs, type FAQ } from "@/lib/data/faqs"
import { businessInfo } from "@/lib/data/business-info"
import { JsonLd, generateFAQSchema } from "@/lib/seo/json-ld"

export interface FAQSectionProps {
  /** Section title */
  title?: string
  /** Section subtitle */
  subtitle?: string
  /** Custom FAQ items (defaults to lib/data/faqs.ts) */
  items?: FAQ[]
  /** Show contact CTA at bottom */
  showContactCTA?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * FAQ section with accordion and built-in JSON-LD schema.
 * Automatically generates FAQPage structured data for SEO.
 *
 * @example
 * // Using default FAQs from lib/data/faqs.ts
 * <FAQSection />
 *
 * @example
 * // With custom FAQs
 * <FAQSection
 *   title="Common Questions"
 *   items={[
 *     { id: "1", question: "How does it work?", answer: "..." },
 *     { id: "2", question: "What's included?", answer: "..." },
 *   ]}
 * />
 */
export function FAQSection({
  title = "Frequently Asked Questions",
  subtitle = "Find answers to common questions about our services and what to expect.",
  items,
  showContactCTA = true,
  className,
}: FAQSectionProps) {
  const faqs = items || defaultFaqs
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      newOpenItems.add(id)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <SectionWrapper className={cn("bg-background", className)}>
      {/* JSON-LD Schema */}
      <JsonLd data={generateFAQSchema(faqs)} />

      <Container>
        <div className="mx-auto max-w-4xl">
          {/* Section Header */}
          <div className="mb-12 text-center md:text-left">
            <h2 className="font-heading mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              {title}
            </h2>
            {subtitle && (
              <p className="max-w-3xl text-lg text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

          {/* FAQ Accordion List */}
          <div className="divide-y divide-border border-t border-border">
            {faqs.map((item) => {
              const isOpen = openItems.has(item.id)

              return (
                <div key={item.id} className="group">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="flex w-full items-center justify-between py-6 text-left transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.id}`}
                  >
                    <span className="text-base font-medium text-foreground group-hover:text-primary md:text-lg">
                      {item.question}
                    </span>
                    <div
                      className={cn(
                        "ml-4 flex-shrink-0 transition-[transform,color] duration-200",
                        isOpen ? "rotate-180 text-primary" : "text-muted-foreground"
                      )}
                      aria-hidden="true"
                    >
                      <ChevronDown className="h-5 w-5" />
                    </div>
                  </button>

                  <div
                    className={cn(
                      "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                    id={`faq-answer-${item.id}`}
                  >
                    <div className="pb-6 pr-12">
                      <p className="text-base leading-relaxed text-muted-foreground">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Contact CTA Card */}
          {showContactCTA && (
            <div className="mt-12 rounded-2xl bg-secondary/10 p-8 text-center">
              <h3 className="font-heading mb-2 text-xl font-semibold text-foreground">
                Still have questions?
              </h3>
              <p className="mb-6 text-muted-foreground">
                We&apos;re here to help. Contact us for personalized assistance.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <a
                  href={`tel:${businessInfo.phone.replace(/[^0-9+]/g, "")}`}
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Call Us: {businessInfo.phone}
                </a>
                <a
                  href={`mailto:${businessInfo.email}`}
                  className="inline-flex items-center justify-center rounded-lg border border-primary px-6 py-3 font-medium text-primary transition-colors hover:bg-secondary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Email Us
                </a>
              </div>
            </div>
          )}
        </div>
      </Container>
    </SectionWrapper>
  )
}
