/**
 * Gallery data - images for the gallery section.
 * Used by: GallerySection component
 */

export interface GalleryItem {
  id: string
  image: string
  alt: string
  caption?: string
}

export interface GalleryContent {
  title: string
  subtitle?: string
  items: GalleryItem[]
}

export const galleryContent: GalleryContent = {
  title: "Our Clinic",
  subtitle: "Take a look inside our modern physiotherapy facility.",
  items: [
    {
      id: "gallery-1",
      image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=800&fit=crop",
      alt: "Modern physiotherapy treatment room",
    },
    {
      id: "gallery-2",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=800&fit=crop",
      alt: "Physiotherapist performing manual therapy",
    },
    {
      id: "gallery-3",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=800&fit=crop",
      alt: "Exercise rehabilitation area with equipment",
    },
    {
      id: "gallery-4",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
      alt: "Patient doing guided rehabilitation exercises",
    },
    {
      id: "gallery-5",
      image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=800&fit=crop",
      alt: "Clinic reception and waiting area",
    },
    {
      id: "gallery-6",
      image: "https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=800&h=800&fit=crop",
      alt: "Dry needling treatment session",
    },
  ],
}

// ============================================================================
// Helper Functions
// ============================================================================

export function getAllGalleryItems(): GalleryItem[] {
  return galleryContent.items
}

export function getGalleryPreview(count: number = 4): GalleryItem[] {
  return galleryContent.items.slice(0, count)
}
