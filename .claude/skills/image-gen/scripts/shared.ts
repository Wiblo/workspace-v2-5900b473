/**
 * Shared constants, types, and utilities for image generation scripts.
 * Extracted from generate.ts, edit.ts, batch.ts to eliminate duplication.
 */

import { createGateway } from "@ai-sdk/gateway"
import { readFile, writeFile, mkdir } from "node:fs/promises"
import { dirname, resolve, extname } from "node:path"
import { existsSync } from "node:fs"
import { loadEnv, resolveGatewayAuth } from "./env.js"

// ---------------------------------------------------------------------------
// Model Configuration
// ---------------------------------------------------------------------------

export interface ModelConfig {
  /** Gateway model ID (e.g. "bfl/flux-kontext-pro") */
  id: string
  /** Provider type */
  provider: "gemini" | "bfl" | "imagen"
  /** Whether the model supports image editing (reference images as input) */
  supportsEditing: boolean
  /** Whether the model supports resolution control (1K/2K/4K) */
  supportsResolution: boolean
  /** Max number of reference images (0 = text-to-image only) */
  maxReferenceImages: number
}

export const MODELS: Record<string, ModelConfig> = {
  // Gemini
  "gemini-flash": {
    id: "google/gemini-2.5-flash-image",
    provider: "gemini",
    supportsEditing: true,
    supportsResolution: true,
    maxReferenceImages: 10,
  },
  "gemini-3-pro": {
    id: "google/gemini-3-pro-image",
    provider: "gemini",
    supportsEditing: true,
    supportsResolution: true,
    maxReferenceImages: 14,
  },
  // BFL FLUX
  "flux-kontext-pro": {
    id: "bfl/flux-kontext-pro",
    provider: "bfl",
    supportsEditing: true,
    supportsResolution: false,
    maxReferenceImages: 10,
  },
  "flux-kontext-max": {
    id: "bfl/flux-kontext-max",
    provider: "bfl",
    supportsEditing: true,
    supportsResolution: false,
    maxReferenceImages: 10,
  },
  "flux-pro": {
    id: "bfl/flux-pro-1.1",
    provider: "bfl",
    supportsEditing: false,
    supportsResolution: false,
    maxReferenceImages: 0,
  },
  "flux-ultra": {
    id: "bfl/flux-pro-1.1-ultra",
    provider: "bfl",
    supportsEditing: false,
    supportsResolution: false,
    maxReferenceImages: 0,
  },
  "flux-2-pro": {
    id: "bfl/flux-2-pro",
    provider: "bfl",
    supportsEditing: false,
    supportsResolution: false,
    maxReferenceImages: 0,
  },
  "flux-2-flex": {
    id: "bfl/flux-2-flex",
    provider: "bfl",
    supportsEditing: false,
    supportsResolution: false,
    maxReferenceImages: 0,
  },
  // Google Imagen (image-only models via generateImage)
  "imagen-4-ultra": {
    id: "google/imagen-4.0-ultra-generate-001",
    provider: "imagen",
    supportsEditing: false,
    supportsResolution: false,
    maxReferenceImages: 0,
  },
  "imagen-4": {
    id: "google/imagen-4.0-generate-001",
    provider: "imagen",
    supportsEditing: false,
    supportsResolution: false,
    maxReferenceImages: 0,
  },
  "imagen-4-fast": {
    id: "google/imagen-4.0-fast-generate-001",
    provider: "imagen",
    supportsEditing: false,
    supportsResolution: false,
    maxReferenceImages: 0,
  },
}

export const DEFAULT_MODEL = "flux-kontext-pro"

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Common locations to search for input files */
export const SEARCH_PATHS = [
  "", // Current directory
  "public/images/",
  "public/uploads/",
  "images/",
  "assets/",
  "input/",
]

/** Named aspect ratios → W:H format */
export const ASPECT_RATIOS: Record<string, string> = {
  square: "1:1",
  portrait: "9:16",
  landscape: "16:9",
  wide: "21:9",
  "4:3": "4:3",
  "3:4": "3:4",
  "3:2": "3:2",
  "2:3": "2:3",
  "5:4": "5:4",
  "4:5": "4:5",
  "16:9": "16:9",
  "9:16": "9:16",
  "21:9": "21:9",
}

/** Valid resolution values (Gemini only) */
export const RESOLUTIONS = ["1K", "2K", "4K"] as const
export type Resolution = (typeof RESOLUTIONS)[number]

