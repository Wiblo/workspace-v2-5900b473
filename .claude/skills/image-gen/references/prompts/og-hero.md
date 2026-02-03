# OpenGraph Hero Images (AI-Generated)

For creative, unique OG images. Use the `metadata-files` skill for standard template-based OG.

## When to Use AI-Generated OG

- Landing pages needing unique, eye-catching visuals
- Product launches with custom creative
- Feature announcements
- Brand differentiation

## Recommended Settings

| Parameter | Value |
|-----------|-------|
| Resolution | 2K or 4K |
| Aspect Ratio | 16:9 (landscape) |
| Output Size | 1200x630 px (standard OG) |

## Prompt Structure

```
Create a premium open-graph hero image for [BRAND]:

A wide horizontal layout (16:9 ratio) designed for social sharing.

LAYOUT:
- LEFT ZONE: Logo/brand name top-left, single headline (3-6 words) below
- RIGHT ZONE: Floating interface panel suggesting [product type]
- Strong negative space between zones

COLOR: [Brand colors]
STYLE: Clean SaaS hero, flat or near-flat, subtle shadows
MOOD: Premium, polished, confident

AVOID: Stock photos, people, complex illustrations, decorative patterns,
       text other than headline, borders/frames
```

## Example Batch JSON

```json
[
  {
    "prompt": "Premium OG image for Acme Analytics: Left zone has Acme logo top-left, headline 'Ship Faster with AI' below. Right zone shows floating dashboard panel with charts. Clean white background, blue (#3B82F6) accents. Flat design, subtle shadows.",
    "filename": "og-landing.png",
    "aspectRatio": "16:9",
    "resolution": "2K"
  },
  {
    "prompt": "OG image for feature announcement: Left shows 'Real-time Sync' headline bold. Right shows floating notification panel. Gradient purple (#8B5CF6) to blue (#3B82F6) background. Modern minimal style.",
    "filename": "og-feature.png",
    "aspectRatio": "16:9",
    "resolution": "2K"
  },
  {
    "prompt": "Blog post OG image: Abstract gradient background flowing from teal to purple. Clean negative space on left for text overlay. Subtle geometric shapes. Modern, professional.",
    "filename": "og-blog.png",
    "aspectRatio": "16:9",
    "resolution": "2K"
  }
]
```

## Tips

1. **Keep text minimal** - OG images are small on social feeds
2. **High contrast** - Ensure readability at thumbnail size
3. **Brand colors** - Pull from `docs/brand-guide.md` if available
4. **Safe zones** - Keep important elements away from edges (10% margin)
5. **Test at small sizes** - Preview how it looks as a thumbnail
