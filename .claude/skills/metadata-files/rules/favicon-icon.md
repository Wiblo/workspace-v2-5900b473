---
title: Favicon, Icon, and Apple-Icon
doc-version: 16.1.4
last-updated: 2025-10-22
---

# favicon, icon, and apple-icon

The `favicon`, `icon`, or `apple-icon` file conventions allow you to set icons for your application.

## Two Ways to Set Icons

1. **Image files** (.ico, .jpg, .png) - Static files in `/app`
2. **Code generation** (.js, .ts, .tsx) - Dynamic generation using ImageResponse

## Image Files

| File convention | Supported file types                    | Valid locations |
| --------------- | --------------------------------------- | --------------- |
| `favicon`       | `.ico`                                  | `app/` only     |
| `icon`          | `.ico`, `.jpg`, `.jpeg`, `.png`, `.svg` | `app/**/*`      |
| `apple-icon`    | `.jpg`, `.jpeg`, `.png`                 | `app/**/*`      |

### Output Examples

```html
<!-- favicon.ico -->
<link rel="icon" href="/favicon.ico" sizes="any" />

<!-- icon.png -->
<link rel="icon" href="/icon?<generated>" type="image/<generated>" sizes="<generated>" />

<!-- apple-icon.png -->
<link rel="apple-touch-icon" href="/apple-icon?<generated>" type="image/<generated>" sizes="<generated>" />
```

## Generate Icons Using Code

Use `ImageResponse` from `next/og`:

### app/icon.tsx (32x32)

```tsx
import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        A
      </div>
    ),
    { ...size }
  )
}
```

### app/apple-icon.tsx (180x180)

```tsx
import { ImageResponse } from 'next/og'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: 32,
        }}
      >
        W
      </div>
    ),
    { ...size }
  )
}
```

## Generating favicon.ico from PNG

favicon.ico cannot be generated dynamically by Next.js, but you can create it from an existing PNG:

### Option 1: ImageMagick (if installed)

```bash
# Install if needed
sudo apt install imagemagick

# Convert PNG to ICO with multiple sizes
convert public/logo.png -define icon:auto-resize=64,48,32,16 app/favicon.ico

# Or simple 32x32
convert public/logo.png -resize 32x32 app/favicon.ico
```

### Option 2: Sharp (Node.js - already in most projects)

```bash
# One-liner using npx
npx sharp-cli public/logo.png -o app/favicon.ico --format ico
```

### Option 3: png-to-ico package

```bash
# Install
bun add -d png-to-ico

# Create script: scripts/generate-favicon.ts
```

```ts
// scripts/generate-favicon.ts
import pngToIco from 'png-to-ico'
import { writeFileSync, readFileSync } from 'fs'

const png = readFileSync('public/logo.png')
pngToIco(png).then((ico) => {
  writeFileSync('app/favicon.ico', ico)
  console.log('favicon.ico generated!')
})
```

```bash
# Run
bun run scripts/generate-favicon.ts
```

### Option 4: Online Tool

Use https://realfavicongenerator.net - upload PNG, download complete favicon package.

## Key Points

- **favicon.ico**: Must be a real .ico file (use conversion methods above)
- **Multiple icons**: Add number suffix (`icon1.png`, `icon2.png`)
- **Statically optimized**: Generated at build time and cached
- **Dynamic routes**: Icons can receive `params` prop (must await in Next.js 16+)

## Recommended Set

```
app/
├── favicon.ico          # 32x32 .ico (legacy browsers)
├── icon.tsx             # 32x32 PNG (modern browsers)
└── apple-icon.tsx       # 180x180 PNG (iOS home screen)
```
