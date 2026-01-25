"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Container } from "@/components/layout/Container"
import {
  testimonials as defaultTestimonials,
  getAverageRating,
  getTestimonialCount,
  type Testimonial,
} from "@/lib/data/testimonials"

export interface TestimonialsSectionProps {
  /** Section title */
  title?: string
  /** Section subtitle */
  subtitle?: string
  /** Custom testimonials (defaults to lib/data/testimonials.ts) */
  items?: Testimonial[]
  /** Overall rating info to display in header */
  overallRating?: {
    average: number
    count: number
  }
  /** Additional CSS classes */
  className?: string
}

/**
 * Google logo SVG component
 */
function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
        fill="#FFC107"
      />
      <path
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
        fill="#EA4335"
      />
      <path
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
        fill="#34A853"
      />
      <path
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
        fill="#4285F4"
      />
    </svg>
  )
}

/**
 * Facebook logo SVG component
 */
function FacebookLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
        fill="#1877F2"
      />
    </svg>
  )
}

/**
 * Source badge component - shows the appropriate badge based on review source
 */
function SourceBadge({ testimonial }: { testimonial: Testimonial }) {
  if (testimonial.source === "google" || testimonial.isGoogleVerified) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <GoogleLogo className="h-3.5 w-3.5" />
        <span>{testimonial.date || "Google Review"}</span>
        {testimonial.isGoogleVerified && (
          <CheckCircle className="h-3.5 w-3.5 text-blue-500" />
        )}
      </div>
    )
  }

  if (testimonial.source === "facebook") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <FacebookLogo className="h-3.5 w-3.5" />
        <span>{testimonial.date || "Facebook Review"}</span>
      </div>
    )
  }

  // Website/default reviews
  if (testimonial.role) {
    return <p className="text-xs text-muted-foreground">{testimonial.role}</p>
  }

  return null
}

/**
 * Testimonials section showing reviews with source-specific styling.
 * Google reviews show Google logo + verified badge.
 * Facebook reviews show Facebook logo.
 * Website reviews show the patient's role.
 */
export function TestimonialsSection({
  title = "What Our Patients Say",
  subtitle = "Hear from patients who have experienced the difference at our clinic.",
  items,
  overallRating,
  className,
}: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const displayedTestimonials = items || defaultTestimonials

  // Calculate rating info
  const avgRating = overallRating?.average || getAverageRating()
  const reviewCount = overallRating?.count || getTestimonialCount()

  // Compute directly without state
  const showArrows = displayedTestimonials.length > 3

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? Math.max(0, displayedTestimonials.length - 3)
        : Math.max(0, prevIndex - 1)
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= displayedTestimonials.length - 3 ? 0 : prevIndex + 1
    )
  }

  const canGoPrevious = currentIndex > 0
  const canGoNext = currentIndex < displayedTestimonials.length - 3

  // Get visible testimonials (3 at a time on desktop, 1 on mobile)
  const visibleTestimonials = displayedTestimonials.slice(
    currentIndex,
    currentIndex + 3
  )

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <Container>
        <div className="overflow-hidden rounded-3xl bg-secondary/50 px-6 py-12 md:px-12 md:py-16">
          {/* Header */}
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground text-balance md:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>

            {/* Overall Rating Badge */}
            <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-background px-5 py-2.5 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">
                  {avgRating.toFixed(1)}
                </span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-4 w-4",
                        star <= Math.round(avgRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-muted text-muted"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="relative">
            <div className="grid grid-cols-1 gap-6 transition-transform duration-300 ease-in-out md:grid-cols-2 lg:grid-cols-3">
              {visibleTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex flex-col rounded-2xl bg-background p-6 shadow-sm"
                >
                  {/* Customer Info */}
                  <div className="flex items-center gap-3">
                    {testimonial.avatar ? (
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={44}
                        height={44}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {testimonial.name
                          .split(" ")
                          .filter((n) => n.length > 0)
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        {testimonial.name}
                      </p>
                      <SourceBadge testimonial={testimonial} />
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="mt-4 flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-5 w-5",
                          star <= testimonial.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-muted text-muted"
                        )}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="mt-4 flex-1 text-base leading-relaxed text-foreground">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {showArrows && (
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={goToPrevious}
                  disabled={!canGoPrevious}
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all",
                    canGoPrevious
                      ? "border-border text-foreground hover:border-primary hover:bg-primary/5"
                      : "cursor-not-allowed border-border/50 text-muted-foreground/50"
                  )}
                  aria-label="Previous reviews"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={goToNext}
                  disabled={!canGoNext}
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all",
                    canGoNext
                      ? "border-border text-foreground hover:border-primary hover:bg-primary/5"
                      : "cursor-not-allowed border-border/50 text-muted-foreground/50"
                  )}
                  aria-label="Next reviews"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
