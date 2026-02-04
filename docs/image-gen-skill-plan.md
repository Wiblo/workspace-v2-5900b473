# Image Generation Skill Plan

## Overview

Create a Claude Code skill for AI-powered image generation using TypeScript scripts and Vercel AI Gateway. This complements the existing `metadata-files` skill (template-based OG) with creative AI generation.

## Architecture

```
~/.claude/skills/image-gen/
├── SKILL.md                      # Skill definition
├── scripts/
│   ├── generate.ts               # Single image generation
│   ├── batch.ts                  # Batch generation (CSV/JSON)
│   └── edit.ts                   # Image editing with references
├── references/
│   ├── README.md                 # How to use references
│   ├── prompts/
│   │   ├── og-hero.md            # AI-generated OG images
│   │   ├── app-icon.md           # App icon templates
│   │   ├── profile-avatar.md     # Profile/avatar templates
│   │   └── hero-section.md       # Website hero images
│   └── styles/
│       └── style-presets.md      # Style definitions
└── examples/
    ├── batch-prompts.json        # Example batch input
    └── batch-prompts.csv         # CSV format example
```

## SKILL.md Definition

```yaml
---
name: image-gen
description: Generate and edit images using Gemini via Vercel AI Gateway. Use for app icons, hero images, profile avatars, creative OG images, and batch generation. Supports text-to-image, image editing, and style presets.
---

# Image Generation

Generate and edit images using Gemini via Vercel AI Gateway.

## Usage

### Single Image
```bash
bun ~/.claude/skills/image-gen/scripts/generate.ts \
  --prompt "A serene Japanese garden with cherry blossoms" \
  --output garden.png \
  --model gemini-flash \
  --resolution 4K \
  --aspect-ratio landscape
```

### Batch Generation
```bash
bun ~/.claude/skills/image-gen/scripts/batch.ts \
  --input prompts.json \
  --output-dir ./public/images/batch-hero/ \
  --parallel 5
```

```bash
# Example batch with reference images (see examples file)
bun ~/.claude/skills/image-gen/scripts/batch.ts \
  --input ~/.claude/skills/image-gen/examples/batch-prompts.json \
  --output-dir ./public/images/batch-example/
```

### Image Editing
```bash
bun ~/.claude/skills/image-gen/scripts/edit.ts \
  --input photo.jpg \
  --prompt "Add dramatic storm clouds" \
  --output dramatic.png
```

## Parameters

| Parameter | Values | Default |
|-----------|--------|---------|
| `--model` | gemini-3-pro, gemini-flash | gemini-flash |
| `--resolution` | 1K, 2K, 4K | 2K |
| `--aspect-ratio` | square, portrait, landscape, wide, 4:3, 3:2 | square |
| `--style` | minimalism, glassy, neon, geometric, flat, etc. | none |
| `--output` | filename.png | public/images/generated-{timestamp}.png |

Defaults:
- `generate.ts` outputs to `public/images/generated-{timestamp}.png`
- `edit.ts` outputs to `public/images/edited-{timestamp}.png`
- `batch.ts` outputs to `public/images/batch-{timestamp}/` (folder created automatically)

## Environment

Requires `AI_GATEWAY_API_KEY` environment variable.
The scripts auto-load `.env`, `.env.local`, `.env.development`, and `.env.development.local` from the current working directory.

## Reference Templates

Read `references/prompts/*.md` for curated prompt templates by use case.
Read `references/styles/style-presets.md` for available style presets.
```

## Core Scripts

### 1. generate.ts (Single Image)

```typescript
#!/usr/bin/env bun
/**
 * Single image generation via Vercel AI Gateway
 *
 * Usage:
 *   bun generate.ts --prompt "description" --output image.png
 */

import { generateText } from 'ai';
import { createGateway } from '@ai-sdk/gateway';
import { parseArgs } from 'node:util';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const ASPECT_RATIOS = {
  square: '1:1',
  portrait: '9:16',
  landscape: '16:9',
  wide: '21:9',
  '4:3': '4:3',
  '3:2': '3:2',
  '3:4': '3:4',
  '2:3': '2:3',
} as const;

