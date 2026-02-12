#!/usr/bin/env bun
/**
 * Image editing with reference images via Vercel AI Gateway
 *
 * Usage:
 *   bun .claude/skills/image-gen/scripts/edit.ts --input photo.jpg --prompt "Add storm clouds" --output edited.png
 *   bun .claude/skills/image-gen/scripts/edit.ts -i image1.jpg -i image2.jpg -p "Combine these images" -o combined.png
 */

import { parseArgs } from "node:util"
import {
  MODELS,
  DEFAULT_MODEL,
  RESOLUTIONS,
  resolveAspectRatio,
  resolveResolution,
  resolveInputImages,
  saveImage,
  generateTimestampFilename,
  initGateway,
  listModels,
  type Resolution,
} from "./shared.js"
import { getProvider } from "./providers/index.js"

function printUsage(): void {
  console.log(`
Image Editing Script

Usage:
  bun .claude/skills/image-gen/scripts/edit.ts --input image.jpg --prompt "editing instructions" --output result.png

Options:
  -i, --input         Input image file(s) - can specify multiple (required)
  -p, --prompt        Editing instructions (required)
  -o, --output        Output filename (default: public/images/edited-{timestamp}.png)
  -m, --model         Model to use: ${listModels()} (default: ${DEFAULT_MODEL})
  -a, --aspect-ratio  Output aspect ratio (default: auto from input)
  -r, --resolution    Resolution: ${RESOLUTIONS.join(", ")} (Gemini only)
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
  # Simple edit (FLUX)
  bun .claude/skills/image-gen/scripts/edit.ts -i photo.jpg -p "Add dramatic storm clouds" -o dramatic.png

  # Style transfer
  bun .claude/skills/image-gen/scripts/edit.ts -i photo.jpg -p "Convert to watercolor painting style" -o watercolor.png

  # Combine two images
  bun .claude/skills/image-gen/scripts/edit.ts -i image1.jpg -i image2.jpg -p "Combine into a surreal scene" -o combined.png

  # Edit with Gemini (supports resolution)
  bun .claude/skills/image-gen/scripts/edit.ts -i photo.jpg -p "Remove background" -m gemini-flash -r 4K -o nobg.png
`)
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      input: { type: "string", short: "i", multiple: true },
      prompt: { type: "string", short: "p" },
      output: { type: "string", short: "o" },
      model: { type: "string", short: "m", default: DEFAULT_MODEL },
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

  // Resolve model
  const modelKey = values.model as string
  const config = MODELS[modelKey]
  if (!config) {
    console.error(`Error: Unknown model "${modelKey}". Available: ${listModels()}`)
    process.exit(1)
  }

  // Check editing support
  if (!config.supportsEditing) {
    console.error(
      `Error: ${modelKey} does not support image editing. Use one of: ${Object.entries(MODELS)
        .filter(([, c]) => c.supportsEditing)
        .map(([k]) => k)
        .join(", ")}`
    )
    process.exit(1)
  }

  const provider = getProvider(modelKey)

  // Resolve input images
  const inputFiles = values.input as string[]
  if (inputFiles.length > config.maxReferenceImages) {
    console.warn(
      `Warning: ${modelKey} supports max ${config.maxReferenceImages} reference images. Using first ${config.maxReferenceImages}.`
    )
    inputFiles.splice(config.maxReferenceImages)
  }
  const referenceImages = await resolveInputImages(inputFiles)

  // Resolve optional aspect ratio
  const aspectRatio = values["aspect-ratio"]
    ? resolveAspectRatio(values["aspect-ratio"] as string).ratio
    : "1:1"

  // Resolve optional resolution
  let resolution: Resolution | undefined
  if (values.resolution) {
    if (config.supportsResolution) {
      resolution = resolveResolution(values.resolution as string).resolution
    } else {
      console.warn(
        `Warning: --resolution is not supported by ${modelKey}. Ignoring.`
      )
    }
  }

  const outputPath =
    (values.output as string) || generateTimestampFilename("edited")

  // Init gateway
  const { gateway, source } = initGateway()

  const prompt = values.prompt as string

  // Enrich prompt for editing context
  let editingPrompt = prompt
  if (referenceImages.length > 1) {
    editingPrompt = `${prompt}. Combine these ${referenceImages.length} images creatively while following the instructions.`
  } else {
    editingPrompt = `${prompt}. Edit or transform this image based on the instructions.`
  }

  console.log(`\nImage Editing`)
  console.log(`  Input: ${referenceImages.map((i) => i.path).join(", ")}`)
  console.log(`  Model: ${config.id} (${modelKey})`)
  console.log(`  Auth Source: ${source}`)
  console.log(
    `  Prompt: ${prompt.slice(0, 80)}${prompt.length > 80 ? "..." : ""}`
  )
  console.log(`  Output: ${outputPath}`)
  console.log("")

  try {
    console.log("Generating edited image...")

    const result = await provider.generate(gateway, {
      prompt: editingPrompt,
      aspectRatio,
      resolution,
      referenceImages,
    })

    const saved = await saveImage(result.buffer, outputPath)
    console.log(`\n✓ Edited image saved: ${saved}`)

    if (result.text) {
      console.log(`\nModel notes: ${result.text}`)
    }
  } catch (error) {
    console.error("\nError editing image:")
    if (error instanceof Error) {
      if (error.message.includes("api key")) {
        console.error(
          "  Authentication failed. Check AI_GATEWAY_API_KEY or ANTHROPIC_AUTH_TOKEN."
        )
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
