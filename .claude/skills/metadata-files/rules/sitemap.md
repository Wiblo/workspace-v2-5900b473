---
title: sitemap.xml
doc-version: 16.1.4
last-updated: 2025-06-16
---

# sitemap.xml

Generate a sitemap for search engines by adding a `sitemap.ts` or `sitemap.xml` file in the `app` directory.

## Static sitemap.xml

```xml
<!-- app/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://acme.com</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://acme.com/about</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

## Generate Sitemap Dynamically

### app/sitemap.ts

```ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://acme.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://acme.com/services',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://acme.com/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
}
```

## With Dynamic Pages

```ts
import type { MetadataRoute } from 'next'
import { businessInfo } from '@/lib/data/business-info'
import { getAllServices } from '@/lib/data/services'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = businessInfo.url

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Dynamic service pages
  const services = getAllServices()
  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...servicePages]
}
```

## Async Sitemap (Fetching Data)

```ts
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic content
  const posts = await fetch('https://api.example.com/posts').then(res => res.json())

  const postUrls = posts.map((post: { slug: string; updatedAt: string }) => ({
    url: `https://acme.com/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...postUrls,
  ]
}
```

## Sitemap Type

```ts
type Sitemap = Array<{
  url: string
  lastModified?: string | Date
  changeFrequency?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
  priority?: number // 0.0 to 1.0
  alternates?: {
    languages?: Record<string, string>
  }
}>
```

## Multiple Sitemaps (Large Sites)

For sites with many pages, use `generateSitemaps`:

```ts
import type { MetadataRoute } from 'next'

export async function generateSitemaps() {
  // Return array of sitemap IDs
  return [{ id: 0 }, { id: 1 }, { id: 2 }]
}

export default async function sitemap({
  id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  const start = id * 50000
  const end = start + 50000

  // Fetch URLs for this sitemap chunk
  const products = await getProducts(start, end)

  return products.map((product) => ({
    url: `https://acme.com/products/${product.id}`,
    lastModified: product.updatedAt,
  }))
}
```

## Key Points

- Outputs to `/sitemap.xml`
- Use absolute URLs (include domain)
- Priority: 1.0 = most important, 0.0 = least
- changeFrequency is a hint, not a guarantee
- Cached by default unless using Dynamic APIs
- Reference sitemap URL in robots.txt
