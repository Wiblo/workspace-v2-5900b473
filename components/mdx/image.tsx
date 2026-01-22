import sizeOf from "image-size"
import { join } from "path"
import { readFile } from "fs/promises"
import { Caption } from "./caption"
import NextImage from "next/image"

interface ImageProps {
  src: string
  alt?: string
  width?: number | null
  height?: number | null
}

/**
 * Smart image component with auto-sizing and caption support
 *
 * Features:
 * - Automatically computes dimensions for local and remote images
 * - Supports percentage sizing via alt text: "Caption [50%]"
 * - Shows caption below image from alt text
 *
 * Usage in MDX:
 * ![Image caption](/images/photo.jpg)
 * ![Smaller image [50%]](/images/diagram.png)
 */
export async function Image({
  src,
  alt: originalAlt,
  width = null,
  height = null,
}: ImageProps) {
  // Handle data URIs
  const isDataImage = src.startsWith("data:")
  if (isDataImage) {
    /* eslint-disable @next/next/no-img-element */
    return <img src={src} alt={originalAlt ?? ""} />
  }

  // Auto-compute dimensions if not provided
  if (width === null || height === null) {
    let imageBuffer: Buffer | null = null

    if (src.startsWith("http")) {
      // Remote image - fetch it
      const response = await fetch(src)
      const arrayBuffer = await response.arrayBuffer()
      imageBuffer = Buffer.from(arrayBuffer)
    } else {
      // Local image - read from public directory
      imageBuffer = await readFile(join(process.cwd(), "public", src))
    }

    const computedSize = sizeOf(imageBuffer)
    if (!computedSize.width || !computedSize.height) {
      throw new Error(`Could not compute image size for: ${src}`)
    }
    width = computedSize.width
    height = computedSize.height
  }

  // Parse alt text for caption and size modifier
  // Format: "Caption text [50%]"
  let alt: string | null = null
  let scaleFactor = 1

  if (typeof originalAlt === "string") {
    const match = originalAlt.match(/(.*?)(?:\s*\[(\d+)%\])?\s*$/)
    if (match) {
      alt = match[1].trim() || null
      scaleFactor = match[2] ? parseInt(match[2]) / 100 : 1
    }
  } else {
    alt = originalAlt ?? null
  }

  return (
    <span className="my-5 flex flex-col items-center">
      <NextImage
        width={width * scaleFactor}
        height={height * scaleFactor}
        alt={alt ?? ""}
        src={src}
        unoptimized={src.endsWith(".gif")}
      />

      {alt && <Caption>{alt}</Caption>}
    </span>
  )
}
