/**
 * Gallery data - images for the gallery section.
 * Used by: GallerySection component
 */

export interface GalleryItem {
  /** Unique identifier */
  id: string
  /** Image URL (local or remote) */
  image: string
  /** Alt text for accessibility */
  alt: string
  /** Optional caption */
  caption?: string
}

export interface GalleryContent {
  /** Section title */
  title: string
  /** Optional subtitle */
  subtitle?: string
  /** Gallery items */
  items: GalleryItem[]
}

/**
 * Gallery content configuration.
 * Edit this to customize the gallery section.
 *
 * Tips:
 * - Use descriptive alt text for each image
 * - Keep image sizes consistent for best grid appearance
 * - Recommended: 6 images for 3-column, 4 or 8 for 4-column layouts
 */
export const galleryContent: GalleryContent = {
  title: "Our Gallery",
  subtitle: "Take a look at our space and see what we have to offer.",
  items: [
    {
      id: "gallery-1",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=800&fit=crop",
      alt: "Placeholder image 1",
    },
    {
      id: "gallery-2",
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=800&fit=crop",
      alt: "Placeholder image 2",
    },
    {
      id: "gallery-3",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=800&fit=crop",
      alt: "Placeholder image 3",
    },
    {
      id: "gallery-4",
      image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&h=800&fit=crop",
      alt: "Placeholder image 4",
    },
    {
      id: "gallery-5",
      image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=800&fit=crop",
      alt: "Placeholder image 5",
    },
    {
      id: "gallery-6",
      image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=800&fit=crop",
      alt: "Placeholder image 6",
    },
  ],
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get all gallery items.
 */
export function getAllGalleryItems(): GalleryItem[] {
  return galleryContent.items
}

/**
 * Get a subset of gallery items.
 */
export function getGalleryPreview(count: number = 4): GalleryItem[] {
  return galleryContent.items.slice(0, count)
}
