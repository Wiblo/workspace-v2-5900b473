/**
 * Gemini provider — uses generateImage() via gateway.imageModel()
 *
 * Fallback: if gateway.imageModel() doesn't work for Gemini at runtime,
 * swap internals to use generateText() with responseModalities: ["IMAGE"].
 * The provider interface stays the same — scripts don't need to change.
 *
 * Supported models:
 *   - gemini-flash   (generation + editing)
 *   - gemini-3-pro   (generation + editing, resolution control)
 */

import { generateImage } from "ai"
import type { createGateway } from "@ai-sdk/gateway"
import type { ModelConfig } from "../shared.js"
import type {
  ImageProvider,
  ImageGenerationOptions,
  ImageGenerationResult,
} from "./types.js"

export class GeminiProvider implements ImageProvider {
  readonly name: string
  readonly supportsResolution: boolean
  readonly maxReferenceImages: number

  constructor(
    private readonly modelId: string,
    config: ModelConfig
  ) {
    this.name = `Gemini ${modelId}`
    this.supportsResolution = config.supportsResolution
    this.maxReferenceImages = config.maxReferenceImages
  }

  async generate(
    gateway: ReturnType<typeof createGateway>,
    options: ImageGenerationOptions
  ): Promise<ImageGenerationResult> {
    try {
      return await this.generateViaImageModel(gateway, options)
    } catch (error) {
      // If gateway.imageModel() fails for Gemini, fall back to generateText()
      const msg = error instanceof Error ? error.message : String(error)
      if (
        msg.includes("not supported") ||
        msg.includes("not found") ||
        msg.includes("imageModel")
      ) {
        console.warn(
          "generateImage() not supported for Gemini via gateway, falling back to generateText()..."
        )
        return this.generateViaText(gateway, options)
      }
      throw error
    }
  }

  /** Primary path: generateImage() via gateway.imageModel() */
  private async generateViaImageModel(
    gateway: ReturnType<typeof createGateway>,
    options: ImageGenerationOptions
  ): Promise<ImageGenerationResult> {
    const model = gateway.imageModel(this.modelId)

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

    const providerOptions = options.resolution
      ? { google: { imageConfig: { imageSize: options.resolution } } }
      : undefined

    const { image } = await generateImage({
      model,
      prompt,
      aspectRatio,
      ...(providerOptions && { providerOptions }),
    })

    return { buffer: Buffer.from(image.uint8Array) }
  }

  /** Fallback path: generateText() with responseModalities: ["IMAGE"] */
  private async generateViaText(
    gateway: ReturnType<typeof createGateway>,
    options: ImageGenerationOptions
  ): Promise<ImageGenerationResult> {
    // Dynamic import to avoid pulling in generateText when not needed
    const { generateText } = await import("ai")

    const model = gateway(this.modelId)

    const finalPrompt = options.style
      ? `${options.prompt}, ${options.style} style`
      : options.prompt

    const providerOptions = {
      google: {
        responseModalities: ["IMAGE"],
        imageConfig: {
          aspectRatio: options.aspectRatio,
          ...(options.resolution && { imageSize: options.resolution }),
        },
      },
    }

    let result

    if (options.referenceImages?.length) {
      const imageContents = options.referenceImages.map((img) => ({
        type: "image" as const,
        image: `data:${img.mimeType};base64,${img.data.toString("base64")}`,
      }))

      const messageParts: Array<{
        type: "image" | "text"
        image?: string
        text?: string
      }> = [...imageContents, { type: "text", text: finalPrompt }]

      result = await generateText({
        model,
        messages: [
          {
            role: "user",
            // @ts-expect-error - Type variance in content parts
            content: messageParts,
          },
        ],
        providerOptions,
      })
    } else {
      result = await generateText({
        model,
        prompt: finalPrompt,
        providerOptions,
      })
    }

    // Extract image from response
    const imageFiles =
      result.files?.filter((f) => f.mediaType?.startsWith("image/")) || []

    if (imageFiles.length === 0) {
      throw new Error(
        "No image generated. The model did not return any images."
      )
    }

    const imageData = imageFiles[0]
    let buffer: Buffer

    if (imageData.uint8Array) {
      buffer = Buffer.from(imageData.uint8Array)
    } else if (imageData.base64) {
      const base64Data = imageData.base64.replace(
        /^data:image\/\w+;base64,/,
        ""
      )
      buffer = Buffer.from(base64Data, "base64")
    } else {
      throw new Error("Image data format not recognized")
    }

    return { buffer, text: result.text || undefined }
  }
}
