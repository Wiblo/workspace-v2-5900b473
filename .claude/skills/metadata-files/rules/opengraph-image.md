---
title: opengraph-image and twitter-image
doc-version: 16.1.4
last-updated: 2025-10-22
---

# opengraph-image and twitter-image

Generate Open Graph and Twitter card images for social media sharing.

## File Conventions

| File convention   | Supported file types        |
| ----------------- | --------------------------- |
| `opengraph-image` | `.jpg`, `.jpeg`, `.png`, `.gif` |
| `twitter-image`   | `.jpg`, `.jpeg`, `.png`, `.gif` |
| `opengraph-image` | `.js`, `.ts`, `.tsx` (generated) |
| `twitter-image`   | `.js`, `.ts`, `.tsx` (generated) |

## Image Sizes

| Type | Recommended Size |
|------|------------------|
| opengraph-image | 1200 x 630 px |
| twitter-image | 1200 x 600 px |

## Static Image Files

Place image files directly in `app/`:

```
app/
├── opengraph-image.png    # 1200x630
├── twitter-image.png      # 1200x600
```

Output:

```html
<meta property="og:image" content="/opengraph-image.png" />
<meta name="twitter:image" content="/twitter-image.png" />
```

## Generate Images Using Code

### app/opengraph-image.tsx

```tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'My Site'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 'bold' }}>
          My Business Name
        </div>
        <div style={{ fontSize: 36, marginTop: 20, opacity: 0.8 }}>
          Your tagline goes here
        </div>
      </div>
    ),
    { ...size }
  )
}
```

### app/twitter-image.tsx

```tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'My Site'
export const size = {
  width: 1200,
  height: 600,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 'bold' }}>
          My Business Name
        </div>
        <div style={{ fontSize: 36, marginTop: 20, opacity: 0.8 }}>
          Your tagline goes here
        </div>
      </div>
    ),
    { ...size }
  )
}
```

## With Business Info

```tsx
import { ImageResponse } from 'next/og'
import { businessInfo } from '@/lib/data/business-info'

export const runtime = 'edge'

export const alt = businessInfo.name
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: 60,
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 'bold', textAlign: 'center' }}>
          {businessInfo.name}
        </div>
        <div style={{ fontSize: 36, marginTop: 20, opacity: 0.8, textAlign: 'center' }}>
          {businessInfo.tagline}
        </div>
      </div>
    ),
    { ...size }
  )
}
```

## Dynamic Route Images

For pages like `/services/[slug]`:

```tsx
// app/services/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Fetch service data based on slug
  const title = slug.replace(/-/g, ' ').toUpperCase()

  return new ImageResponse(
    (
      <div style={{ /* ... */ }}>
        {title}
      </div>
    ),
    { ...size }
  )
}
```

## Config Exports

```tsx
export const alt = 'Image description for accessibility'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
```

## Key Points

- Images are statically generated at build time by default
- Use `runtime = 'edge'` for dynamic generation
- `alt` export provides accessibility text
- Test with Facebook Debugger and Twitter Card Validator
- ImageResponse supports limited CSS (flexbox, basic styles)
