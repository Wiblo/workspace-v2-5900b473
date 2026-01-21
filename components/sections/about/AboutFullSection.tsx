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
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=800&fit=crop"
              alt="Our team working together"
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
                About Us
              </h1>
            </div>

            {/* Mobile Image */}
            <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-4xl md:hidden">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=800&fit=crop"
                alt="Our team working together"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>

            {/* Paragraphs */}
            <div className="flex w-full flex-col gap-4">
              <p className="text-lg leading-relaxed text-muted-foreground">
                We are a dedicated team of professionals committed to delivering
                exceptional service and results. With years of experience in our
                field, we have developed a deep understanding of our clients&apos;
                needs and how to meet them effectively.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Our mission is to provide personalized solutions that make a real
                difference in people&apos;s lives. We believe in building lasting
                relationships with our clients based on trust, transparency, and
                mutual respect.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                What sets us apart is our commitment to continuous improvement and
                staying at the forefront of industry developments. We invest in
                ongoing education and training to ensure we always deliver the
                highest quality service possible.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  )
}
