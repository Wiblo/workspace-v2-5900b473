#!/usr/bin/env bun
/**
 * Single image generation via Vercel AI Gateway
 *
 * Usage:
 *   bun .claude/skills/image-gen/scripts/generate.ts --prompt "description" --output image.png
 *   bun .claude/skills/image-gen/scripts/generate.ts -p "a sunset" -o sunset.png -m flux-kontext-pro -a landscape
 *   bun .claude/skills/image-gen/scripts/generate.ts -p "Create variations" -i reference.jpg -i style.png -o result.png
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
  type ResolvedImage,
} from "./shared.js"
import { getProvider } from "./providers/index.js"

function printUsage(): void {
  console.log(`
Image Generation Script

Usage:
  bun .claude/skills/image-gen/scripts/generate.ts --prompt "your description" [options]

Options:
  -p, --prompt        Image description (required)
  -i, --input         Reference image(s) - can specify multiple (optional)
  -o, --output        Output filename (default: public/images/generated-{timestamp}.png)
  -m, --model         Model to use: ${listModels()} (default: ${DEFAULT_MODEL})
  -r, --resolution    Resolution: ${RESOLUTIONS.join(", ")} (Gemini only, default: 2K)
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
  # Text-to-image (FLUX)
  bun .claude/skills/image-gen/scripts/generate.ts -p "A serene Japanese garden" -o garden.png
  bun .claude/skills/image-gen/scripts/generate.ts -p "App icon for finance app" -a square -s minimalism -m flux-kontext-max

  # Text-to-image (Gemini with resolution)
  bun .claude/skills/image-gen/scripts/generate.ts -p "A sunset" -m gemini-flash -r 4K -a landscape

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
      model: { type: "string", short: "m", default: DEFAULT_MODEL },
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

  // Resolve model
  const modelKey = values.model as string
  const config = MODELS[modelKey]
  if (!config) {
    console.error(`Error: Unknown model "${modelKey}". Available: ${listModels()}`)
    process.exit(1)
  }

  const provider = getProvider(modelKey)

  // Resolve aspect ratio
  const { ratio: aspectRatio } = resolveAspectRatio(
    values["aspect-ratio"] as string
  )

  // Resolve resolution (warn if used with BFL)
  const resolutionInput = values.resolution as string
  let resolution: Resolution | undefined
  if (config.supportsResolution) {
    resolution = resolveResolution(resolutionInput).resolution
  } else if (resolutionInput && resolutionInput !== "2K") {
    console.warn(
      `Warning: --resolution is not supported by ${modelKey} (only Gemini models support resolution). Ignoring.`
    )
  }

  // Resolve reference images
  const inputFiles = (values.input as string[] | undefined) || []
  let referenceImages: ResolvedImage[] | undefined = undefined

  if (inputFiles.length > 0) {
    if (config.maxReferenceImages === 0) {
      console.error(
        `Error: ${modelKey} does not support reference images. Use ${DEFAULT_MODEL} or gemini-flash for editing.`
      )
      process.exit(1)
    }
    if (inputFiles.length > config.maxReferenceImages) {
      console.warn(
        `Warning: ${modelKey} supports max ${config.maxReferenceImages} reference images. Using first ${config.maxReferenceImages}.`
      )
      inputFiles.splice(config.maxReferenceImages)
    }
    referenceImages = await resolveInputImages(inputFiles)
  }

  const outputPath =
    (values.output as string) || generateTimestampFilename("generated")

  // Init gateway
  const { gateway, source } = initGateway()

  console.log(`Generating image...`)
  console.log(`  Model: ${config.id} (${modelKey})`)
  console.log(`  Auth Source: ${source}`)
  if (resolution) console.log(`  Resolution: ${resolution}`)
  console.log(`  Aspect Ratio: ${aspectRatio}`)
  if (referenceImages?.length) {
    console.log(
      `  Reference Images: ${referenceImages.map((i) => i.path).join(", ")}`
    )
  }
  const prompt = values.prompt as string
  console.log(
    `  Prompt: ${prompt.slice(0, 100)}${prompt.length > 100 ? "..." : ""}`
  )

  try {
    const result = await provider.generate(gateway, {
      prompt,
      aspectRatio,
      resolution,
      style: values.style as string | undefined,
      referenceImages,
    })

    const saved = await saveImage(result.buffer, outputPath)
    console.log(`\n✓ Image saved: ${saved}`)

    if (result.text) {
      console.log(`\nModel notes: ${result.text}`)
    }
  } catch (error) {
    console.error("\nError generating image:")
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
