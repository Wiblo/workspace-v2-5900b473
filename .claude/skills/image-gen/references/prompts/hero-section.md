# Website Hero Images

Background images for hero sections, headers, and feature areas.

## Recommended Settings

| Use Case | Aspect Ratio | Resolution |
|----------|--------------|------------|
| Full-width hero | wide (21:9) | 4K |
| Standard hero | landscape (16:9) | 2K-4K |
| Split hero | 4:3 | 2K |
| Mobile hero | portrait (9:16) | 2K |

## Types

### Abstract Background
Non-representational, great for text overlay.

```json
{
  "prompt": "Abstract hero background: Flowing gradient mesh of deep blue (#1E3A8A) and purple (#7C3AED). Subtle organic shapes creating depth. Clean and professional, suitable for white text overlay. No specific objects.",
  "filename": "hero-abstract.png",
  "aspectRatio": "wide",
  "resolution": "4K"
}
```

### Lifestyle/Contextual
Scene that represents your service/product context.

```json
{
  "prompt": "Lifestyle hero for wellness clinic: Bright modern treatment room, warm natural lighting through large windows. Plants, clean white surfaces, calming atmosphere. Space on right side for text overlay. Professional photography style.",
  "filename": "hero-wellness.png",
  "aspectRatio": "landscape",
  "resolution": "4K"
}
```

### Product Showcase
Feature your product/service prominently.

```json
{
  "prompt": "Product showcase hero: Modern laptop displaying dashboard interface, placed on clean white desk. Soft shadows, professional lighting. Minimal background with subtle gradient. Premium presentation style.",
  "filename": "hero-product.png",
  "aspectRatio": "landscape",
  "resolution": "4K"
}
```

### Geometric/Pattern
Structured, modern, tech-forward.

```json
{
  "prompt": "Geometric hero background: Interlocking hexagonal mesh pattern in navy (#1E3A5F) and gold (#D4AF37). Subtle 3D depth effect. Modern tech aesthetic. Clean negative space for content overlay.",
  "filename": "hero-geometric.png",
  "aspectRatio": "wide",
  "resolution": "4K",
  "style": "geometric"
}
```

## Batch: Website Hero Set

Generate a complete set of hero images for different sections:

```json
[
  {
    "prompt": "Homepage hero: Abstract gradient flowing from teal (#14B8A6) to blue (#3B82F6). Soft organic shapes suggesting innovation. Professional, clean. Large negative space on left for headline.",
    "filename": "hero-home.png",
    "aspectRatio": "wide",
    "resolution": "4K"
  },
  {
    "prompt": "About page hero: Warm abstract background with soft gold (#FCD34D) and cream tones. Gentle flowing shapes. Welcoming, trustworthy feel. Space for text overlay.",
    "filename": "hero-about.png",
    "aspectRatio": "landscape",
    "resolution": "4K"
  },
  {
    "prompt": "Services hero: Professional blue (#2563EB) gradient background with subtle geometric accents. Clean, confident, corporate. Centered negative space for content.",
    "filename": "hero-services.png",
    "aspectRatio": "landscape",
    "resolution": "4K"
  },
  {
    "prompt": "Contact hero: Calming gradient from soft purple (#A78BFA) to blue (#60A5FA). Minimal, inviting atmosphere. Space for contact form overlay.",
    "filename": "hero-contact.png",
    "aspectRatio": "landscape",
    "resolution": "2K"
  }
]
```

## Tips for Text Overlay Compatibility

1. **Create negative space** - Specify "space on left/right for text"
2. **Avoid busy patterns** - Keep areas for text clean and low-contrast
3. **Consider contrast** - Light backgrounds need dark text areas, vice versa
4. **Safe margins** - Keep important elements 10-15% from edges
5. **Test overlays** - Verify your text is readable on the generated image

## Industry-Specific Examples

### Healthcare/Wellness
```
"Calming hero: Soft sage green and cream gradient, gentle organic flowing shapes.
Natural, healing atmosphere. Professional but warm."
```

### Technology/SaaS
```
"Tech hero: Deep navy to purple gradient, subtle circuit-like geometric patterns.
Modern, innovative, trustworthy. Clean space for product messaging."
```

### Finance/Professional Services
```
"Corporate hero: Sophisticated dark blue gradient, subtle gold accents.
Premium, trustworthy, established. Minimal, confident design."
```

### Creative/Design
```
"Creative hero: Vibrant gradient mesh with bold colors (coral, teal, purple).
Energetic, inspiring, artistic. Dynamic flowing shapes."
```
