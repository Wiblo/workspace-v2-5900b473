#!/usr/bin/env bun
/**
 * Batch image generation from JSON or CSV file
 *
 * Usage:
 *   bun .claude/skills/image-gen/scripts/batch.ts --input prompts.json --output-dir ./images/
 *   bun .claude/skills/image-gen/scripts/batch.ts -i prompts.csv -o ./generated/ -p 5
 */

import { generateText } from "ai"
import { createGateway } from "@ai-sdk/gateway"
import { parseArgs } from "node:util"
import { readFile, writeFile, mkdir } from "node:fs/promises"
import { join, extname, resolve } from "node:path"
import { existsSync } from "node:fs"
import { loadEnv } from "./env.js"

// Types
interface BatchPrompt {
  prompt: string
  filename?: string
  model?: string
  resolution?: string
  aspectRatio?: string
  style?: string
  referenceImages?: string[] // Paths to reference images
}

// Common locations to search for input files
const SEARCH_PATHS = [
  "", // Current directory
  "public/images/",
  "public/uploads/",
  "images/",
  "assets/",
  "input/",
]

function findInputFile(filename: string): { found: boolean; path?: string; searched: string[] } {
  const searched: string[] = []

  // If absolute path, check directly
  if (filename.startsWith("/")) {
    searched.push(filename)
    if (existsSync(filename)) {
      return { found: true, path: filename, searched }
    }
    return { found: false, searched }
  }

  // Search in common locations
  for (const prefix of SEARCH_PATHS) {
    const fullPath = resolve(prefix, filename)
    searched.push(fullPath)
    if (existsSync(fullPath)) {
      return { found: true, path: fullPath, searched }
    }
  }

  return { found: false, searched }
}

function getMimeType(filepath: string): string {
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

// Aspect ratio mappings
const ASPECT_RATIOS: Record<string, string> = {
  square: "1:1",
  portrait: "9:16",
  landscape: "16:9",
  wide: "21:9",
  "4:3": "4:3",
  "3:4": "3:4",
  "3:2": "3:2",
  "2:3": "2:3",
  "16:9": "16:9",
  "9:16": "9:16",
  "21:9": "21:9",
}

// Model ID mappings (Gemini only)
const MODELS: Record<string, string> = {
  "gemini-3-pro": "google/gemini-3-pro-image",
  "gemini-flash": "google/gemini-2.5-flash-image",
}

// Resolution mappings
const RESOLUTIONS = ["1K", "2K", "4K"] as const

function generateTimestampDir(): string {
  const now = new Date()
  const timestamp = now.toISOString().replace(/[-:T]/g, "").slice(0, 14)
  return `public/images/batch-${timestamp}`
}

function parseCSV(content: string): BatchPrompt[] {
  const lines = content.trim().split("\n")
  if (lines.length < 2) {
    throw new Error("CSV must have a header row and at least one data row")
  }

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
  const prompts: BatchPrompt[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Handle quoted values with commas
    const values: string[] = []
    let current = ""
    let inQuotes = false

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        values.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }
    values.push(current.trim())

    const item: BatchPrompt = { prompt: "" }
    headers.forEach((header, idx) => {
      const value = values[idx]?.replace(/^"|"$/g, "") || ""
      switch (header) {
        case "prompt":
          item.prompt = value
          break
        case "filename":
          item.filename = value
          break
        case "model":
          item.model = value
          break
        case "resolution":
          item.resolution = value
          break
        case "aspectratio":
        case "aspect_ratio":
        case "aspect-ratio":
          item.aspectRatio = value
          break
        case "style":
          item.style = value
          break
        case "referenceimages":
        case "reference_images":
        case "reference-images":
        case "references":
          // Parse as pipe-separated list (e.g., "img1.jpg|img2.png")
          if (value) {
            item.referenceImages = value.split("|").map((s) => s.trim()).filter(Boolean)
          }
          break
      }
    })

    if (item.prompt) {
      prompts.push(item)
    }
  }

  return prompts
}

