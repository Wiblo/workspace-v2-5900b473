#!/usr/bin/env bun
/**
 * Single image generation via Vercel AI Gateway
 *
 * Usage:
 *   bun .claude/skills/image-gen/scripts/generate.ts --prompt "description" --output image.png
 *   bun .claude/skills/image-gen/scripts/generate.ts -p "a sunset" -o sunset.png -m gemini-3-pro -r 4K -a landscape
 *   bun .claude/skills/image-gen/scripts/generate.ts -p "Create variations" -i reference.jpg -i style.png -o result.png
 */

import { generateText } from "ai"
import { createGateway } from "@ai-sdk/gateway"
import { parseArgs } from "node:util"
import { readFile, writeFile, mkdir } from "node:fs/promises"
import { dirname, resolve, extname } from "node:path"
import { existsSync } from "node:fs"
import { loadEnv } from "./env.js"

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

// Aspect ratio mappings for Gemini
const ASPECT_RATIOS: Record<string, string> = {
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

// Model ID mappings (Gemini only)
const MODELS: Record<string, string> = {
  "gemini-3-pro": "google/gemini-3-pro-image",
  "gemini-flash": "google/gemini-2.5-flash-image",
}

// Resolution mappings
const RESOLUTIONS = ["1K", "2K", "4K"] as const

function generateTimestampFilename(): string {
  const now = new Date()
  const timestamp = now.toISOString().replace(/[-:T]/g, "").slice(0, 14)
  return `public/images/generated-${timestamp}.png`
}

function printUsage(): void {
  console.log(`
Image Generation Script

Usage:
  bun .claude/skills/image-gen/scripts/generate.ts --prompt "your description" [options]

Options:
  -p, --prompt        Image description (required)
  -i, --input         Reference image(s) - can specify multiple (optional)
  -o, --output        Output filename (default: public/images/generated-{timestamp}.png)
  -m, --model         Model to use: gemini-3-pro, gemini-flash (default: gemini-flash)
  -r, --resolution    Resolution: 1K, 2K, 4K (default: 2K)
  -a, --aspect-ratio  Aspect ratio: square, portrait, landscape, wide, 4:3, 16:9, etc. (default: square)
  -s, --style         Style to apply (e.g., minimalism, glassy, neon)
  -h, --help          Show this help message

Reference Image Search Paths:
  - Current directory
  - public/images/
  - public/uploads/
  - images/
  - assets/
  - input/

Examples:
  # Text-to-image
  bun .claude/skills/image-gen/scripts/generate.ts -p "A serene Japanese garden" -o garden.png
  bun .claude/skills/image-gen/scripts/generate.ts -p "App icon for finance app" -r 4K -a square -s minimalism

  # With reference images
  bun .claude/skills/image-gen/scripts/generate.ts -p "Create a similar style" -i reference.jpg -o styled.png
  bun .claude/skills/image-gen/scripts/generate.ts -p "Combine these into one scene" -i img1.jpg -i img2.png -o combined.png
`)
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      prompt: { type: "string", short: "p" },
      input: { type: "string", short: "i", multiple: true },
      output: { type: "string", short: "o" },
      model: { type: "string", short: "m", default: "gemini-flash" },
      resolution: { type: "string", short: "r", default: "2K" },
      "aspect-ratio": { type: "string", short: "a", default: "square" },
      style: { type: "string", short: "s" },
      help: { type: "boolean", short: "h", default: false },
    },
    strict: false,
  })

  if (values.help) {
    printUsage()
    process.exit(0)
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

  // Find and validate reference images if provided
  const inputFiles = (values.input as string[] | undefined) || []
  const resolvedInputs: { path: string; mimeType: string }[] = []

  for (const input of inputFiles) {
    const result = findInputFile(input)
    if (!result.found) {
      console.error(`Error: Reference image not found: ${input}`)
      console.error(`Searched in:\n  ${result.searched.join("\n  ")}`)
      process.exit(1)
    }
    resolvedInputs.push({
      path: result.path!,
      mimeType: getMimeType(result.path!),
    })
  }

  // Validate and resolve parameters
  const modelKey = values.model as string
  const modelId = MODELS[modelKey]
  if (!modelId) {
    console.error(
      `Error: Unsupported model "${modelKey}". Supported models: ${Object.keys(MODELS).join(", ")}`
    )
    process.exit(1)
  }

  const aspectRatioKey = values["aspect-ratio"] as string
  const aspectRatio = ASPECT_RATIOS[aspectRatioKey] || ASPECT_RATIOS["square"]
  if (!ASPECT_RATIOS[aspectRatioKey]) {
    console.warn(`Warning: Unknown aspect ratio "${aspectRatioKey}", using square (1:1)`)
  }

  const resolutionInput = ((values.resolution as string | undefined) || "2K").toUpperCase()
  const resolution = RESOLUTIONS.includes(resolutionInput as typeof RESOLUTIONS[number])
    ? (resolutionInput as typeof RESOLUTIONS[number])
    : "2K"
  if (resolution !== resolutionInput) {
    console.warn(`Warning: Unknown resolution "${resolutionInput}", using 2K`)
  }

  const outputPath = values.output || generateTimestampFilename()

  // Build the final prompt
  let finalPrompt = values.prompt as string
  if (values.style) {
    finalPrompt = `${finalPrompt}, ${values.style} style`
  }

  console.log(`Generating image...`)
  console.log(`  Model: ${modelId}`)
  console.log(`  Resolution: ${resolution}`)
  console.log(`  Aspect Ratio: ${aspectRatio}`)
  if (resolvedInputs.length > 0) {
    console.log(`  Reference Images: ${resolvedInputs.map((i) => i.path).join(", ")}`)
  }
  console.log(`  Prompt: ${finalPrompt.slice(0, 100)}${finalPrompt.length > 100 ? "..." : ""}`)

  try {
    const gateway = createGateway({ apiKey })
    const model = gateway(modelId)

    let result

    if (resolvedInputs.length > 0) {
      // Load reference images
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

    // Extract image from response
    const imageFiles = result.files?.filter((f) => f.mediaType?.startsWith("image/")) || []

    if (imageFiles.length === 0) {
      console.error("Error: No image generated")
      console.error("The model did not return any images. Try adjusting your prompt.")
      process.exit(1)
    }

    // Ensure output directory exists (mkdir with recursive is idempotent)
    const outputDir = dirname(resolve(outputPath as string))
    await mkdir(outputDir, { recursive: true })

    // Save image - handle both base64 string and Uint8Array
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

    console.log(`\n✓ Image saved: ${resolve(outputPath as string)}`)

    // Print any text response from the model
    if (result.text) {
      console.log(`\nModel notes: ${result.text}`)
    }
  } catch (error) {
    console.error("\nError generating image:")
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
