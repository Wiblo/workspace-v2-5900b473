#!/usr/bin/env bun
/**
 * Image editing with reference images via Vercel AI Gateway
 *
 * Usage:
 *   bun .claude/skills/image-gen/scripts/edit.ts --input photo.jpg --prompt "Add storm clouds" --output edited.png
 *   bun .claude/skills/image-gen/scripts/edit.ts -i image1.jpg -i image2.jpg -p "Combine these images" -o combined.png
 */

import { generateText } from "ai"
import { createGateway } from "@ai-sdk/gateway"
import { parseArgs } from "node:util"
import { readFile, writeFile, mkdir } from "node:fs/promises"
import { dirname, resolve, extname } from "node:path"
import { existsSync } from "node:fs"
import { loadEnv } from "./env.js"

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

// Model ID mappings (only models that support image editing)
const MODELS: Record<string, string> = {
  "gemini-3-pro": "google/gemini-3-pro-image",
  "gemini-flash": "google/gemini-2.5-flash-image",
}

// Resolution mappings
const RESOLUTIONS = ["1K", "2K", "4K"] as const

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

function generateTimestampFilename(): string {
  const now = new Date()
  const timestamp = now.toISOString().replace(/[-:T]/g, "").slice(0, 14)
  return `public/images/edited-${timestamp}.png`
}

function printUsage(): void {
  console.log(`
Image Editing Script

Usage:
  bun .claude/skills/image-gen/scripts/edit.ts --input image.jpg --prompt "editing instructions" --output result.png

Options:
  -i, --input         Input image file(s) - can specify multiple (required)
  -p, --prompt        Editing instructions (required)
  -o, --output        Output filename (default: public/images/edited-{timestamp}.png)
  -m, --model         Model to use: gemini-3-pro, gemini-flash (default: gemini-flash)
  -a, --aspect-ratio  Output aspect ratio (default: auto from input)
  -r, --resolution    Resolution: 1K, 2K, 4K (default: auto from input)
  -h, --help          Show this help message

Input File Search:
  The script searches for input files in:
  - Current directory
  - public/images/
  - public/uploads/
  - images/
  - assets/
  - input/

Examples:
  # Simple edit
  bun .claude/skills/image-gen/scripts/edit.ts -i photo.jpg -p "Add dramatic storm clouds" -o dramatic.png

  # Style transfer
  bun .claude/skills/image-gen/scripts/edit.ts -i photo.jpg -p "Convert to watercolor painting style" -o watercolor.png

  # Combine two images
  bun .claude/skills/image-gen/scripts/edit.ts -i image1.jpg -i image2.jpg -p "Combine into a surreal scene" -o combined.png
`)
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      input: { type: "string", short: "i", multiple: true },
      prompt: { type: "string", short: "p" },
      output: { type: "string", short: "o" },
      model: { type: "string", short: "m", default: "gemini-flash" },
      "aspect-ratio": { type: "string", short: "a" },
      resolution: { type: "string", short: "r" },
      help: { type: "boolean", short: "h", default: false },
    },
    strict: false,
  })

  if (values.help) {
    printUsage()
    process.exit(0)
  }

  if (!values.input || (values.input as string[]).length === 0) {
    console.error("Error: --input is required (at least one image)")
    printUsage()
    process.exit(1)
  }

  if (!values.prompt) {
    console.error("Error: --prompt is required")
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

  // Find and validate input files
  const inputFiles = values.input as string[]
  const resolvedInputs: { path: string; mimeType: string }[] = []

  for (const input of inputFiles) {
    const result = findInputFile(input)
    if (!result.found) {
      console.error(`Error: Input file not found: ${input}`)
      console.error(`Searched in:\n  ${result.searched.join("\n  ")}`)
      process.exit(1)
    }
    resolvedInputs.push({
      path: result.path!,
      mimeType: getMimeType(result.path!),
    })
  }

  // Resolve model
  const modelKey = values.model as string
  const modelId = MODELS[modelKey]
  if (!modelId) {
    console.error(
      `Error: Unsupported model "${modelKey}". Supported models: ${Object.keys(MODELS).join(", ")}`
    )
    process.exit(1)
  }

  const outputPath = values.output || generateTimestampFilename()
  const aspectRatio = values["aspect-ratio"]
    ? ASPECT_RATIOS[values["aspect-ratio"] as string] || values["aspect-ratio"]
    : undefined
  const resolutionInput = values.resolution
    ? (values.resolution as string).toUpperCase()
    : undefined
  const resolution = resolutionInput
    ? RESOLUTIONS.includes(resolutionInput as typeof RESOLUTIONS[number])
      ? (resolutionInput as typeof RESOLUTIONS[number])
      : "2K"
    : undefined
  if (resolutionInput && resolution !== resolutionInput) {
    console.warn(`Warning: Unknown resolution "${resolutionInput}", using 2K`)
  }

  console.log(`\nImage Editing`)
  console.log(`  Input: ${resolvedInputs.map((i) => i.path).join(", ")}`)
  console.log(`  Model: ${modelId}`)
  console.log(`  Prompt: ${(values.prompt as string).slice(0, 80)}${(values.prompt as string).length > 80 ? "..." : ""}`)
  console.log(`  Output: ${outputPath}`)
  console.log("")

  try {
    // Load input images
    const imageContents = await Promise.all(
      resolvedInputs.map(async (input) => {
        const data = await readFile(input.path)
        const base64 = data.toString("base64")
        return {
          type: "image" as const,
          image: `data:${input.mimeType};base64,${base64}`,
        }
      })
    )

    // Build editing prompt based on number of images
    let editingPrompt = values.prompt as string
    if (resolvedInputs.length > 1) {
      editingPrompt = `${editingPrompt}. Combine these ${resolvedInputs.length} images creatively while following the instructions.`
    } else {
      editingPrompt = `${editingPrompt}. Edit or transform this image based on the instructions.`
    }

    const gateway = createGateway({ apiKey })
    const model = gateway(modelId)

    // Build message parts: images first, then prompt
    const messageParts: Array<{ type: "image" | "text"; image?: string; text?: string }> = [
      ...imageContents,
      { type: "text", text: editingPrompt },
    ]

    console.log("Generating edited image...")

    const result = await generateText({
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
            ...(aspectRatio && { aspectRatio }),
            ...(resolution && { imageSize: resolution }),
          },
        },
      },
    })

    // Extract image from response
    const imageFiles = result.files?.filter((f) => f.mediaType?.startsWith("image/")) || []

    if (imageFiles.length === 0) {
      console.error("\nError: No edited image generated")
      console.error("The model did not return any images. Try adjusting your prompt.")
      process.exit(1)
    }

    // Ensure output directory exists (mkdir with recursive is idempotent)
    const outputDir = dirname(resolve(outputPath as string))
    await mkdir(outputDir, { recursive: true })

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
      console.error("Error: Image data format not recognized")
      process.exit(1)
    }

    await writeFile(resolve(outputPath as string), buffer)

    console.log(`\n✓ Edited image saved: ${resolve(outputPath as string)}`)

    // Print any text response from the model
    if (result.text) {
      console.log(`\nModel notes: ${result.text}`)
    }
  } catch (error) {
    console.error("\nError editing image:")
    if (error instanceof Error) {
      if (error.message.includes("api key")) {
        console.error("  Authentication failed. Check your AI_GATEWAY_API_KEY.")
      } else if (error.message.includes("quota")) {
        console.error("  API quota exceeded. Check your usage limits.")
      } else {
        console.error(`  ${error.message}`)
      }
    } else {
      console.error(`  ${String(error)}`)
    }
    process.exit(1)
  }
}

main()