const MODELS = {
  'gemini-3-pro': 'google/gemini-3-pro-image',
  'gemini-flash': 'google/gemini-2.5-flash-image',
} as const;

async function main() {
  const { values } = parseArgs({
    options: {
      prompt: { type: 'string', short: 'p' },
      output: { type: 'string', short: 'o', default: `public/images/generated-${Date.now()}.png` },
      model: { type: 'string', short: 'm', default: 'gemini-flash' },
      resolution: { type: 'string', short: 'r', default: '2K' },
      'aspect-ratio': { type: 'string', short: 'a', default: 'square' },
      style: { type: 'string', short: 's' },
    },
  });

  if (!values.prompt) {
    console.error('Error: --prompt is required');
    process.exit(1);
  }

  const apiKey = process.env.AI_GATEWAY_API_KEY;
  if (!apiKey) {
    console.error('Error: AI_GATEWAY_API_KEY environment variable required');
    process.exit(1);
  }

  const gateway = createGateway({ apiKey });
  const modelId = MODELS[values.model as keyof typeof MODELS] || MODELS['gemini-flash'];
  const aspectRatio = ASPECT_RATIOS[values['aspect-ratio'] as keyof typeof ASPECT_RATIOS] || '1:1';

  // Build prompt with optional style
  let finalPrompt = values.prompt;
  if (values.style) {
    finalPrompt = `${values.prompt}. Style: ${values.style}`;
  }

  console.log(`Generating image with ${modelId}...`);
  console.log(`Prompt: ${finalPrompt}`);
  console.log(`Resolution: ${values.resolution}, Aspect: ${aspectRatio}`);

  const result = await generateText({
    model: gateway(modelId),
    prompt: finalPrompt,
    providerOptions: {
      google: {
        responseModalities: ['IMAGE'],
        imageConfig: {
          aspectRatio,
          imageSize: values.resolution,
        },
      },
    },
  });

  // Save images
  const imageFiles = result.files?.filter(f => f.mediaType?.startsWith('image/')) || [];

  if (imageFiles.length === 0) {
    console.error('Error: No image generated');
    process.exit(1);
  }

  await mkdir(dirname(values.output), { recursive: true });
  await writeFile(values.output, imageFiles[0].uint8Array);
  console.log(`✓ Saved: ${values.output}`);
}

main().catch(console.error);
```

### 2. batch.ts (Batch Generation)

```typescript
#!/usr/bin/env bun
/**
 * Batch image generation from JSON/CSV
 *
 * Usage:
 *   bun batch.ts --input prompts.json --output-dir ./public/images/batch-hero/
 */

import { generateText } from 'ai';
import { createGateway } from '@ai-sdk/gateway';
import { parseArgs } from 'node:util';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import { parse as parseCSV } from 'csv-parse/sync';

interface BatchPrompt {
  prompt: string;
  filename?: string;
  model?: string;
  resolution?: string;
  aspectRatio?: string;
  style?: string;
}