function printUsage(): void {
  console.log(`
Batch Image Generation Script

Usage:
  bun .claude/skills/image-gen/scripts/batch.ts --input prompts.json --output-dir ./images/

Options:
  -i, --input       Input file (JSON or CSV) containing prompts (required)
  -o, --output-dir  Output directory for generated images (default: public/images/batch-{timestamp})
  -p, --parallel    Number of parallel generations (default: 3)
  -m, --model       Default model for all prompts: gemini-3-pro, gemini-flash (default: gemini-flash)
  -h, --help        Show this help message

JSON Format:
  [
    {
      "prompt": "Description of image",
      "filename": "output-name.png",
      "resolution": "2K",
      "aspectRatio": "16:9",
      "style": "minimalism",
      "referenceImages": ["reference.jpg", "style.png"]
    }
  ]

CSV Format:
  prompt,filename,resolution,aspectRatio,style,referenceImages
  "A sunset over mountains",sunset.png,2K,landscape,,
  "Create variation of this",variant.png,4K,square,,product.jpg|style.png

Reference Image Search Paths:
  - Current directory
  - public/images/
  - public/uploads/
  - images/
  - assets/
  - input/

Examples:
  bun .claude/skills/image-gen/scripts/batch.ts -i prompts.json -o ./images/
  bun .claude/skills/image-gen/scripts/batch.ts --input batch.csv --output-dir ./output --parallel 5
`)
}

