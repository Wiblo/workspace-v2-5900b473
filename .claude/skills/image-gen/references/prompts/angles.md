# Angle Variants

Generate multiple views of the same subject from different angles.
Best workflow for consistency:
1) Generate a single front/hero image first.
2) Use that image as a reference for all other angles in batch.ts.
3) Keep the same background/lighting instructions across prompts.

## Available Angle Presets

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
| full-body | "full body view, standing" |

### Environment
| Angle | Prompt Addition |
|-------|-----------------|
| wide | "wide establishing shot" |
| aerial | "aerial view, birds eye perspective" |
| street | "street level perspective" |
| interior | "interior view, room perspective" |

## Example: Product Angle Variants

When user asks "generate product shots from multiple angles", construct:

```json
[
  {
    "prompt": "Modern ceramic coffee mug, product photography, white background, front view straight on, studio lighting",
    "filename": "mug-front.png",
    "resolution": "4K",
    "aspectRatio": "square"
  },
  {
    "prompt": "Modern ceramic coffee mug, product photography, white background, side profile view 90 degrees, studio lighting",
    "filename": "mug-side.png",
    "resolution": "4K",
    "aspectRatio": "square",
    "referenceImages": ["mug-front.png"]
  },
  {
    "prompt": "Modern ceramic coffee mug, product photography, white background, three-quarter view 45 degree angle, studio lighting",
    "filename": "mug-3-4.png",
    "resolution": "4K",
    "aspectRatio": "square",
    "referenceImages": ["mug-front.png"]
  },
  {
    "prompt": "Modern ceramic coffee mug, product photography, white background, top-down view from directly above, studio lighting",
    "filename": "mug-above.png",
    "resolution": "4K",
    "aspectRatio": "square",
    "referenceImages": ["mug-front.png"]
  },
  {
    "prompt": "Modern ceramic coffee mug, product photography, white background, close-up detail shot of handle, studio lighting",
    "filename": "mug-detail.png",
    "resolution": "4K",
    "aspectRatio": "square",
    "referenceImages": ["mug-front.png"]
  }
]
```

## Example: App Icon Angle Variants

```json
[
  {
    "prompt": "3D shield icon with checkmark, glossy material, front view straight on, studio lighting, dark background",
    "filename": "icon-front.png",
    "resolution": "4K",
    "aspectRatio": "square"
  },
  {
    "prompt": "3D shield icon with checkmark, glossy material, three-quarter view 45 degrees, studio lighting, dark background",
    "filename": "icon-3-4.png",
    "resolution": "4K",
    "aspectRatio": "square",
    "referenceImages": ["icon-front.png"]
  },
  {
    "prompt": "3D shield icon with checkmark, glossy material, hero shot dramatic angle slight tilt, studio lighting, dark background",
    "filename": "icon-hero.png",
    "resolution": "4K",
    "aspectRatio": "square",
    "referenceImages": ["icon-front.png"]
  }
]
```

## Example: Character Angle Variants

```json
[
  {
    "prompt": "Friendly robot mascot character, cartoon style, front view facing camera, clean background",
    "filename": "mascot-front.png",
    "resolution": "2K",
    "aspectRatio": "square"
  },
  {
    "prompt": "Friendly robot mascot character, cartoon style, side profile facing left, clean background",
    "filename": "mascot-profile.png",
    "resolution": "2K",
    "aspectRatio": "square",
    "referenceImages": ["mascot-front.png"]
  },
  {
    "prompt": "Friendly robot mascot character, cartoon style, three-quarter view, waving pose, clean background",
    "filename": "mascot-3-4.png",
    "resolution": "2K",
    "aspectRatio": "square",
    "referenceImages": ["mascot-front.png"]
  },
  {
    "prompt": "Friendly robot mascot character, cartoon style, full body standing pose, clean background",
    "filename": "mascot-full.png",
    "resolution": "2K",
    "aspectRatio": "3:4",
    "referenceImages": ["mascot-front.png"]
  }
]
```

## Using with Reference Images

For consistent angles, generate a front view first, then reference it for the rest:

```bash
bun .claude/skills/image-gen/scripts/generate.ts \
  --prompt "Modern ceramic coffee mug, product photography, white background, front view straight on, studio lighting" \
  --output public/images/mug-front.png
```

Then use that front image as the reference in batch JSON/CSV or one-off edits.

## Tips

1. **Maintain consistency** - Use same lighting, background, style across angles
2. **Specify lighting** - "studio lighting" helps maintain consistency
3. **Match backgrounds** - Same background color/style for all variants
4. **Consider use case** - E-commerce needs clean white backgrounds
5. **Name files clearly** - Include angle in filename for organization