async function main() {
  const { values } = parseArgs({
    options: {
      input: { type: 'string', short: 'i' },
      'output-dir': { type: 'string', short: 'o', default: `public/images/batch-${Date.now()}` },
      parallel: { type: 'string', short: 'p', default: '3' },
      model: { type: 'string', short: 'm', default: 'gemini-flash' },
    },
  });

  if (!values.input) {
    console.error('Error: --input is required');
    process.exit(1);
  }

  const apiKey = process.env.AI_GATEWAY_API_KEY;
  if (!apiKey) {
    console.error('Error: AI_GATEWAY_API_KEY required');
    process.exit(1);
  }

  // Parse input file
  const content = await readFile(values.input, 'utf-8');
  let prompts: BatchPrompt[];

  if (extname(values.input) === '.csv') {
    prompts = parseCSV(content, { columns: true, skip_empty_lines: true });
  } else {
    prompts = JSON.parse(content);
  }

  console.log(`Processing ${prompts.length} prompts with parallelism ${values.parallel}...`);
  await mkdir(values['output-dir'], { recursive: true });

  const gateway = createGateway({ apiKey });
  const parallelism = parseInt(values.parallel, 10);

  // Process in batches
  for (let i = 0; i < prompts.length; i += parallelism) {
    const batch = prompts.slice(i, i + parallelism);

    await Promise.all(batch.map(async (item, idx) => {
      const globalIdx = i + idx;
      const filename = item.filename || `image-${globalIdx + 1}.png`;
      const outputPath = join(values['output-dir'], filename);
      const modelId = `google/${item.model || values.model}-image`;

      try {
        const result = await generateText({
          model: gateway(modelId),
          prompt: item.prompt,
          providerOptions: {
            google: {
              responseModalities: ['IMAGE'],
              imageConfig: {
                aspectRatio: item.aspectRatio || '1:1',
                imageSize: item.resolution || '2K',
              },
            },
          },
        });

        const imageFiles = result.files?.filter(f => f.mediaType?.startsWith('image/')) || [];
        if (imageFiles.length > 0) {
          await writeFile(outputPath, imageFiles[0].uint8Array);
          console.log(`✓ [${globalIdx + 1}/${prompts.length}] ${filename}`);
        }
      } catch (error) {
        console.error(`✗ [${globalIdx + 1}/${prompts.length}] ${filename}: ${error}`);
      }
    }));
  }

  console.log(`\nDone! Images saved to ${values['output-dir']}`);
}

main().catch(console.error);
```

### 3. edit.ts (Image Editing)

```typescript
#!/usr/bin/env bun
/**
 * Image editing with reference images
 *
 * Usage:
 *   bun edit.ts --input photo.jpg --prompt "Add storm clouds" --output edited.png
 */

import { generateText } from 'ai';
import { createGateway } from '@ai-sdk/gateway';
import { parseArgs } from 'node:util';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

async function main() {
  const { values } = parseArgs({
    options: {
      input: { type: 'string', short: 'i', multiple: true },
      prompt: { type: 'string', short: 'p' },
      output: { type: 'string', short: 'o', default: `public/images/edited-${Date.now()}.png` },
      model: { type: 'string', short: 'm', default: 'gemini-flash' },
      resolution: { type: 'string', short: 'r' }, // Auto-detect from input if not set
    },
  });

  if (!values.input?.length || !values.prompt) {
    console.error('Error: --input and --prompt are required');
    process.exit(1);
  }

  const apiKey = process.env.AI_GATEWAY_API_KEY;
  if (!apiKey) {
    console.error('Error: AI_GATEWAY_API_KEY required');
    process.exit(1);
  }

  // Load input images
  const images = await Promise.all(
    values.input.map(async (path) => {
      const data = await readFile(path);
      const ext = path.split('.').pop()?.toLowerCase();
      const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
                       ext === 'png' ? 'image/png' :
                       ext === 'webp' ? 'image/webp' : 'image/jpeg';
      return {
        type: 'image' as const,
        image: data,
        mimeType,
      };
    })
  );

  const gateway = createGateway({ apiKey });
  const modelId = `google/${values.model === 'gemini-3-pro' ? 'gemini-3-pro-image' : 'gemini-2.5-flash-image'}`;

  console.log(`Editing ${values.input.length} image(s) with ${modelId}...`);
  console.log(`Prompt: ${values.prompt}`);

  const result = await generateText({
    model: gateway(modelId),
    messages: [
      {
        role: 'user',
        content: [
          ...images,
          { type: 'text', text: values.prompt },
        ],
      },
    ],
    providerOptions: {
      google: {
        responseModalities: ['IMAGE'],
        imageConfig: values.resolution ? { imageSize: values.resolution } : undefined,
      },
    },
  });

  const imageFiles = result.files?.filter(f => f.mediaType?.startsWith('image/')) || [];

  if (imageFiles.length === 0) {
    console.error('Error: No image generated');
    process.exit(1);
  }

  await mkdir(dirname(values.output), { recursive: true });
  await writeFile(values.output, imageFiles[0].uint8Array);
  console.log(`✓ Saved: ${values.output}`);
}

