---
title: robots.txt
doc-version: 16.1.4
last-updated: 2025-06-16
---

# robots.txt

Add or generate a `robots.txt` file that matches the Robots Exclusion Standard in the **root** of `app` directory to tell search engine crawlers which URLs they can access on your site.

## Static robots.txt

```txt
// app/robots.txt
User-Agent: *
Allow: /
Disallow: /private/

Sitemap: https://acme.com/sitemap.xml
```

## Generate a Robots File

Add a `robots.ts` file that returns a `Robots` object:

### app/robots.ts

```ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://acme.com/sitemap.xml',
  }
}
```

Output:

```txt
User-Agent: *
Allow: /
Disallow: /private/

Sitemap: https://acme.com/sitemap.xml
```

## Customizing Specific User Agents

```ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: '/private/',
      },
      {
        userAgent: ['Applebot', 'Bingbot'],
        disallow: ['/'],
      },
    ],
    sitemap: 'https://acme.com/sitemap.xml',
  }
}
```

## Robots Object Type

```tsx
type Robots = {
  rules:
    | {
        userAgent?: string | string[]
        allow?: string | string[]
        disallow?: string | string[]
        crawlDelay?: number
      }
    | Array<{
        userAgent: string | string[]
        allow?: string | string[]
        disallow?: string | string[]
        crawlDelay?: number
      }>
  sitemap?: string | string[]
  host?: string
}
```

## Key Points

- Place in `app/robots.ts` (not `public/`)
- Cached by default unless using Dynamic APIs
- Reference your sitemap URL
- Use array of rules for different user agents
