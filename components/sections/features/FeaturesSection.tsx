import Image from "next/image"
import { cn } from "@/lib/utils"
import { Container } from "@/components/layout/Container"
import { SectionWrapper } from "@/components/layout/SectionWrapper"

interface FeatureBlock {
  id: string
  title: string
  description: string
  image: string
  imageAlt: string
  imagePosition: "left" | "right"
}

export interface FeaturesSectionProps {
  className?: string
}

/**
 * Homepage features section with alternating image/text layout.
 * Edit the blocks array below to customize for your business.
 */
export function FeaturesSection({ className }: FeaturesSectionProps) {
  const blocks: FeatureBlock[] = [
    {
      id: "feature-1",
      title: "Why Choose Us",
      description:
        "We bring years of experience and dedication to every project. Our team is committed to delivering exceptional results that exceed your expectations. We take the time to understand your unique needs and tailor our approach accordingly.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=800&fit=crop",
      imageAlt: "Team collaboration",
      imagePosition: "right",
    },
    {
      id: "feature-2",
      title: "Our Approach",
      description:
        "We believe in a personalized approach that puts you first. From your initial consultation to the final result, we ensure clear communication and transparency at every step. Your satisfaction is our top priority.",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=800&fit=crop",
      imageAlt: "Professional consultation",
      imagePosition: "left",
    },
    {
      id: "feature-3",
      title: "Results You Can Trust",
      description:
        "Our track record speaks for itself. We have helped countless clients achieve their goals and we are ready to help you too. Experience the difference that expertise and genuine care can make.",
      image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&h=800&fit=crop",
      imageAlt: "Successful results",
      imagePosition: "right",
    },
  ]

  return (
    <SectionWrapper className={cn("bg-background", className)}>
      <Container>
        {blocks.map((block, index) => (
          <div key={block.id} className={cn(index > 0 && "mt-20 md:mt-32")}>
            <div
              className={cn(
                "flex flex-col items-center gap-10 md:gap-20 xl:gap-[140px]",
                block.imagePosition === "right"
                  ? "md:flex-row-reverse"
                  : "md:flex-row"
              )}
            >
              {/* Desktop Image */}
              <div className="relative hidden aspect-square w-full shrink-0 overflow-hidden rounded-4xl md:flex md:max-h-[300px] md:max-w-[300px] xl:max-h-[520px] xl:max-w-[520px]">
                <Image
                  src={block.image}
                  alt={block.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 300px, 520px"
                />
              </div>

              {/* Content */}
              <div className="flex w-full flex-col gap-8">
                {/* Heading */}
                <div className="flex w-full justify-center md:justify-start">
                  <h2 className="font-heading text-balance text-center text-3xl font-bold text-foreground md:text-left md:text-4xl lg:text-5xl">
                    {block.title}
                  </h2>
                </div>

                {/* Mobile Image */}
                <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-4xl md:hidden">
                  <Image
                    src={block.image}
                    alt={block.imageAlt}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>

                {/* Description */}
                <div className="flex w-full flex-col gap-8">
                  <p className="text-base font-medium leading-relaxed text-muted-foreground">
                    {block.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Container>
    </SectionWrapper>
  )
}