main().catch(console.error);
```

## Reference Prompt Templates

### references/prompts/og-hero.md

```markdown
# OpenGraph Hero Images (AI-Generated)

For creative, unique OG images that go beyond templates.
Use the existing `metadata-files` skill for standard template-based OG images.

## When to Use AI-Generated OG

- Landing pages needing unique, eye-catching visuals
- Product launches with custom branding
- Feature announcements with creative imagery
- Brand differentiators

## Prompt Template

```
Create a premium open-graph hero image for [BRAND]:

A wide horizontal layout (16:9 ratio) designed for social sharing.
High-end designer mockup presentation suitable for branding.

LAYOUT:
- LEFT: Logo and brand name (top-left), single large headline (3-6 words)
- RIGHT: Floating interface panel suggesting [product type]
- Strong negative space, nothing cramped

COLOR: [Brand colors from brand-guide.md]
STYLE: Clean SaaS hero, flat or near-flat, subtle shadows
MOOD: Premium, polished, quiet confidence

AVOID: Stock photos, people, complex illustrations, decorative patterns,
       text other than headline, borders/frames
```

## Examples

### SaaS Product
```json
{
  "prompt": "Premium OG image for Acme Analytics: Left zone has 'Acme' logo top-left, headline 'Ship Faster with AI' below. Right zone shows floating dashboard panel with charts. Clean white background, blue (#3B82F6) accents. Flat design, subtle shadows, professional.",
  "filename": "og-landing.png",
  "aspectRatio": "16:9",
  "resolution": "2K"
}
```

### Feature Announcement
```json
{
  "prompt": "OG image announcing new feature: Left shows 'New: Real-time Sync' headline in bold. Right shows floating notification panel with sync icon. Gradient background from purple (#8B5CF6) to blue (#3B82F6). Modern, minimal.",
  "filename": "og-feature.png",
  "aspectRatio": "16:9",
  "resolution": "2K"
}
```
```

### references/prompts/app-icon.md

```markdown
# App Icons

Generate iOS/Android app icons with various styles.

## Technical Requirements

- **Size**: 1024x1024 (scaled down for platforms)
- **Aspect Ratio**: 1:1 (square)
- **Format**: PNG with transparency support
- **Safe Area**: Keep critical details within central 70%

## Prompt Structure

```
[ICON_TYPE] app icon for [APP_PURPOSE]:

Subject: [main visual element]
Style: [style preset from styles/style-presets.md]
Colors: [2-3 colors max]

Technical:
- Full-bleed 1024x1024 square artwork
- Main subject fills 92-98% of canvas
- No text, typography, or brand marks
- Platform corners applied later
```

## Icon Types

| Type | Best For | Description |
|------|----------|-------------|
| `object_icon` | Finance, productivity | Single physical/symbolic object |
| `abstract_form_icon` | AI tools, analytics | Pure form, geometric metaphor |
| `hybrid_icon` | Health, lifestyle | Object with subtle life cues |
| `character_icon` | Kids, games, wellness | Friendly expressive character |

## Examples by Style

### Minimalism
```json
{
  "prompt": "Minimalist app icon for a finance app: A single shield with subtle checkmark inside. Swiss design, max 3 colors (navy blue, white, gold accent). Clean edges, no gradients. Full-bleed, no margins.",
  "filename": "icon-finance-minimal.png",
  "style": "minimalism",
  "resolution": "4K"
}
```

### Glassy
```json
{
  "prompt": "Glassy app icon for a weather app: Translucent sun partially behind cloud. iOS 15/VisionOS glassmorphism with layered depth. Soft gradients, light refraction effects. Blue to orange palette.",
  "filename": "icon-weather-glass.png",
  "style": "glassy",
  "resolution": "4K"
}
```

