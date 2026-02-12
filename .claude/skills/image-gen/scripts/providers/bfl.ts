/**
 * BFL / FLUX provider — uses generateImage() via gateway.imageModel()
 *
 * Supported models:
 *   - flux-kontext-pro  (generation + editing, up to 10 reference images)
 *   - flux-kontext-max  (improved prompt adherence + typography)
 *   - flux-pro          (fast text-to-image only)
 *   - flux-ultra        (ultra high-res text-to-image)
 */

import { generateImage } from "ai"
import type { createGateway } from "@ai-sdk/gateway"
import type { ModelConfig } from "../shared.js"
import type {
  ImageProvider,
  ImageGenerationOptions,
  ImageGenerationResult,
} from "./types.js"

export class BFLProvider implements ImageProvider {
  readonly name: string
  readonly supportsResolution: boolean
  readonly maxReferenceImages: number

  constructor(
    private readonly modelId: string,
    config: ModelConfig
  ) {
    this.name = `BFL ${modelId}`
    this.supportsResolution = config.supportsResolution
    this.maxReferenceImages = config.maxReferenceImages
  }

  async generate(
    gateway: ReturnType<typeof createGateway>,
    options: ImageGenerationOptions
  ): Promise<ImageGenerationResult> {
    const model = gateway.imageModel(this.modelId)

    // Build prompt — string for text-to-image, object for editing
    let prompt: string | { images: Buffer[]; text: string }
    if (options.referenceImages?.length) {
      prompt = {
        text: options.style
          ? `${options.prompt}, ${options.style} style`
          : options.prompt,
        images: options.referenceImages.map((img) => img.data),
      }
    } else {
      prompt = options.style
        ? `${options.prompt}, ${options.style} style`
        : options.prompt
    }

    const aspectRatio = options.aspectRatio as `${number}:${number}`

    const { image } = await generateImage({
      model,
      prompt,
      aspectRatio,
    })

    return { buffer: Buffer.from(image.uint8Array) }
  }
}
