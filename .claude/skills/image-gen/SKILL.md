---
name: image-gen
description: Generate and edit images using Gemini via Vercel AI Gateway. Use when asked to generate images, create app icons, make hero images, edit photos, create OG images, generate product shots, or batch generate multiple images. Supports text-to-image, image editing with references, and batch processing.
---

# Image Generation Skill

Generate and edit images using Gemini via Vercel AI Gateway.

## Available Scripts

### Single Image Generation
```bash
# Text-to-image
bun .claude/skills/image-gen/scripts/generate.ts \
  --prompt "A serene Japanese garden with cherry blossoms" \
  --output garden.png \
  --model gemini-flash \
  --resolution 2K \
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
```

```bash
# Example batch with reference images (see examples file)
bun .claude/skills/image-gen/scripts/batch.ts \
  --input .claude/skills/image-gen/examples/batch-prompts.json \
  --output-dir ./public/images/batch-example/
```

### Image Editing
```bash
bun .claude/skills/image-gen/scripts/edit.ts \
  --input photo.jpg \
  --prompt "Add dramatic storm clouds to the sky" \
  --output dramatic.png
```

## Parameters

| Parameter | Values | Default |
|-----------|--------|---------|
| `--model` | gemini-3-pro, gemini-flash | gemini-flash |
| `--resolution` | 1K, 2K, 4K | 2K |
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

Requires `AI_GATEWAY_API_KEY` environment variable (Vercel AI Gateway key).
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
    "resolution": "2K",
    "aspectRatio": "16:9",
    "style": "minimalism",
    "referenceImages": ["reference.jpg", "style.png"]
  }
]
```

**CSV Format** (use `|` to separate multiple reference images):
```csv
prompt,filename,resolution,aspectRatio,style,referenceImages
"Create variation of this",variant.png,2K,square,,product.jpg|style.png
```

## Common Workflows

### Website Image Generation
When creating a new website, batch generate all needed images:
1. Hero background images
2. OG/social sharing images
3. Team avatars (if needed)
4. Service/feature images

### Product Photography Angles
Use batch.ts with angle variants (see `references/prompts/angles.md`):
- front, side, 3/4, above, detail views

### App Icon Set
Generate icon in multiple styles for A/B testing using batch.ts.