### Neon
```json
{
  "prompt": "Neon app icon for a gaming app: Stylized controller silhouette with glowing edges. Cyberpunk aesthetic, dark purple (#1a0a2e) background, cyan (#00f0ff) and magenta (#ff00ff) neon glow.",
  "filename": "icon-game-neon.png",
  "style": "neon",
  "resolution": "4K"
}
```

### Kawaii
```json
{
  "prompt": "Kawaii app icon for a meditation app: Cute chibi cloud character with closed eyes and small smile. Pastel colors (lavender, soft pink, mint). Big head, tiny body proportions. Soft rounded edges.",
  "filename": "icon-meditate-kawaii.png",
  "style": "kawaii",
  "resolution": "4K"
}
```
```

### references/prompts/profile-avatar.md

```markdown
# Profile Avatars

Generate profile pictures, team headshots, and 3D figurines.

## Types

### Professional Portrait
For team pages, about sections, corporate.

```json
{
  "prompt": "Professional portrait style avatar: [Gender] in their [age]s, [ethnicity if specified], wearing [attire]. Confident but approachable expression. Soft studio lighting, neutral background. High-end corporate photography style.",
  "filename": "avatar-team-member.png",
  "aspectRatio": "square",
  "resolution": "2K"
}
```

### 3D Figurine
Popular collectible toy style.

```json
{
  "prompt": "3D miniature figurine avatar: [Description of person/character]. Styled like a collectible toy. Standing pose with [pose description]. Glossy resin plastic texture, realistic clothing details. Round black display stand, studio light background.",
  "filename": "avatar-figurine.png",
  "resolution": "4K"
}
```

### Illustrated Avatar
For casual/creative brands.

```json
{
  "prompt": "Illustrated avatar: [Description]. Flat vector art style, bold outlines, limited color palette (4-5 colors). Friendly expression, slightly stylized proportions. Clean background.",
  "filename": "avatar-illustrated.png",
  "style": "flat",
  "resolution": "2K"
}
```

## Important Notes

- Always specify gender, approximate age, and any relevant characteristics
- Avoid generating specific real people (celebrities, public figures)
- For team photos, maintain consistent style across batch
```

### references/prompts/pattern.md

```markdown
# Seamless Patterns & Textures

Generate tileable patterns for backgrounds, textures, and design elements.

## Prompt Structure

```
${prompt}, ${style} style ${type} pattern, ${density} density,
${colors} colors, ${size} tile size, seamless tileable, high quality
```

## Parameters

| Parameter | Values |
|-----------|--------|
| type | geometric, organic, abstract, floral, minimal |
| density | sparse, medium, dense |
| size | small, medium, large |

## Examples

### Geometric Pattern
```json
{
  "prompt": "Modern geometric pattern with interlocking hexagons, minimal style, navy and gold colors, medium density, seamless tileable",
  "filename": "pattern-geo-navy.png",
  "resolution": "2K",
  "aspectRatio": "1:1"
}
```

### Organic Pattern
```json
{
  "prompt": "Subtle organic leaf pattern, watercolor style, sage green and cream colors, sparse density, seamless tileable background",
  "filename": "pattern-leaves.png",
  "resolution": "2K",
  "aspectRatio": "1:1"
}
```
```

### references/prompts/diagram.md

```markdown
# Technical Diagrams

Generate flowcharts, architecture diagrams, and technical illustrations.

## Prompt Structure

```
${prompt}, ${type} diagram, ${style} style, ${layout} layout,
${complexity} level of detail, ${colors} color scheme,
${annotations} annotations, clean technical illustration
```

## Types

| Type | Best For |
|------|----------|
| flowchart | Process flows, decision trees |
| architecture | System diagrams, infrastructure |
| sequence | API flows, user journeys |
| hierarchy | Org charts, taxonomies |
| comparison | Feature matrices, before/after |

## Examples

