---
name: image-gen
description: Generate and edit images using FLUX, Gemini, and Google Imagen models via Vercel AI Gateway. Use when asked to generate images, create app icons, make hero images, edit photos, create OG images, generate product shots, or batch generate multiple images. Supports text-to-image, image editing with references, and batch processing.
---

# Image Generation Skill

Generate and edit images using FLUX, Gemini, and Google Imagen models via Vercel AI Gateway.

## Available Models

### FLUX (Black Forest Labs)

| Key | Model ID | Best For | Editing | Max Refs |
|-----|----------|----------|---------|----------|
| `flux-kontext-pro` | bfl/flux-kontext-pro | General generation + editing (default) | Yes | 10 |
| `flux-kontext-max` | bfl/flux-kontext-max | Better prompt adherence + typography | Yes | 10 |
| `flux-2-pro` | bfl/flux-2-pro | Next-gen text-to-image | No | 0 |
| `flux-2-flex` | bfl/flux-2-flex | Flexible/fast next-gen | No | 0 |
| `flux-pro` | bfl/flux-pro-1.1 | Fast text-to-image | No | 0 |
| `flux-ultra` | bfl/flux-pro-1.1-ultra | Ultra high-res text-to-image | No | 0 |

### Gemini (Multimodal LLMs)

| Key | Model ID | Best For | Editing | Resolution | Max Refs |
|-----|----------|----------|---------|------------|----------|
| `gemini-flash` | google/gemini-2.5-flash-image | Fast generation + editing with resolution control | Yes | 1K/2K/4K | 10 |
| `gemini-3-pro` | google/gemini-3-pro-image | High quality generation + editing with resolution | Yes | 1K/2K/4K | 14 |

### Google Imagen (Image-only models)

| Key | Model ID | Best For |
|-----|----------|----------|
| `imagen-4-ultra` | google/imagen-4.0-ultra-generate-001 | Highest quality text-to-image |
| `imagen-4` | google/imagen-4.0-generate-001 | Standard quality text-to-image |
| `imagen-4-fast` | google/imagen-4.0-fast-generate-001 | Fastest text-to-image |

### Model Comparison

| | FLUX (BFL) | Gemini | Imagen |
|---|---|---|---|
| **Speed** | Fast | Moderate | Fast |
| **Default** | `flux-kontext-pro` | `gemini-flash` | `imagen-4` |
| **Resolution control** | No (auto) | Yes (1K, 2K, 4K) | No (auto) |
| **Editing/references** | Kontext models only | All models | No |
| **Typography** | Good (`flux-kontext-max` best) | Moderate | Moderate |
| **API** | `generateImage()` | `generateImage()` (fallback `generateText()`) | `generateImage()` |

**When to choose FLUX:** Default choice for most tasks. Fast, high quality, great for generation and editing.
**When to choose Gemini:** When you need specific resolution control (1K/2K/4K) or higher reference image limits.
**When to choose Imagen:** Google's dedicated image models — good for high-quality text-to-image without needing editing.

## IMPORTANT: Always Prefer Batch Generation

**When generating 2 or more images, ALWAYS use `batch.ts` with `--parallel`.** Do NOT call `generate.ts` multiple times — it's slower and wasteful. Write a quick JSON file and batch them.

### Example: Multiple images for a website
```json
[
  { "prompt": "Modern chiropractic clinic exterior", "filename": "hero-bg.png", "aspectRatio": "wide" },
  { "prompt": "Chiropractor treating a patient", "filename": "about-hero.png", "aspectRatio": "landscape" },
  { "prompt": "Spinal adjustment close-up", "filename": "services-hero.png", "aspectRatio": "landscape" },
  { "prompt": "Friendly chiropractor portrait", "filename": "team-doctor.png", "aspectRatio": "portrait" }
]
```
```bash
bun .claude/skills/image-gen/scripts/batch.ts \
  --input prompts.json \
  --output-dir ./public/images/ \
  --parallel 4
```

### Example: Mixed models in one batch
```json
[
  { "prompt": "App icon for finance app", "filename": "icon.png", "model": "flux-kontext-max", "aspectRatio": "square", "style": "minimalism" },
  { "prompt": "Hero background gradient", "filename": "hero.png", "model": "flux-pro", "aspectRatio": "wide" },
  { "prompt": "Detailed product shot", "filename": "product.png", "model": "gemini-3-pro", "resolution": "4K", "aspectRatio": "square" }
]
```

**Rule of thumb:** Only use `generate.ts` for a single one-off image. For everything else, use `batch.ts`.

---

## Available Scripts

### Single Image Generation (use only for 1 image)
```bash
# Text-to-image (FLUX — default)
bun .claude/skills/image-gen/scripts/generate.ts \
  --prompt "A serene Japanese garden with cherry blossoms" \
  --output garden.png \
  --aspect-ratio landscape

# Text-to-image with specific FLUX model
bun .claude/skills/image-gen/scripts/generate.ts \
  --prompt "App icon for finance app" \
  --model flux-kontext-max \
  --aspect-ratio square \
  --style minimalism

# Text-to-image (Gemini with resolution)
bun .claude/skills/image-gen/scripts/generate.ts \
  --prompt "A sunset over mountains" \
  --model gemini-flash \
  --resolution 4K \
  --aspect-ratio landscape

# With reference images
bun .claude/skills/image-gen/scripts/generate.ts \
  --prompt "Create a similar style" \
  --input reference.jpg \
  --input style.png \
  --output styled.png
```

