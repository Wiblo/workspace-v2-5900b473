# Image Generation References

This folder contains prompt templates and guidance for different image generation use cases.

## Prompt Templates

| File | Use Case |
|------|----------|
| `prompts/og-hero.md` | OpenGraph and social sharing images |
| `prompts/app-icon.md` | iOS/Android app icons, favicons |
| `prompts/profile-avatar.md` | Team photos, profile pictures |
| `prompts/hero-section.md` | Website hero backgrounds |
| `prompts/pattern.md` | Seamless tileable patterns |
| `prompts/diagram.md` | Technical diagrams, flowcharts |
| `prompts/angles.md` | Multi-angle product/character shots |

## Style Presets

| File | Contents |
|------|----------|
| `styles/style-presets.md` | 16 style presets (minimalism, glassy, neon, etc.) |

## How to Use

1. **Read the relevant reference** for your use case
2. **Copy/adapt the example prompts** to your needs
3. **Use batch.ts** for multiple images with the JSON examples
4. **Apply style presets** with `--style` flag or in batch JSON

## Quick Examples

### Single image with style
```bash
bun .claude/skills/image-gen/scripts/generate.ts \
  --prompt "App icon for music app, musical note symbol" \
  --style neon \
  --resolution 4K \
  --output icon-music.png
```

### Batch from JSON
```bash
bun .claude/skills/image-gen/scripts/batch.ts \
  --input examples/batch-prompts.json \
  --output-dir ./generated/
```

### Edit existing image
```bash
bun .claude/skills/image-gen/scripts/edit.ts \
  --input photo.jpg \
  --prompt "Convert to watercolor painting style" \
  --output watercolor.png
```