### Architecture Diagram
```json
{
  "prompt": "Cloud architecture diagram showing web app with load balancer, API servers, database, and CDN. Modern flat style, blue and gray colors, clear labels, horizontal layout",
  "filename": "diagram-architecture.png",
  "resolution": "4K",
  "aspectRatio": "16:9"
}
```

### Process Flowchart
```json
{
  "prompt": "User onboarding flowchart with 5 steps: signup, verify email, complete profile, connect accounts, dashboard. Vertical layout, rounded boxes, green and white colors, numbered steps",
  "filename": "diagram-onboarding.png",
  "resolution": "2K",
  "aspectRatio": "3:4"
}
```
```

### references/prompts/hero-section.md

```markdown
# Website Hero Images

Background images for hero sections, headers, and feature areas.

## Types

### Abstract Background
```json
{
  "prompt": "Abstract hero background: Flowing gradient mesh of [colors]. Subtle organic shapes, depth through layering. Clean and professional, suitable for text overlay. No specific objects or subjects.",
  "filename": "hero-bg-abstract.png",
  "aspectRatio": "wide",
  "resolution": "4K"
}
```

### Lifestyle/Contextual
```json
{
  "prompt": "Lifestyle hero image for [business type]: [Scene description]. Warm, inviting atmosphere. Professional photography style. Space on [left/right] for text overlay.",
  "filename": "hero-lifestyle.png",
  "aspectRatio": "wide",
  "resolution": "4K"
}
```

### Product/Service Showcase
```json
{
  "prompt": "Product showcase hero: [Product/service] presented on clean surface. Soft shadows, professional lighting. Minimal background with subtle gradient. Premium, polished presentation.",
  "filename": "hero-product.png",
  "aspectRatio": "landscape",
  "resolution": "4K"
}
```

## Aspect Ratios for Hero

| Use Case | Ratio | Resolution |
|----------|-------|------------|
| Full-width hero | 21:9 (wide) | 4K |
| Standard hero | 16:9 (landscape) | 2K-4K |
| Split hero | 4:3 | 2K |
| Mobile hero | 9:16 (portrait) | 2K |
```

### references/styles/style-presets.md

```markdown
# Style Presets

Use with `--style` parameter or in batch JSON.

## Available Styles

### minimalism
Swiss/Apple design, max 3 colors, monochrome-safe, clean edges, no gradients.

### glassy
Glassmorphism (iOS 15+/VisionOS), translucent layers, frosted effects, depth.

### geometric
Bauhaus, strict grid, mathematical shapes, primary colors, bold contrast.

### neon
Cyberpunk glow, high saturation, dark backgrounds, light trails, electric.

### gradient
Modern social-app gradients, smooth color flow, vibrant transitions.

### flat
Pure flat corporate (Microsoft-style), zero depth, solid colors, clean.

### material
Material Design 3, subtle elevation, rounded shapes, dynamic color.

### pixel
8-bit pixel grid, retro gaming, hard edges, limited palette.

### clay
Claymorphism, soft rounded forms, pastel palette, subtle 3D depth.

### kawaii
Japanese cute, chibi proportions, big eyes, pastel colors, rounded.

### ios-classic
Pre-iOS7 skeuomorphism, realistic materials, shadows, glossy surfaces.

### holographic
Iridescent, color-shifting, light-reactive, prismatic effects.

## Usage Examples

**CLI:**
```bash
bun generate.ts --prompt "App icon for music app" --style neon
```

**Batch JSON:**
```json
{
  "prompt": "App icon for meditation app",
  "style": "kawaii",
  "filename": "icon-meditate.png"
}
```

**In Prompt:**
```
Create an app icon for a finance app. Style: minimalism. Colors: navy, white, gold.
```
```

### references/prompts/angles.md

```markdown
# Angle Variants

Reference for generating multiple views of the same subject from different angles.
Best workflow for consistency:
1) Generate a single front/hero image first.
2) Use that image as a reference for all other angles in batch.ts.
3) Keep the same background/lighting instructions across prompts.

