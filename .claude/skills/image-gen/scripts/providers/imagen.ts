/**
 * Google Imagen provider — uses generateImage() via gateway.imageModel()
 *
 * Image-only models (no text output, no editing):
 *   - imagen-4-ultra  (highest quality)
 *   - imagen-4        (standard quality)
 *   - imagen-4-fast   (fastest)
 */

import { generateImage } from "ai"
import type { createGateway } from "@ai-sdk/gateway"
import type { ModelConfig } from "../shared.js"
import type {
  ImageProvider,
  ImageGenerationOptions,
  ImageGenerationResult,
} from "./types.js"

export class ImagenProvider implements ImageProvider {
  readonly name: string
  readonly supportsResolution: boolean
  readonly maxReferenceImages: number

  constructor(
    private readonly modelId: string,
    config: ModelConfig
  ) {
    this.name = `Imagen ${modelId}`
    this.supportsResolution = config.supportsResolution
    this.maxReferenceImages = config.maxReferenceImages
  }

  async generate(
    gateway: ReturnType<typeof createGateway>,
    options: ImageGenerationOptions
  ): Promise<ImageGenerationResult> {
    const model = gateway.imageModel(this.modelId)

    const prompt = options.style
      ? `${options.prompt}, ${options.style} style`
      : options.prompt

    const aspectRatio = options.aspectRatio as `${number}:${number}`

    const { image } = await generateImage({
      model,
      prompt,
      aspectRatio,
    })

    return { buffer: Buffer.from(image.uint8Array) }
  }
}
