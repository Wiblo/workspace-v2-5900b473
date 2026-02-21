"use client"

import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Container } from "@/components/layout/Container"
import { SectionWrapper } from "@/components/layout/SectionWrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  businessInfo,
  getFullAddress,
  getPhoneLink,
  getEmailLink,
} from "@/lib/data/business-info"

export interface ContactSectionProps {
  className?: string
}

const contactDetails = [
  {
    icon: Phone,
    label: "Phone",
    value: businessInfo.phone,
    href: getPhoneLink(),
  },
  {
    icon: Mail,
    label: "Email",
    value: businessInfo.email,
    href: getEmailLink(),
  },
  {
    icon: MapPin,
    label: "Address",
    value: getFullAddress(),
    href: undefined,
  },
]

const businessHours = Object.entries(businessInfo.hours).map(([day, hours]) => ({
  day: day.charAt(0).toUpperCase() + day.slice(1),
  hours,
}))

export function ContactSection({ className }: ContactSectionProps) {
  return (
    <SectionWrapper className={cn("bg-background", className)}>
      <Container>
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h1 className="font-heading text-3xl font-bold text-balance text-foreground md:text-4xl lg:text-5xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Have a question or ready to book an appointment? Reach out to us and
            we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left Column - Contact Info */}
          <div className="flex flex-col gap-8">
            {/* Contact Details */}
            <div className="flex flex-col gap-6">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Contact Information
              </h2>
              <div className="flex flex-col gap-4">
                {contactDetails.map((detail) => (
                  <div key={detail.label} className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <detail.icon
                        className="size-5 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {detail.label}
                      </p>
                      {detail.href ? (
                        <a
                          href={detail.href}
                          className="text-foreground transition-colors hover:text-primary"
                        >
                          {detail.value}
                        </a>
                      ) : (
                        <p className="text-foreground">{detail.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Clock
                    className="size-5 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <h2 className="font-heading text-xl font-semibold text-foreground">
                  Business Hours
                </h2>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <dl className="flex flex-col gap-3">
                  {businessHours.map(({ day, hours }) => (
                    <div
                      key={day}
                      className="flex items-center justify-between"
                    >
                      <dt className="text-sm font-medium text-muted-foreground">
                        {day}
                      </dt>
                      <dd
                        className={cn(
                          "text-sm",
                          hours === "Closed"
                            ? "text-muted-foreground"
                            : "text-foreground"
                        )}
                      >
                        {hours}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="rounded-lg border border-border bg-card p-6 md:p-8">
            <h2 className="mb-6 font-heading text-xl font-semibold text-foreground">
              Send Us a Message
            </h2>
            <form action="" className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-phone">
                  Phone <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  placeholder="(555) 000-0000"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-message">
                  Message <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="contact-message"
                  name="message"
                  placeholder="How can we help you?"
                  className="min-h-32"
                  required
                />
              </div>

              <Button type="submit" size="lg" className="mt-2 w-full">
                Send Message
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                We&apos;ll get back to you within 24 hours.
              </p>
            </form>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  )
}