## Angle Presets

### Product Photography
| Angle | Prompt Addition |
|-------|-----------------|
| front | "front view, straight on" |
| side | "side profile view, 90 degrees" |
| 3/4 | "three-quarter view, 45 degree angle" |
| above | "top-down view, from directly above" |
| below | "low angle, looking up" |
| detail | "close-up detail shot, macro view" |
| hero | "hero shot, dramatic angle with slight tilt" |

### Character/Avatar
| Angle | Prompt Addition |
|-------|-----------------|
| portrait | "portrait view, head and shoulders" |
| profile | "side profile, facing left" |
| over-shoulder | "over the shoulder view" |

### Environment
| Angle | Prompt Addition |
|-------|-----------------|
| wide | "wide establishing shot" |
| aerial | "aerial view, birds eye perspective" |

## Example: Batch JSON for Product Angles

When user asks for "product shots of a lamp from multiple angles",
construct a batch like this:

```json
[
  {
    "prompt": "Modern desk lamp, product photography, white background, front view straight on",
    "filename": "lamp-front.png"
  },
  {
    "prompt": "Modern desk lamp, product photography, white background, side profile view",
    "filename": "lamp-side.png",
    "referenceImages": ["lamp-front.png"]
  },
  {
    "prompt": "Modern desk lamp, product photography, white background, three-quarter view 45 degree angle",
    "filename": "lamp-3-4.png",
    "referenceImages": ["lamp-front.png"]
  },
  {
    "prompt": "Modern desk lamp, product photography, white background, top-down view from above",
    "filename": "lamp-above.png",
    "referenceImages": ["lamp-front.png"]
  },
  {
    "prompt": "Modern desk lamp, product photography, white background, close-up detail shot",
    "filename": "lamp-detail.png",
    "referenceImages": ["lamp-front.png"]
  }
]
```

## With Reference Image

