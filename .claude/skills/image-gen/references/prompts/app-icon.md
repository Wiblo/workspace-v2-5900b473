# App Icons

Generate iOS/Android app icons, favicons, and UI icons.

## Technical Requirements

| Platform | Size | Notes |
|----------|------|-------|
| iOS/Android | 1024x1024 | Scaled down by platforms |
| Favicon source | 512x512+ | Convert to .ico separately |
| UI icons | 64-256px | Vector-style recommended |

## Recommended Settings

| Parameter | Value |
|-----------|-------|
| Resolution | 4K |
| Aspect Ratio | square (1:1) |
| Style | See presets below |

## Icon Archetypes

### object_icon
Single physical or symbolic object. Best for: finance, productivity, utilities.
```
"App icon: Single shield with checkmark inside, object_icon archetype"
```

### abstract_form_icon
Pure geometric form or metaphor. Best for: AI tools, analytics, tech.
```
"App icon: Interlocking geometric shapes suggesting connection, abstract_form archetype"
```

### hybrid_icon
Object with subtle life/personality cues. Best for: health, lifestyle, social.
```
"App icon: Heart shape with gentle pulse wave, hybrid archetype"
```

### character_icon
Friendly expressive character. Best for: kids apps, games, wellness, entertainment.
```
"App icon: Friendly robot mascot face, character archetype"
```

## Prompt Structure

```
[ARCHETYPE] app icon for [APP PURPOSE]:

Subject: [main visual element]
Style: [style preset]
Colors: [2-3 max]

Technical requirements:
- Full-bleed 1024x1024 square
- Main subject fills 92-98% of canvas
- No text, typography, or brand marks
- Clean background extending to edges
- Platform corners applied later (don't add rounded corners)
```

## Example Batch JSON

```json
[
  {
    "prompt": "Minimalist app icon for finance app: Single shield with subtle checkmark inside. Swiss design, navy blue (#1e3a5f) and white only. Clean edges, no gradients. Full-bleed square, no margins.",
    "filename": "icon-finance.png",
    "resolution": "4K",
    "aspectRatio": "square",
    "style": "minimalism"
  },
  {
    "prompt": "Glassy app icon for weather app: Sun partially behind translucent cloud. iOS glassmorphism with layered depth. Blue (#60A5FA) to orange (#FB923C) gradient. Soft refraction effects.",
    "filename": "icon-weather.png",
    "resolution": "4K",
    "aspectRatio": "square",
    "style": "glassy"
  },
  {
    "prompt": "Neon app icon for gaming app: Stylized game controller silhouette with glowing edges. Dark purple (#1a0a2e) background, cyan (#00f0ff) and magenta (#ff00ff) neon glow.",
    "filename": "icon-game.png",
    "resolution": "4K",
    "aspectRatio": "square",
    "style": "neon"
  },
  {
    "prompt": "Kawaii app icon for meditation app: Cute cloud character with closed eyes and peaceful smile. Soft pastel lavender and mint. Chibi proportions, rounded shapes.",
    "filename": "icon-meditate.png",
    "resolution": "4K",
    "aspectRatio": "square",
    "style": "kawaii"
  }
]
```

## Style Recommendations by App Type

| App Category | Recommended Styles |
|--------------|-------------------|
| Finance/Business | minimalism, flat, material |
| Health/Wellness | clay, gradient, kawaii |
| Productivity | minimalism, geometric, flat |
| Social/Communication | gradient, glassy, material |
| Games/Entertainment | neon, pixel, character icons |
| Creative/Design | gradient, holographic, geometric |
| Kids/Education | kawaii, clay, character icons |

## Things to Avoid

- Text or letters (no monograms)
- Rounded corners (platform adds these)
- Complex scenes or multiple objects
- Realistic photos or portraits
- Brand logos or trademarked shapes
- Margins or padding (full-bleed only)