async function generateSingleImage(
  gateway: ReturnType<typeof createGateway>,
  item: BatchPrompt,
  index: number,
  outputDir: string,
  defaultModel: string
): Promise<{ success: boolean; filename: string; error?: string }> {
  const modelKey = item.model || defaultModel
  const modelId = MODELS[modelKey]
  if (!modelId) {
    return {
      success: false,
      filename: "",
      error: `Unsupported model "${modelKey}". Supported models: ${Object.keys(MODELS).join(", ")}`,
    }
  }
  const aspectRatio = ASPECT_RATIOS[item.aspectRatio || "square"] || "1:1"
  const resolutionInput = (item.resolution || "2K").toUpperCase()
  const resolution = RESOLUTIONS.includes(resolutionInput as typeof RESOLUTIONS[number])
    ? (resolutionInput as typeof RESOLUTIONS[number])
    : "2K"
  if (resolution !== resolutionInput) {
    console.warn(`Warning: Unknown resolution "${resolutionInput}", using 2K`)
  }
  const filename = item.filename || `image-${index + 1}.png`

  // Build prompt with style
  let finalPrompt = item.prompt
  if (item.style) {
    finalPrompt = `${finalPrompt}, ${item.style} style`
  }

  try {
    const model = gateway(modelId)
    let result

    // Check if we have reference images
    const referenceImages = item.referenceImages || []
    const resolvedRefs: { path: string; mimeType: string }[] = []

    for (const ref of referenceImages) {
      const found = findInputFile(ref)
      if (!found.found) {
        return { success: false, filename, error: `Reference image not found: ${ref}` }
      }
      resolvedRefs.push({
        path: found.path!,
        mimeType: getMimeType(found.path!),
      })
    }

    if (resolvedRefs.length > 0) {
      // Load reference images
      const imageContents = await Promise.all(
        resolvedRefs.map(async (input) => {
          const data = await readFile(input.path)
          const base64 = data.toString("base64")
          return {
            type: "image" as const,
            image: `data:${input.mimeType};base64,${base64}`,
          }
        })
      )

      // Build message parts: images first, then prompt
      const messageParts: Array<{ type: "image" | "text"; image?: string; text?: string }> = [
        ...imageContents,
        { type: "text", text: finalPrompt },
      ]

      result = await generateText({
        model,
        messages: [
          {
            role: "user",
            // @ts-expect-error - Type variance in content parts
            content: messageParts,
          },
        ],
        providerOptions: {
          google: {
            responseModalities: ["IMAGE"],
            imageConfig: {
              aspectRatio,
              imageSize: resolution,
            },
          },
        },
      })
    } else {
      // Simple text-to-image (no reference images)
      result = await generateText({
        model,
        prompt: finalPrompt,
        providerOptions: {
          google: {
            responseModalities: ["IMAGE"],
            imageConfig: {
              aspectRatio,
              imageSize: resolution,
            },
          },
        },
      })
    }

    const imageFiles = result.files?.filter((f) => f.mediaType?.startsWith("image/")) || []

    if (imageFiles.length === 0) {
      return { success: false, filename, error: "No image generated" }
    }

    // Save image
    const imageData = imageFiles[0]
    let buffer: Buffer

    if (imageData.uint8Array) {
      buffer = Buffer.from(imageData.uint8Array)
    } else if (imageData.base64) {
      // Remove data URL prefix if present (e.g., "data:image/png;base64,")
      const base64Data = imageData.base64.replace(/^data:image\/\w+;base64,/, "")
      buffer = Buffer.from(base64Data, "base64")
    } else {
      return { success: false, filename, error: "Image data format not recognized" }
    }

    const outputPath = join(outputDir, filename)
    await writeFile(outputPath, buffer)

    return { success: true, filename }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return { success: false, filename, error: errorMessage }
  }
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      input: { type: "string", short: "i" },
      "output-dir": { type: "string", short: "o", default: generateTimestampDir() },
      parallel: { type: "string", short: "p", default: "3" },
      model: { type: "string", short: "m", default: "gemini-flash" },
      help: { type: "boolean", short: "h", default: false },
    },
    strict: false,
  })

  if (values.help) {
    printUsage()
    process.exit(0)
  }

  if (!values.input) {
    console.error("Error: --input is required")
    printUsage()
    process.exit(1)
  }

  loadEnv()

  // Validate API key
  const apiKey = process.env.AI_GATEWAY_API_KEY
  if (!apiKey) {
    console.error("Error: AI_GATEWAY_API_KEY environment variable is required")
    console.error("Get your key from: https://vercel.com/ai-gateway")
    process.exit(1)
  }

  // Check input file exists
  const inputPath = resolve(values.input as string)
  if (!existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`)
    process.exit(1)
  }

  // Parse input file
  const content = await readFile(inputPath, "utf-8")
  let prompts: BatchPrompt[]

  try {
    if (extname(inputPath).toLowerCase() === ".csv") {
      prompts = parseCSV(content)
    } else {
      prompts = JSON.parse(content)
    }
  } catch (error) {
    console.error(`Error parsing input file: ${error instanceof Error ? error.message : error}`)
    process.exit(1)
  }

  if (!Array.isArray(prompts) || prompts.length === 0) {
    console.error("Error: Input file must contain an array of prompts")
    process.exit(1)
  }

  // Ensure output directory exists (mkdir with recursive is idempotent)
  const outputDir = resolve(values["output-dir"] as string)
  await mkdir(outputDir, { recursive: true })

  const parallelism = Math.max(1, Math.min(10, parseInt(values.parallel as string, 10) || 3))
  const defaultModel = values.model as string
  if (!MODELS[defaultModel]) {
    console.error(
      `Error: Unsupported default model "${defaultModel}". Supported models: ${Object.keys(MODELS).join(", ")}`
    )
    process.exit(1)
  }

  console.log(`\nBatch Image Generation`)
  console.log(`  Input: ${inputPath}`)
  console.log(`  Output: ${outputDir}`)
  console.log(`  Prompts: ${prompts.length}`)
  console.log(`  Parallelism: ${parallelism}`)
  console.log(`  Default Model: ${defaultModel}`)
  console.log("")

  const gateway = createGateway({ apiKey })
  const results: { success: boolean; filename: string; error?: string }[] = []
  let completed = 0

  // Process in batches
  for (let i = 0; i < prompts.length; i += parallelism) {
    const batch = prompts.slice(i, i + parallelism)

    const batchResults = await Promise.all(
      batch.map((item, idx) =>
        generateSingleImage(gateway, item, i + idx, outputDir, defaultModel)
      )
    )

    for (const result of batchResults) {
      completed++
      results.push(result)

      if (result.success) {
        console.log(`✓ [${completed}/${prompts.length}] ${result.filename}`)
      } else {
        console.log(`✗ [${completed}/${prompts.length}] ${result.filename}: ${result.error}`)
      }
    }
  }

  // Summary
  const successful = results.filter((r) => r.success).length
  const failed = results.filter((r) => !r.success).length

  console.log(`\n${"─".repeat(40)}`)
  console.log(`Complete: ${successful} succeeded, ${failed} failed`)
  console.log(`Output: ${outputDir}`)
}

main()
