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
      title: "Why Choose Proactive Therapy",
      description:
        "Our team combines years of clinical experience with the latest research to deliver treatments that actually work. We take the time to listen, assess thoroughly, and create personalized plans that address the root cause of your pain \u2014 not just the symptoms.",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=800&fit=crop",
      imageAlt: "Physiotherapist working with athlete",
      imagePosition: "right",
    },
    {
      id: "feature-2",
      title: "Your Recovery, Your Way",
      description:
        "We know that every body is different. That\u2019s why we create individualized treatment plans that fit your lifestyle, goals, and schedule. Whether you\u2019re recovering from surgery, managing chronic pain, or wanting to improve your athletic performance, we\u2019ll build a program around you.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=800&fit=crop",
      imageAlt: "Patient receiving hands-on physiotherapy treatment",
      imagePosition: "left",
    },
    {
      id: "feature-3",
      title: "Results You Can Feel",
      description:
        "Our patients don\u2019t just get better \u2014 they stay better. We equip you with the knowledge, exercises, and strategies to manage your condition long-term. With clear progress tracking and open communication, you\u2019ll always know exactly where you stand on your recovery journey.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=800&fit=crop",
      imageAlt: "Patient performing rehabilitation exercises",
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