Generate a front view first, then use it as the reference for angle variants:
```bash
bun .claude/skills/image-gen/scripts/generate.ts \
  --prompt "Modern desk lamp, product photography, white background, front view straight on" \
  --output public/images/lamp-front.png
```
Then use `referenceImages: ["lamp-front.png"]` in batch JSON/CSV for the rest.
```

---

## Example Batch Files

### examples/batch-prompts.json

```json
[
  {
    "prompt": "App icon for a productivity app: Minimalist checkmark inside rounded square. Navy blue (#1e3a5f) and white. Clean Swiss design, no gradients.",
    "filename": "icon-productivity.png",
    "resolution": "4K",
    "aspectRatio": "1:1",
    "style": "minimalism"
  },
  {
    "prompt": "Hero background for SaaS landing: Abstract gradient mesh with purple (#8B5CF6) and blue (#3B82F6). Flowing organic shapes, suitable for text overlay.",
    "filename": "hero-saas.png",
    "resolution": "4K",
    "aspectRatio": "21:9"
  },
  {
    "prompt": "OG image for tech startup: Left shows 'Launch Day' headline, right shows floating laptop with dashboard. White background, green (#10B981) accents. Clean SaaS style.",
    "filename": "og-launch.png",
    "resolution": "2K",
    "aspectRatio": "16:9"
  },
  {
    "prompt": "Profile avatar: Professional woman in her 30s, wearing navy blazer, confident smile. Soft studio lighting, neutral gray background.",
    "filename": "avatar-team-1.png",
    "resolution": "2K",
    "aspectRatio": "1:1"
  },
  {
    "prompt": "Profile avatar: Professional man in his 40s, wearing gray suit, approachable expression. Soft studio lighting, neutral gray background.",
    "filename": "avatar-team-2.png",
    "resolution": "2K",
    "aspectRatio": "1:1"
  }
]
```

### examples/batch-prompts.csv

```csv
prompt,filename,resolution,aspectRatio,style
"App icon for weather app: Sun behind cloud, glassy iOS style, blue and orange gradient",icon-weather.png,4K,1:1,glassy
"App icon for fitness app: Stylized dumbbell, neon glow, dark background",icon-fitness.png,4K,1:1,neon
"App icon for notes app: Pencil and paper, minimalist flat design",icon-notes.png,4K,1:1,flat
```

## Additional Insights from Nanobanana

### Reference-Based Specialization
Instead of code-based prompt builders, all specialized knowledge lives in reference markdown files:
- `references/prompts/app-icon.md` - Icon generation guidance
- `references/prompts/pattern.md` - Tileable pattern guidance
- `references/prompts/diagram.md` - Technical diagram guidance
- `references/prompts/angles.md` - Angle variant presets

The AI reads the relevant reference when the user's request matches that category.

### Smart Variation System
```typescript
// Variation types that expand a single prompt into multiple images
const VARIATION_TYPES = {
  lighting: ["dramatic lighting", "soft lighting", "natural lighting"],
  angle: ["from above", "close-up view", "wide angle"],
  composition: ["centered", "rule of thirds", "asymmetric"],
  mood: ["cheerful", "dramatic", "serene"],
  time: ["at sunrise", "at golden hour", "at dusk"],
};
```

### Multi-Location Input Search
Search for input images in multiple common locations:
```typescript
const SEARCH_PATHS = [
  '',
  'public/images/',
  'public/uploads/',
  'images/',
  'assets/',
  'input/',
];
```

### Response Data Robustness
Check multiple locations for image data in API responses:
```typescript
// Primary: inlineData.data
// Fallback: part.text if valid base64
// Validation: length > 1000 chars
```

---

## Implementation Phases

### Phase 1: Core Scripts (MVP)
- [ ] `generate.ts` - Single image generation
- [ ] Basic CLI with prompt, output, model, resolution
- [ ] Vercel AI Gateway integration
- [ ] Error handling and validation
- [ ] Multi-location input file search

### Phase 2: Batch & Editing
- [ ] `batch.ts` - JSON/CSV batch processing
- [ ] `edit.ts` - Image editing with references
- [ ] Parallel processing with configurable limit
- [ ] Progress reporting

### Phase 3: Reference Library
- [ ] Curated prompt templates (og, icons, avatars, heroes, patterns, diagrams)
- [ ] Style presets documentation
- [ ] Angle presets reference (AI constructs batch from this)
- [ ] Example batch files

### Phase 4: Integration
- [ ] SKILL.md with usage instructions
- [ ] Integration with brand-guide.md
- [ ] Test with service-template workflow

## Dependencies

```json
{
  "dependencies": {
    "ai": "^4.0.0",
    "@ai-sdk/gateway": "^1.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway API key | Yes |

The scripts auto-load `.env`, `.env.local`, `.env.development`, and `.env.development.local` from the current working directory.

## Usage in Wiblo Workflow

When creating a new website, the AI can use this skill to batch generate:

```json
[
  { "prompt": "Hero image for chiropractic practice...", "filename": "hero.png" },
  { "prompt": "OG image with practice name...", "filename": "og-image.png" },
  { "prompt": "Profile avatar for Dr. Smith...", "filename": "team-1.png" },
  { "prompt": "App icon style favicon...", "filename": "favicon-source.png" }
]
```

This complements the existing `metadata-files` skill:
- **AI-generated**: Use `image-gen` for creative, unique images
- **Template-based**: Use `metadata-files` for consistent, brand-aligned OG images

## Sources & References

- [Vercel AI SDK Image Generation](https://ai-sdk.dev/docs/ai-sdk-core/image-generation)
- [Vercel AI Gateway Docs](https://vercel.com/docs/ai-gateway/image-generation/ai-sdk)
- [Google Blog: Nano Banana Pro Prompting](https://blog.google/products/gemini/prompting-tips-nano-banana-pro/)
- [snapai CLI Tool](https://github.com/betomoedano/snapai) - Style presets inspiration
- [Anthropic Skills Repo](https://github.com/anthropics/skills) - Skill structure