### Batch Generation
```bash
bun .claude/skills/image-gen/scripts/batch.ts \
  --input prompts.json \
  --output-dir ./public/images/batch-hero/ \
  --parallel 3

# Example batch with reference images (see examples file)
bun .claude/skills/image-gen/scripts/batch.ts \
  --input .claude/skills/image-gen/examples/batch-prompts.json \
  --output-dir ./public/images/batch-example/
```

### Image Editing
```bash
# Edit with FLUX (default)
bun .claude/skills/image-gen/scripts/edit.ts \
  --input photo.jpg \
  --prompt "Add dramatic storm clouds to the sky" \
  --output dramatic.png

# Edit with Gemini (for resolution control)
bun .claude/skills/image-gen/scripts/edit.ts \
  --input photo.jpg \
  --prompt "Remove background" \
  --model gemini-flash \
  --resolution 4K \
  --output nobg.png
```

## Parameters

| Parameter | Values | Default |
|-----------|--------|---------|
| `--model` | flux-kontext-pro, flux-kontext-max, flux-2-pro, flux-2-flex, flux-pro, flux-ultra, gemini-flash, gemini-3-pro, imagen-4-ultra, imagen-4, imagen-4-fast | flux-kontext-pro |
| `--resolution` | 1K, 2K, 4K (Gemini only) | 2K |
| `--aspect-ratio` | square, portrait, landscape, wide, 4:3, 3:2, 16:9, 9:16, 21:9 | square |
| `--style` | minimalism, glassy, neon, geometric, flat, etc. | none |
| `--output` | filename.png | public/images/generated-{timestamp}.png |
| `--input` | Reference image paths (can specify multiple) | none |

Defaults:
- `generate.ts` outputs to `public/images/generated-{timestamp}.png`
- `edit.ts` outputs to `public/images/edited-{timestamp}.png`
- `batch.ts` outputs to `public/images/batch-{timestamp}/` (folder created automatically)

## Reference Image Search Paths

When specifying reference images, the scripts search in:
- Current directory
- `public/images/`
- `public/uploads/`
- `images/`
- `assets/`
- `input/`

## Environment

Requires either:
- `AI_GATEWAY_API_KEY` (preferred), or
- `ANTHROPIC_AUTH_TOKEN` (fallback)

Both are treated as the Vercel AI Gateway auth token for these scripts.
The scripts auto-load `.env`, `.env.local`, `.env.development`, and `.env.development.local` from the current working directory.

## Reference Templates

Read the reference files for specialized prompting guidance:

| Use Case | Reference File |
|----------|----------------|
| OpenGraph images | `references/prompts/og-hero.md` |
| App icons | `references/prompts/app-icon.md` |
| Profile avatars | `references/prompts/profile-avatar.md` |
| Hero sections | `references/prompts/hero-section.md` |
| Patterns/textures | `references/prompts/pattern.md` |
| Technical diagrams | `references/prompts/diagram.md` |
| Angle variants | `references/prompts/angles.md` |
| Style presets | `references/styles/style-presets.md` |

## Batch JSON Format

```json
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
```

**CSV Format** (use `|` to separate multiple reference images):
```csv
prompt,filename,model,resolution,aspectRatio,style,referenceImages
"Create variation of this",variant.png,flux-kontext-pro,,square,,product.jpg|style.png
```

## Common Workflows

**All multi-image workflows below use `batch.ts` — never call `generate.ts` in a loop.**

### Website Image Generation
Batch generate all needed images in one go:
1. Create a JSON file with all prompts (hero, about, services, team, etc.)
2. Run `batch.ts --parallel N` where N = number of images
3. All images generate concurrently — much faster than sequential calls

### Resolution Comparison (Gemini only)
Generate the same prompt at multiple resolutions to compare quality:
1. Create a JSON file with identical prompts but different `resolution` values (1K, 2K, 4K)
2. Set `model` to `gemini-flash` or `gemini-3-pro` per item
3. Run `batch.ts --parallel 3`

### Style Comparison
Generate the same prompt with different styles to compare looks:
1. Create a JSON file with identical prompts but different `style` values
2. Run `batch.ts --parallel N`

### Product Photography Angles
Use batch.ts with angle variants (see `references/prompts/angles.md`):
- front, side, 3/4, above, detail views

### App Icon Set
Generate icon in multiple styles for A/B testing using batch.ts.

### Mixed Model Batch
Use different models per item in a single batch run:
```json
[
  { "prompt": "Fast draft", "model": "flux-pro", "filename": "draft.png" },
  { "prompt": "High quality final", "model": "gemini-3-pro", "resolution": "4K", "filename": "final.png" }
]
```
