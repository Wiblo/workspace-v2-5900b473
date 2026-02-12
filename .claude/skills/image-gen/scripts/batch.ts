#!/usr/bin/env bun
/**
 * Batch image generation from JSON or CSV file
 *
 * Usage:
 *   bun .claude/skills/image-gen/scripts/batch.ts --input prompts.json --output-dir ./images/
 *   bun .claude/skills/image-gen/scripts/batch.ts -i prompts.csv -o ./generated/ -p 5
 */

import { parseArgs } from "node:util"
import { readFile, mkdir } from "node:fs/promises"
import { join, extname, resolve } from "node:path"
import { existsSync } from "node:fs"
import {
  MODELS,
  DEFAULT_MODEL,
  resolveAspectRatio,
  resolveResolution,
  resolveInputImages,
  saveImage,
  initGateway,
  listModels,
} from "./shared.js"
import { getProvider } from "./providers/index.js"
import type { createGateway } from "@ai-sdk/gateway"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BatchPrompt {
  prompt: string
  filename?: string
  model?: string
  resolution?: string
  aspectRatio?: string
  style?: string
  referenceImages?: string[]
}

// ---------------------------------------------------------------------------
// CSV Parsing
// ---------------------------------------------------------------------------

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
          if (value) {
            item.referenceImages = value
              .split("|")
              .map((s) => s.trim())
              .filter(Boolean)
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

// ---------------------------------------------------------------------------
// Single Image Generation (within batch)
// ---------------------------------------------------------------------------

async function generateSingleImage(
  gateway: ReturnType<typeof createGateway>,
  item: BatchPrompt,
  index: number,
  outputDir: string,
  defaultModel: string
): Promise<{ success: boolean; filename: string; error?: string }> {
  const modelKey = item.model || defaultModel
  const config = MODELS[modelKey]
  if (!config) {
    return {
      success: false,
      filename: "",
      error: `Unknown model "${modelKey}". Available: ${listModels()}`,
    }
  }

  const provider = getProvider(modelKey)
  const { ratio: aspectRatio } = resolveAspectRatio(item.aspectRatio || "square")
  const filename = item.filename || `image-${index + 1}.png`

  // Resolve resolution (only for Gemini)
  const resolution = config.supportsResolution
    ? resolveResolution(item.resolution || "2K").resolution
    : undefined

  // Resolve reference images
  let referenceImages = undefined
  if (item.referenceImages?.length) {
    if (config.maxReferenceImages === 0) {
      return {
        success: false,
        filename,
        error: `${modelKey} does not support reference images`,
      }
    }
    const refs =
      item.referenceImages.length > config.maxReferenceImages
        ? item.referenceImages.slice(0, config.maxReferenceImages)
        : item.referenceImages

    try {
      referenceImages = await resolveInputImages(refs)
    } catch {
      return {
        success: false,
        filename,
        error: `Failed to resolve reference images for item ${index + 1}`,
      }
    }
  }

  try {
    const result = await provider.generate(gateway, {
      prompt: item.prompt,
      aspectRatio,
      resolution,
      style: item.style,
      referenceImages,
    })

    const outputPath = join(outputDir, filename)
    await saveImage(result.buffer, outputPath)

    return { success: true, filename }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return { success: false, filename, error: errorMessage }
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function generateTimestampDir(): string {
  const now = new Date()
  const timestamp = now.toISOString().replace(/[-:T]/g, "").slice(0, 14)
  return `public/images/batch-${timestamp}`
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
  -m, --model       Default model for all prompts: ${listModels()} (default: ${DEFAULT_MODEL})
  -h, --help        Show this help message

JSON Format:
  [
    {
      "prompt": "Description of image",
      "filename": "output-name.png",
      "model": "flux-kontext-pro",
      "resolution": "2K",
      "aspectRatio": "16:9",
      "style": "minimalism",
      "referenceImages": ["reference.jpg", "style.png"]
    }
  ]

CSV Format:
  prompt,filename,model,resolution,aspectRatio,style,referenceImages
  "A sunset over mountains",sunset.png,flux-kontext-pro,,,
  "Create variation of this",variant.png,gemini-flash,2K,square,,product.jpg|style.png

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

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      input: { type: "string", short: "i" },
      "output-dir": { type: "string", short: "o", default: generateTimestampDir() },
      parallel: { type: "string", short: "p", default: "3" },
      model: { type: "string", short: "m", default: DEFAULT_MODEL },
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

  // Validate default model
  const defaultModel = values.model as string
  if (!MODELS[defaultModel]) {
    console.error(
      `Error: Unknown default model "${defaultModel}". Available: ${listModels()}`
    )
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
    console.error(
      `Error parsing input file: ${error instanceof Error ? error.message : error}`
    )
    process.exit(1)
  }

  if (!Array.isArray(prompts) || prompts.length === 0) {
    console.error("Error: Input file must contain an array of prompts")
    process.exit(1)
  }

  // Ensure output directory exists
  const outputDir = resolve(values["output-dir"] as string)
  await mkdir(outputDir, { recursive: true })

  const parallelism = Math.max(
    1,
    Math.min(10, parseInt(values.parallel as string, 10) || 3)
  )

  // Init gateway
  const { gateway, source } = initGateway()

  console.log(`\nBatch Image Generation`)
  console.log(`  Input: ${inputPath}`)
  console.log(`  Output: ${outputDir}`)
  console.log(`  Prompts: ${prompts.length}`)
  console.log(`  Parallelism: ${parallelism}`)
  console.log(`  Default Model: ${defaultModel}`)
  console.log(`  Auth Source: ${source}`)
  console.log("")

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
        console.log(
          `✗ [${completed}/${prompts.length}] ${result.filename}: ${result.error}`
        )
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
