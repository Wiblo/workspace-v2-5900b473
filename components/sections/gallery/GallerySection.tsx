"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { Container } from "@/components/layout/Container"
import { SectionWrapper } from "@/components/layout/SectionWrapper"
import { galleryContent, type GalleryItem } from "@/lib/data/gallery"

export interface GallerySectionProps {
  /** Section title */
  title?: string
  /** Section subtitle */
  subtitle?: string
  /** Custom gallery items (defaults to lib/data/gallery.ts) */
  items?: GalleryItem[]
  /** Number of columns (responsive) */
  columns?: 2 | 3 | 4
  /** Show placeholder for incomplete grids */
  showPlaceholder?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Gallery section displaying images in a responsive grid.
 * Content defaults to lib/data/gallery.ts but can be overridden via props.
 *
 * @example
 * // Using default gallery from lib/data/gallery.ts
 * <GallerySection />
 *
 * @example
 * // With custom items
 * <GallerySection
 *   title="Our Work"
 *   columns={4}
 *   items={[{ id: "1", image: "/img1.jpg", alt: "Work 1" }]}
 * />
 */
export function GallerySection({
  title,
  subtitle,
  items,
  columns = 3,
  showPlaceholder = true,
  className,
}: GallerySectionProps) {
  const displayTitle = title || galleryContent.title
  const displaySubtitle = subtitle || galleryContent.subtitle
  const displayItems = items || galleryContent.items

  const gridCols =
    {
      2: "grid-cols-2",
      3: "grid-cols-2 md:grid-cols-3",
      4: "grid-cols-2 md:grid-cols-4",
    }[columns] || "grid-cols-2 md:grid-cols-3"

  return (
    <SectionWrapper className={cn("bg-background", className)}>
      <Container>
        <div className="flex flex-col gap-12 md:gap-16">
          {/* Section Header */}
          <div className="mx-auto">
            <div className="flex flex-col self-stretch text-balance text-center md:max-w-2xl md:self-center">
              <div className="flex flex-col gap-2 md:gap-4">
                <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                  {displayTitle}
                </h2>
                {displaySubtitle && (
                  <p className="text-base font-medium text-muted-foreground">
                    {displaySubtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className={cn("grid gap-2 md:gap-4", gridCols)}>
            {displayItems.map((item) => (
              <div
                key={item.id}
                className="group relative flex aspect-square overflow-visible"
              >
                <div className="absolute inset-0 overflow-hidden rounded-xl transition-all duration-500 hover:scale-105 hover:shadow-lg">
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
            {showPlaceholder && columns === 3 && displayItems.length === 5 && (
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
