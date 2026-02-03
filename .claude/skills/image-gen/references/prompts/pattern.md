# Seamless Patterns & Textures

Generate tileable patterns for backgrounds, textures, and design elements.

## Recommended Settings

| Parameter | Value |
|-----------|-------|
| Resolution | 2K |
| Aspect Ratio | square (1:1) |
| Key instruction | Always include "seamless tileable" |

## Prompt Structure

```
[Description], [style] style [type] pattern, [density] density,
[colors], seamless tileable, high quality
```

## Parameters

| Parameter | Options |
|-----------|---------|
| Type | geometric, organic, abstract, floral, minimal, tech |
| Density | sparse, medium, dense |
| Style | Any style preset (minimalism, geometric, etc.) |

## Example Patterns

### Geometric
```json
{
  "prompt": "Modern geometric pattern: Interlocking hexagons with thin lines. Navy blue (#1E3A5F) on white background. Medium density. Clean minimalist style. Seamless tileable.",
  "filename": "pattern-hex.png",
  "resolution": "2K",
  "aspectRatio": "square"
}
```

### Organic
```json
{
  "prompt": "Subtle organic leaf pattern: Delicate botanical leaves scattered naturally. Sage green (#86EFAC) on cream (#FFFBEB). Sparse density, watercolor style. Seamless tileable.",
  "filename": "pattern-leaves.png",
  "resolution": "2K",
  "aspectRatio": "square"
}
```

### Abstract
```json
{
  "prompt": "Abstract blob pattern: Soft amorphous shapes overlapping. Pastel pink (#FBCFE8) and lavender (#DDD6FE) on white. Medium density. Modern minimalist. Seamless tileable.",
  "filename": "pattern-blobs.png",
  "resolution": "2K",
  "aspectRatio": "square"
}
```

### Tech/Digital
```json
{
  "prompt": "Circuit board pattern: Subtle tech lines and nodes suggesting connectivity. Dark gray (#374151) lines on light gray (#F3F4F6). Sparse density. Technical style. Seamless tileable.",
  "filename": "pattern-circuit.png",
  "resolution": "2K",
  "aspectRatio": "square"
}
```

### Dots/Minimal
```json
{
  "prompt": "Minimal dot grid pattern: Evenly spaced small dots. Light blue (#93C5FD) dots on white. Sparse density. Clean Swiss design. Seamless tileable.",
  "filename": "pattern-dots.png",
  "resolution": "2K",
  "aspectRatio": "square"
}
```

## Batch: Pattern Collection

```json
[
  {
    "prompt": "Subtle wave pattern: Gentle horizontal wavy lines. Light teal (#99F6E4) on white. Sparse density. Calm, flowing. Seamless tileable.",
    "filename": "pattern-waves.png",
    "resolution": "2K",
    "aspectRatio": "square"
  },
  {
    "prompt": "Terrazzo pattern: Small irregular stone-like shapes scattered. Coral (#FCA5A5), mint (#6EE7B7), cream on white. Medium density. Modern playful. Seamless tileable.",
    "filename": "pattern-terrazzo.png",
    "resolution": "2K",
    "aspectRatio": "square"
  },
  {
    "prompt": "Diagonal stripe pattern: Thin diagonal lines at 45 degrees. Gold (#FCD34D) on navy (#1E3A5F). Medium density. Classic elegant. Seamless tileable.",
    "filename": "pattern-stripes.png",
    "resolution": "2K",
    "aspectRatio": "square"
  },
  {
    "prompt": "Confetti pattern: Small geometric shapes (triangles, circles, squares) scattered randomly. Multicolor pastels on white. Sparse density. Playful celebration. Seamless tileable.",
    "filename": "pattern-confetti.png",
    "resolution": "2K",
    "aspectRatio": "square"
  }
]
```

## Usage Tips

1. **Always specify "seamless tileable"** - Critical for patterns
2. **Test tiling** - Check edges align when repeated
3. **Consider scale** - Patterns look different at various zoom levels
4. **Color harmony** - Stick to 2-3 colors for clean results
5. **Density matters** - Sparse for backgrounds, dense for textures

## Common Use Cases

| Use Case | Recommended Pattern Type |
|----------|-------------------------|
| Website background | Sparse geometric or abstract |
| Card/section accent | Medium density, brand colors |
| Texture overlay | Subtle organic or noise |
| Marketing material | Bold geometric or branded |
| Email headers | Simple, low-density |
