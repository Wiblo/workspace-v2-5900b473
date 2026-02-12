/**
 * Unified provider interface for image generation.
 * All providers (Gemini, BFL/FLUX) implement this interface.
 */

import type { createGateway } from "@ai-sdk/gateway"
import type { ResolvedImage, Resolution } from "../shared.js"

export interface ImageGenerationOptions {
  prompt: string
  /** Aspect ratio in W:H format (e.g. "1:1", "16:9") */
  aspectRatio: string
  /** Resolution — Gemini only (1K, 2K, 4K) */
  resolution?: Resolution
  /** Style to append to prompt */
  style?: string
  /** Reference images for editing / style transfer */
  referenceImages?: ResolvedImage[]
}

export interface ImageGenerationResult {
  buffer: Buffer
  /** Optional text notes from the model */
  text?: string
}

export interface ImageProvider {
  readonly name: string
  readonly supportsResolution: boolean
  readonly maxReferenceImages: number

  generate(
    gateway: ReturnType<typeof createGateway>,
    options: ImageGenerationOptions
  ): Promise<ImageGenerationResult>
}