// ---------------------------------------------------------------------------
// Resolved Image Type
// ---------------------------------------------------------------------------

export interface ResolvedImage {
  path: string
  mimeType: string
  data: Buffer
}

// ---------------------------------------------------------------------------
// Utility Functions
// ---------------------------------------------------------------------------

/** Search for a file across SEARCH_PATHS */
export function findInputFile(filename: string): {
  found: boolean
  path?: string
  searched: string[]
} {
  const searched: string[] = []

  if (filename.startsWith("/")) {
    searched.push(filename)
    if (existsSync(filename)) {
      return { found: true, path: filename, searched }
    }
    return { found: false, searched }
  }

  for (const prefix of SEARCH_PATHS) {
    const fullPath = resolve(prefix, filename)
    searched.push(fullPath)
    if (existsSync(fullPath)) {
      return { found: true, path: fullPath, searched }
    }
  }

  return { found: false, searched }
}

/** Map file extension to MIME type */
export function getMimeType(filepath: string): string {
  const ext = extname(filepath).toLowerCase()
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg"
    case ".png":
      return "image/png"
    case ".webp":
      return "image/webp"
    case ".gif":
      return "image/gif"
    default:
      return "image/jpeg"
  }
}

/** Validate and normalize an aspect ratio string */
export function resolveAspectRatio(input: string): {
  ratio: string
  warned: boolean
} {
  const mapped = ASPECT_RATIOS[input]
  if (mapped) return { ratio: mapped, warned: false }

  // Accept raw W:H format (e.g. "3:7")
  if (/^\d+:\d+$/.test(input)) return { ratio: input, warned: false }

  console.warn(`Warning: Unknown aspect ratio "${input}", using square (1:1)`)
  return { ratio: "1:1", warned: true }
}

/** Validate and normalize a resolution string */
export function resolveResolution(input: string): {
  resolution: Resolution
  warned: boolean
} {
  const upper = input.toUpperCase()
  if (RESOLUTIONS.includes(upper as Resolution)) {
    return { resolution: upper as Resolution, warned: false }
  }
  console.warn(`Warning: Unknown resolution "${input}", using 2K`)
  return { resolution: "2K", warned: true }
}

/** Resolve file paths to ResolvedImage[] (find + read + classify) */
export async function resolveInputImages(
  paths: string[]
): Promise<ResolvedImage[]> {
  const resolved: ResolvedImage[] = []

  for (const p of paths) {
    const result = findInputFile(p)
    if (!result.found) {
      console.error(`Error: Image not found: ${p}`)
      console.error(`Searched in:\n  ${result.searched.join("\n  ")}`)
      process.exit(1)
    }
    const filePath = result.path!
    const data = await readFile(filePath)
    resolved.push({
      path: filePath,
      mimeType: getMimeType(filePath),
      data,
    })
  }

  return resolved
}

/** Write an image buffer to disk, creating directories as needed */
export async function saveImage(
  buffer: Buffer,
  outputPath: string
): Promise<string> {
  const resolvedPath = resolve(outputPath)
  await mkdir(dirname(resolvedPath), { recursive: true })
  await writeFile(resolvedPath, buffer)
  return resolvedPath
}

/** Generate a timestamp-based filename */
export function generateTimestampFilename(
  prefix: string,
  ext = ".png"
): string {
  const now = new Date()
  const timestamp = now.toISOString().replace(/[-:T]/g, "").slice(0, 14)
  return `public/images/${prefix}-${timestamp}${ext}`
}

/** Load env, resolve gateway auth, create gateway — or exit on failure */
export function initGateway(): {
  gateway: ReturnType<typeof createGateway>
  source: string
} {
  loadEnv()

  const gatewayAuth = resolveGatewayAuth()
  if (!gatewayAuth) {
    console.error(
      "Error: Missing gateway auth. Set AI_GATEWAY_API_KEY or ANTHROPIC_AUTH_TOKEN."
    )
    console.error("Get a key from: https://vercel.com/ai-gateway")
    process.exit(1)
  }

  return {
    gateway: createGateway({ apiKey: gatewayAuth.apiKey }),
    source: gatewayAuth.source,
  }
}

/** List model keys as a formatted string */
export function listModels(): string {
  return Object.keys(MODELS).join(", ")
}
