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
 * About page features section with alternating image/text layout.
 * Edit the blocks array below to customize for your business.
 */
export function AboutFeatures({ className }: FeaturesSectionProps) {
  const blocks: FeatureBlock[] = [
    {
      id: "value-1",
      title: "Our Mission",
      description:
        "We exist to empower people to take control of their physical health. Through expert physiotherapy, education, and ongoing support, we help our patients overcome pain, prevent injury, and achieve their movement goals \u2014 so they can keep doing what they love.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=800&fit=crop",
      imageAlt: "Physiotherapist performing assessment",
      imagePosition: "right",
    },
    {
      id: "value-2",
      title: "Our Values",
      description:
        "Evidence-based care, genuine compassion, and honest communication are the pillars of our practice. We believe in treating every patient as an individual, taking the time to listen, and being transparent about what to expect from treatment. Your trust means everything to us.",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=800&fit=crop",
      imageAlt: "Collaborative physiotherapy session",
      imagePosition: "left",
    },
    {
      id: "value-3",
      title: "Our Commitment",
      description:
        "We are committed to your long-term wellbeing, not just short-term relief. Our therapists invest in ongoing education and training to stay at the cutting edge of physiotherapy. We measure our success by your outcomes \u2014 when you get better, we know we have done our job.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=800&fit=crop",
      imageAlt: "Patient performing rehabilitation exercises with guidance",
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
