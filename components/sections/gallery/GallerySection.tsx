import Image from "next/image"
import { cn } from "@/lib/utils"
import { Container } from "@/components/layout/Container"
import { SectionWrapper } from "@/components/layout/SectionWrapper"

// =============================================================================
// CONFIGURATION - Edit these variables to customize the gallery
// =============================================================================

/** Number of columns: 2 | 3 | 4 */
const columns: 2 | 3 | 4 = 3

/** Show placeholder for incomplete grids */
const showPlaceholder = false

/** Gallery content - edit these values directly */
const galleryContent = {
  title: "Our Gallery",
  subtitle: "Take a look at our space and see what we have to offer.",
  items: [
    {
      id: "gallery-1",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=800&fit=crop",
      alt: "Modern office space with natural lighting",
      caption: undefined as string | undefined,
    },
    {
      id: "gallery-2",
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=800&fit=crop",
      alt: "Professional meeting room",
      caption: undefined as string | undefined,
    },
    {
      id: "gallery-3",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=800&fit=crop",
      alt: "Collaborative workspace",
      caption: undefined as string | undefined,
    },
    {
      id: "gallery-4",
      image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&h=800&fit=crop",
      alt: "Reception area",
      caption: undefined as string | undefined,
    },
    {
      id: "gallery-5",
      image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=800&fit=crop",
      alt: "Team collaboration space",
      caption: undefined as string | undefined,
    },
    {
      id: "gallery-6",
      image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=800&fit=crop",
      alt: "Modern interior design",
      caption: undefined as string | undefined,
    },
  ],
}

// =============================================================================
// GRID CONFIGURATION
// =============================================================================

const gridCols = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-4",
}

// =============================================================================
// COMPONENT
// =============================================================================

export interface GallerySectionProps {
  className?: string
}

/**
 * Gallery section displaying images in a responsive grid.
 * Configuration is done via variables at the top of this file.
 *
 * Tips:
 * - Use descriptive alt text for each image
 * - Keep image sizes consistent for best grid appearance
 * - Recommended: 6 images for 3-column, 4 or 8 for 4-column layouts
 */
export function GallerySection({ className }: GallerySectionProps) {
  const { title, subtitle, items } = galleryContent

  return (
    <SectionWrapper className={cn("bg-background", className)}>
      <Container>
        <div className="flex flex-col gap-12 md:gap-16">
          {/* Section Header */}
          <div className="mx-auto">
            <div className="flex flex-col self-stretch text-balance text-center md:max-w-2xl md:self-center">
              <div className="flex flex-col gap-2 md:gap-4">
                <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-base font-medium text-muted-foreground">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className={cn("grid gap-2 md:gap-4", gridCols[columns])}>
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative flex aspect-square overflow-visible"
              >
                <div className="absolute inset-0 overflow-hidden rounded-xl transition-transform duration-500 hover:scale-105 hover:shadow-lg">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes={
                      columns === 4
                        ? "(max-width: 768px) 50vw, 25vw"
                        : columns === 3
                          ? "(max-width: 768px) 50vw, 33vw"
                          : "50vw"
                    }
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 rounded-xl bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Optional Caption */}
                  {item.caption && (
                    <div className="absolute inset-x-0 bottom-0 rounded-b-xl bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="text-sm font-medium text-white">
                        {item.caption}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Empty placeholder for maintaining grid layout when needed */}
            {showPlaceholder && columns === 3 && items.length === 5 && (
              <div className="relative hidden aspect-square overflow-visible md:block">
                <div className="absolute inset-0 overflow-hidden rounded-xl bg-muted" />
              </div>
            )}
          </div>
        </div>
      </Container>
    </SectionWrapper>
  )
}
