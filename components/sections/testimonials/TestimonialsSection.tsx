import Image from "next/image"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Container } from "@/components/layout/Container"
import { SectionWrapper } from "@/components/layout/SectionWrapper"
import {
  testimonials as defaultTestimonials,
  getAverageRating,
  getTestimonialCount,
  type Testimonial,
} from "@/lib/data/testimonials"
import { JsonLd, generateReviewSchema } from "@/lib/seo/json-ld"

export interface TestimonialsSectionProps {
  /** Section title */
  title?: string
  /** Section subtitle */
  subtitle?: string
  /** Custom testimonials (defaults to lib/data/testimonials.ts) */
  items?: Testimonial[]
  /** Additional CSS classes */
  className?: string
}

/**
 * Render star rating
 */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-4 w-4",
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  )
}

/**
 * Testimonials section with review cards and built-in JSON-LD schema.
 * Automatically generates Review and AggregateRating structured data for SEO.
 *
 * @example
 * // Using default testimonials from lib/data/testimonials.ts
 * <TestimonialsSection />
 *
 * @example
 * // With custom testimonials
 * <TestimonialsSection
 *   title="What Our Clients Say"
 *   items={[
 *     { name: "John D.", quote: "Great service!", rating: 5, role: "Customer" },
 *   ]}
 * />
 */
export function TestimonialsSection({
  title = "What Our Clients Say",
  subtitle = "Don't just take our word for it. Here's what our clients have to say about their experience.",
  items,
  className,
}: TestimonialsSectionProps) {
  const testimonials = items || defaultTestimonials
  const avgRating = getAverageRating()
  const reviewCount = getTestimonialCount()

  // Generate schema (returns null if no testimonials)
  const reviewSchema = generateReviewSchema(testimonials)

  return (
    <SectionWrapper className={cn("bg-secondary/5", className)}>
      {/* JSON-LD Schema */}
      {reviewSchema && <JsonLd data={reviewSchema} />}

      <Container>
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="font-heading mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              {subtitle}
            </p>
          )}

          {/* Aggregate Rating Display */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <StarRating rating={Math.round(avgRating)} />
            <span className="text-sm text-muted-foreground">
              {avgRating.toFixed(1)} out of 5 based on {reviewCount} reviews
            </span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col rounded-2xl bg-background p-6 shadow-sm"
            >
              {/* Rating */}
              <StarRating rating={testimonial.rating} />

              {/* Quote */}
              <blockquote className="mt-4 flex-1">
                <p className="text-base leading-relaxed text-muted-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </blockquote>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3">
                {testimonial.image ? (
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}
                <div>
                  <p className="font-medium text-foreground">
                    {testimonial.name}
                  </p>
                  {testimonial.role && (
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  )
}
