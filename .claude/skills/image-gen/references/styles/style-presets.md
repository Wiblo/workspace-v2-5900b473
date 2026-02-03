# Style Presets

Add `--style <preset>` to any generation command or include `"style": "<preset>"` in batch JSON.

## Available Styles

### minimalism
Swiss/Apple design aesthetic. Max 3 colors, clean edges, no gradients, monochrome-safe.
```
--style minimalism
```

### glassy
Glassmorphism (iOS 15+/VisionOS). Translucent layers, frosted effects, depth, light refraction.
```
--style glassy
```

### geometric
Bauhaus-inspired. Strict grid, mathematical shapes, primary colors, bold contrast.
```
--style geometric
```

### neon
Cyberpunk aesthetic. High saturation, dark backgrounds, glowing edges, electric colors.
```
--style neon
```

### gradient
Modern social-app style. Smooth color transitions, vibrant, flowing gradients.
```
--style gradient
```

### flat
Pure flat corporate (Microsoft-style). Zero depth, solid colors, clean shapes.
```
--style flat
```

### material
Material Design 3. Subtle elevation, rounded shapes, dynamic color, soft shadows.
```
--style material
```

### pixel
8-bit pixel art. Retro gaming aesthetic, hard edges, limited color palette.
```
--style pixel
```

### clay
Claymorphism. Soft rounded forms, pastel palette, subtle 3D depth, playful.
```
--style clay
```

### kawaii
Japanese cute style. Chibi proportions, big eyes, pastel colors, rounded shapes.
```
--style kawaii
```

### ios-classic
Pre-iOS7 skeuomorphism. Realistic materials, shadows, glossy surfaces, tactile.
```
--style ios-classic
```

### holographic
Iridescent effects. Color-shifting, light-reactive, prismatic, futuristic.
```
--style holographic
```

### watercolor
Traditional watercolor painting. Soft edges, color bleeding, paper texture.
```
--style watercolor
```

### oil-painting
Classic oil painting. Visible brushstrokes, rich colors, textured surface.
```
--style oil-painting
```

### line-art
Clean line illustration. Black outlines, minimal fills, technical drawing feel.
```
--style line-art
```

### isometric
3D isometric projection. Technical, precise angles, game asset style.
```
--style isometric
```

## Usage in Prompts

You can also describe styles directly in your prompt instead of using presets:

```
"App icon for music app with glassmorphism style, translucent layers, iOS aesthetic"
"Hero image with cyberpunk neon aesthetic, dark background, glowing accents"
"Product photo with clean minimalist style, white background, soft shadows"
```

## Combining Styles

For more specific results, combine style with other descriptors:

```json
{
  "prompt": "Finance app icon, shield with checkmark",
  "style": "minimalism",
  "filename": "icon-finance.png"
}
```

The style is appended to your prompt as: `"Finance app icon, shield with checkmark, minimalism style"`
