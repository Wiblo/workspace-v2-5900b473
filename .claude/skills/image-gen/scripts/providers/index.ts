/**
 * Provider factory — returns the correct ImageProvider for a given model key.
 */

import { MODELS, listModels } from "../shared.js"
import { BFLProvider } from "./bfl.js"
import { GeminiProvider } from "./gemini.js"
import { ImagenProvider } from "./imagen.js"
import type { ImageProvider } from "./types.js"

export type { ImageProvider, ImageGenerationOptions, ImageGenerationResult } from "./types.js"

export function getProvider(modelKey: string): ImageProvider {
  const config = MODELS[modelKey]
  if (!config) {
    console.error(
      `Error: Unknown model "${modelKey}". Available models: ${listModels()}`
    )
    process.exit(1)
  }

  switch (config.provider) {
    case "bfl":
      return new BFLProvider(config.id, config)
    case "gemini":
      return new GeminiProvider(config.id, config)
    case "imagen":
      return new ImagenProvider(config.id, config)
    default:
      console.error(`Error: Unknown provider "${config.provider}"`)
      process.exit(1)
  }
}
