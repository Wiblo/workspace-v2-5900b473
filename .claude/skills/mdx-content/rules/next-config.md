# Next.js MDX Configuration

Configure Next.js to support MDX files as pages.

## Installation

```bash
bun add @next/mdx @mdx-js/react
```

## Update next.config.ts

```typescript
// next.config.ts
import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  experimental: {
    mdxRs: true,  // Use Rust MDX compiler for faster builds
  },
  // ... your existing config (images, redirects, etc.)
}

const withMDX = createMDX({
  // Optional: Add remark/rehype plugins
  // options: {
  //   remarkPlugins: [],
  //   rehypePlugins: [],
  // },
})

export default withMDX(nextConfig)
```

## Key Configuration Options

### `pageExtensions`

Tells Next.js to treat `.mdx` files as pages:

```typescript
pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx']
```

### `mdxRs: true`

Uses the new Rust-based MDX compiler which is significantly faster than the JavaScript version:

```typescript
experimental: {
  mdxRs: true,
}
```

**Benefits:**
- Faster build times (especially noticeable with many MDX files)
- Better memory usage
- Same output as JS compiler

## TypeScript Configuration

Add MDX module declaration if needed:

```typescript
// types/mdx.d.ts (optional - may already be handled)
declare module '*.mdx' {
  let MDXComponent: (props: any) => JSX.Element
  export default MDXComponent
  export const metadata: {
    title?: string
    description?: string
    openGraph?: {
      title?: string
      description?: string
      images?: { url: string }[]
    }
  }
}
```

## With Existing Plugins

If you have other plugins (like bundle analyzer), compose them:

```typescript
import type { NextConfig } from 'next'
import createMDX from '@next/mdx'
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  experimental: {
    mdxRs: true,
  },
  // ... rest of config
}

const withMDX = createMDX({})

// Compose plugins (order matters - MDX should usually be last)
export default withBundleAnalyzer(withMDX(nextConfig))
```

## Optional: MDX Plugins

For advanced features, you can add remark/rehype plugins:

```bash
# Optional plugins
bun add remark-gfm          # GitHub Flavored Markdown (tables, strikethrough)
bun add rehype-slug         # Auto-generate heading IDs
bun add rehype-autolink-headings  # Auto-link headings
```

```typescript
import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  },
})
```

**Note:** The custom `withHeadingId` utility in the MDX components handles heading anchors, so `rehype-slug` and `rehype-autolink-headings` are optional.

## Verify Configuration

After updating config:

```bash
bun run build
```

If you see MDX files being processed without errors, the configuration is correct.
