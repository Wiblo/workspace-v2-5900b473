import Image from "next/image"
import { cn } from "@/lib/utils"
import { Container } from "@/components/layout/Container"
import { SectionWrapper } from "@/components/layout/SectionWrapper"

export interface AboutFullSectionProps {
  className?: string
}

/**
 * Full about section for the dedicated about page.
 * Edit the content below to customize for your business.
 */
export function AboutFullSection({ className }: AboutFullSectionProps) {
  return (
    <SectionWrapper className={cn("bg-background", className)}>
      <Container>
        <div className="flex flex-col items-center gap-10 md:flex-row md:gap-20 xl:gap-[140px]">
          {/* Desktop Image */}
          <div className="relative hidden aspect-square w-full shrink-0 overflow-hidden rounded-4xl md:flex md:max-h-[300px] md:max-w-[300px] xl:max-h-[520px] xl:max-w-[520px]">
            <Image
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=800&fit=crop"
              alt="Proactive Therapy team providing physiotherapy care"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 300px, 520px"
              priority
            />
          </div>

          {/* Content */}
          <div className="flex w-full flex-col gap-8">
            {/* Heading */}
            <div className="flex w-full justify-center md:justify-start">
              <h1 className="font-heading text-balance text-center text-3xl font-bold text-foreground md:text-left md:text-4xl lg:text-5xl">
                About Proactive Therapy
              </h1>
            </div>

            {/* Mobile Image */}
            <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-4xl md:hidden">
              <Image
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=800&fit=crop"
                alt="Proactive Therapy team providing physiotherapy care"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>

            {/* Paragraphs */}
            <div className="flex w-full flex-col gap-4">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Proactive Therapy was founded with a simple mission: to help
                people move better, feel better, and live better. As experienced
                physiotherapists, we saw too many patients receiving
                cookie-cutter treatments that failed to address the real cause
                of their pain.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                That&apos;s why we take a different approach. Every patient who
                walks through our doors receives a thorough assessment and a
                treatment plan built specifically for them. We combine hands-on
                manual therapy, targeted exercise programs, and patient
                education to deliver lasting results.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Our team stays at the forefront of physiotherapy research and
                practice. We regularly attend professional development courses
                and conferences to ensure we&apos;re bringing you the most
                effective, evidence-based treatments available. Your recovery
                is our priority.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  )
}
