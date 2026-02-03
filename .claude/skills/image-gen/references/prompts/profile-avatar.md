# Profile Avatars

Generate profile pictures, team headshots, and stylized avatars.

## Types

### Professional Portrait
For team pages, about sections, corporate sites.

```json
{
  "prompt": "Professional portrait avatar: Woman in her 30s, wearing navy blazer, confident approachable smile. Soft studio lighting, neutral gray background. High-end corporate photography style.",
  "filename": "avatar-team-1.png",
  "aspectRatio": "square",
  "resolution": "2K"
}
```

### 3D Figurine
Popular collectible toy style for creative brands.

```json
{
  "prompt": "3D miniature figurine: Professional man holding laptop, styled like collectible toy. Standing confidently on round black display stand. Glossy resin plastic texture, realistic clothing details. Studio lighting.",
  "filename": "avatar-figurine.png",
  "resolution": "4K",
  "aspectRatio": "square"
}
```

### Illustrated Avatar
For casual, creative, or tech brands.

```json
{
  "prompt": "Illustrated avatar: Young professional with glasses, flat vector art style, bold outlines. Limited palette (4-5 colors). Friendly expression, slightly stylized proportions. Solid color background.",
  "filename": "avatar-illustrated.png",
  "style": "flat",
  "resolution": "2K",
  "aspectRatio": "square"
}
```

### Cartoon/Mascot
For playful brands, community profiles.

```json
{
  "prompt": "Cartoon avatar: Friendly character with warm smile, large expressive eyes. Soft rounded shapes, vibrant colors. Approachable and memorable. Clean background.",
  "filename": "avatar-mascot.png",
  "style": "kawaii",
  "resolution": "2K",
  "aspectRatio": "square"
}
```

## Batch: Team Page Avatars

For consistent team photos, use similar prompts with varied details:

```json
[
  {
    "prompt": "Professional portrait: Woman in her 30s, dark hair, wearing light blue blouse. Warm confident smile. Soft studio lighting, light gray background. Corporate headshot style.",
    "filename": "team-sarah.png",
    "resolution": "2K",
    "aspectRatio": "square"
  },
  {
    "prompt": "Professional portrait: Man in his 40s, short gray hair, wearing charcoal suit jacket. Friendly approachable expression. Soft studio lighting, light gray background. Corporate headshot style.",
    "filename": "team-michael.png",
    "resolution": "2K",
    "aspectRatio": "square"
  },
  {
    "prompt": "Professional portrait: Woman in her 20s, curly hair, wearing cream sweater. Bright genuine smile. Soft studio lighting, light gray background. Corporate headshot style.",
    "filename": "team-emma.png",
    "resolution": "2K",
    "aspectRatio": "square"
  }
]
```

## Key Parameters

| Detail | Options |
|--------|---------|
| Gender | man, woman, person (neutral) |
| Age | 20s, 30s, 40s, 50s, 60s |
| Attire | blazer, suit, casual shirt, sweater, professional |
| Expression | confident smile, friendly, approachable, warm, professional |
| Lighting | soft studio, natural, warm, dramatic |
| Background | neutral gray, light gray, white, gradient |

## Important Notes

1. **Never generate specific real people** - avoid celebrity names or public figures
2. **Maintain consistency** - use same lighting/background for team sets
3. **Specify demographics clearly** - be explicit about age, presentation
4. **Avoid stereotypes** - focus on professional presentation
5. **Rights consideration** - AI-generated faces are synthetic, not real people
