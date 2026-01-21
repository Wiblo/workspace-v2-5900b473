---
title: manifest.json (Web App Manifest)
doc-version: 16.1.4
last-updated: 2025-06-16
---

# manifest.json

Generate a Web App Manifest file for PWA support by adding a `manifest.ts` or `manifest.json` file in the `app` directory.

## Static manifest.json

```json
// app/manifest.json
{
  "name": "My App",
  "short_name": "App",
  "description": "My application description",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## Generate Manifest Dynamically

### app/manifest.ts

```ts
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'My Application',
    short_name: 'MyApp',
    description: 'A description of my application',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
```

## With Business Info

```ts
import type { MetadataRoute } from 'next'
import { businessInfo } from '@/lib/data/business-info'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: businessInfo.name,
    short_name: businessInfo.name.split(' ')[0], // First word
    description: businessInfo.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1a1a1a', // Match your brand
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
```

## Manifest Type

```ts
type Manifest = {
  name?: string
  short_name?: string
  description?: string
  start_url?: string
  display?: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser'
  background_color?: string
  theme_color?: string
  icons?: Array<{
    src: string
    sizes?: string
    type?: string
    purpose?: 'any' | 'maskable' | 'monochrome'
  }>
  // Additional PWA fields...
}
```

## Key Points

- File outputs to `/manifest.webmanifest`
- Use `display: 'standalone'` for app-like experience
- Include maskable icon for Android adaptive icons
- Theme color affects browser UI on mobile
- Icons should be in `public/` directory
