# Dynamic OpenGraph Images

Generate dynamic OG images for each content page using Next.js ImageResponse.

## Overview

Dynamic OG images:
- Generated at build time via `generateStaticParams`
- Cached and served statically
- Include post title, date, and optionally view count
- Use your brand colors and fonts

## Route Structure

```
app/
├── (content)/
│   └── og/
│       └── [id]/
│           └── route.tsx   # Generates /og/post-slug
└── opengraph-image/
    └── route.tsx           # Homepage OG image
```

## Per-Post OG Image

```typescript
// app/(content)/og/[id]/route.tsx
import { ImageResponse } from "next/og"
import { getPosts } from "@/app/get-posts"
import { businessInfo } from "@/lib/data/business-info"
import { readFileSync } from "fs"
import { join } from "path"

export const revalidate = 300

// Pre-generate all OG images at build time
export async function generateStaticParams() {
  return (await getPosts()).map(post => ({ id: post.id }))
}

// Optional: Load custom fonts
const fontsDir = join(process.cwd(), "fonts")

// Only load if you have custom fonts
// const geistSans = readFileSync(join(fontsDir, "geist-regular.ttf"))
// const geistSansBold = readFileSync(join(fontsDir, "geist-bold.ttf"))

export async function GET(
  _req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  const { id } = params

  const posts = await getPosts()
  const post = posts.find(p => p.id === id)

  if (!post) {
    return new Response("Not found", { status: 404 })
  }

  return new ImageResponse(
    (
      <div
        tw="flex p-10 h-full w-full bg-white flex-col"
        style={{ fontFamily: "system-ui" }}
      >
        {/* Header */}
        <header tw="flex text-[36px] w-full">
          <div tw="font-semibold">{businessInfo.name}</div>
          <div tw="grow" />
          <div tw="text-[28px] text-gray-500">
            {new URL(businessInfo.url).hostname}
          </div>
        </header>

        {/* Main content */}
        <main tw="flex grow pb-3 flex-col items-center justify-center">
          <div tw="flex">
            <div tw="p-8 text-6xl font-bold text-center max-w-4xl">
              {post.title}
            </div>
          </div>

          <div tw="mt-5 flex text-2xl text-gray-500">
            {post.date}
            {post.views && post.views >= 1000 && ` · ${post.viewsFormatted} views`}
          </div>
        </main>

        {/* Footer accent */}
        <div tw="h-2 w-full bg-blue-600" />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // Optional: Custom fonts
      // fonts: [
      //   { name: "Geist", data: geistSans, weight: 400 },
      //   { name: "Geist Bold", data: geistSansBold, weight: 700 },
      // ],
    }
  )
}
```

## Homepage OG Image

For the site-wide OG image:

```typescript
// app/opengraph-image/route.tsx
import { ImageResponse } from "next/og"
import { businessInfo } from "@/lib/data/business-info"

export const revalidate = 300

export async function GET() {
  return new ImageResponse(
    (
      <div
        tw="flex p-10 h-full w-full bg-white flex-col"
        style={{ fontFamily: "system-ui" }}
      >
        {/* Header */}
        <header tw="flex text-[36px] w-full">
          <div tw="font-semibold">{businessInfo.name}</div>
          <div tw="grow" />
          <div tw="text-[28px] text-gray-500">
            {new URL(businessInfo.url).hostname}
          </div>
        </header>

        {/* Main content */}
        <main tw="flex grow flex-col items-center justify-center">
          <div tw="text-6xl font-bold text-center mb-4">
            {businessInfo.name}
          </div>
          <div tw="text-2xl text-gray-600 text-center max-w-2xl">
            {businessInfo.tagline || "Expert care for your health and wellness"}
          </div>
        </main>

        {/* Footer accent */}
        <div tw="h-2 w-full bg-blue-600" />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
```

## Using OG Images in MDX

Reference the dynamic OG image in page metadata:

```mdx
// app/(content)/2026/back-pain/page.mdx
export const metadata = {
  title: 'Understanding Back Pain',
  description: 'Learn about common causes and treatments for back pain.',
  openGraph: {
    title: 'Understanding Back Pain',
    description: 'Learn about common causes and treatments for back pain.',
    images: [{ url: '/og/back-pain' }]  // Points to the route handler
  }
}
```

## Styling Tips

### Tailwind Classes

ImageResponse supports a subset of Tailwind via `tw` prop:

```tsx
<div tw="flex flex-col items-center justify-center bg-white p-10">
  <h1 tw="text-6xl font-bold text-gray-900">Title</h1>
</div>
```

### Custom Styles

Use `style` prop for non-Tailwind styles:

```tsx
<div
  tw="flex"
  style={{
    fontFamily: "Custom Font",
    background: "linear-gradient(to right, #000, #333)",
  }}
>
```

### Colors

Use explicit colors (not CSS variables):

```tsx
// Good
tw="bg-blue-600 text-white"

// Won't work
tw="bg-primary text-primary-foreground"
```

## Custom Fonts

To use custom fonts:

1. Add font files to a `fonts/` directory
2. Load them in the route:

```typescript
import { readFileSync } from "fs"
import { join } from "path"

const fontsDir = join(process.cwd(), "fonts")

const customFont = readFileSync(join(fontsDir, "custom-font.ttf"))

export async function GET() {
  return new ImageResponse(
    (
      <div style={{ fontFamily: "Custom Font" }}>
        ...
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Custom Font",
          data: customFont,
          weight: 400,
        },
      ],
    }
  )
}
```

## Blog List OG Image

For the blog listing page:

```typescript
// app/blog/opengraph-image/route.tsx
import { ImageResponse } from "next/og"
import { getPosts } from "@/app/get-posts"
import { businessInfo } from "@/lib/data/business-info"

export const revalidate = 300

export async function GET() {
  const posts = await getPosts()
  const recentPosts = posts.slice(0, 5)

  return new ImageResponse(
    (
      <div tw="flex p-10 h-full w-full bg-white flex-col">
        <header tw="flex text-[36px] w-full mb-8">
          <div tw="font-semibold">{businessInfo.name}</div>
          <div tw="grow" />
          <div tw="text-[28px]">Blog</div>
        </header>

        <main tw="flex flex-col w-full">
          {recentPosts.map((post, i) => (
            <div key={post.id} tw="flex py-2 text-[24px] items-center">
              <div tw="grow">{post.title}</div>
              <div tw="text-gray-500 text-[18px]">{post.viewsFormatted}</div>
            </div>
          ))}
        </main>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

## Image Sizes

| Platform | Recommended Size |
|----------|-----------------|
| OpenGraph | 1200 x 630 |
| Twitter | 1200 x 600 |
| Facebook | 1200 x 630 |
| LinkedIn | 1200 x 627 |

Use 1200 x 630 for best compatibility across platforms.

## Debugging

Preview OG images during development:

1. Start dev server: `bun dev`
2. Visit `/og/your-post-slug` directly in browser
3. Use social media debuggers:
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
