---
name: mdx-content
description: Set up MDX-based content systems for blogs, conditions pages, treatments, or any rich content pages. Based on optimized patterns from the Vercel best practices.
metadata:
  author: local
  version: "1.0.0"
  argument-hint: <type> (blog|conditions|treatments|custom)
---

# MDX Content Skill

Set up a production-optimized MDX content system for rich content pages like blogs, conditions/treatments pages, or any SEO-focused content pages.

**MDX components are already included** in this template at `/components/mdx/`. This skill sets up the routing, manifest, and content structure.

## When to Use MDX vs Structured Data

| Content Type | Approach | Why |
|--------------|----------|-----|
| Services | Keep TypeScript data | Uniform structure, Schema.org-friendly (unless user wants varied layouts) |
| **Blog Posts** | **Use MDX** | Rich formatting, custom components, varied layouts |
| **Conditions Pages** | **Use MDX** | SEO-focused, needs headings, inline CTAs |
| **Treatment Pages** | **Use MDX** | Educational content with rich formatting |
| Custom Content | Use MDX | Any content needing rich text + components |

## Usage

```
/mdx-content blog        # Set up blog with MDX posts
/mdx-content conditions  # Set up conditions/health pages (e.g., "Back Pain")
/mdx-content treatments  # Set up treatment method pages
/mdx-content custom      # Set up custom content type (will prompt for name)
```

## What's Already Included

### MDX Components (`/components/mdx/`)

All components use the project's design system tokens.

**Typography:**
- `a.tsx` - Smart links (internal/external/anchor detection)
- `h1.tsx`, `h2.tsx`, `h3.tsx` - Headings with anchor ID support (`## Title [#anchor]`)
- `p.tsx`, `ol.tsx`, `ul.tsx`, `li.tsx` - Text and lists
- `code.tsx` - Inline code
- `hr.tsx` - Horizontal rule
- `blockquote.tsx` - Blockquotes

**Blocks:**
- `callout.tsx` - Highlighted callout boxes
- `figure.tsx` - Figure container with optional full-width
- `caption.tsx` - Balanced text captions
- `snippet.tsx` - Code blocks with optional caption

**Media:**
- `image.tsx` - Auto-sizing images with caption from alt text
- `youtube.tsx` - YouTube embeds
- `tweet.tsx` - Twitter/X embeds with Suspense

**Tables & Footnotes:**
- `table.tsx` - Responsive tables (Table, THead, TBody, TR, TH, TD)
- `footnotes.tsx` - Footnote system (FootNotes, Ref, FootNote)

### Component Registry (`/mdx-components.ts`)

Already configured to map all components to MDX.

## Default Architecture

Simple flat structure: `/[type]/[slug]`

```
app/
├── blog/                         # Or conditions/, treatments/
│   ├── page.tsx                  # Listing page
│   └── [slug]/
│       └── page.mdx              # Individual content pages
├── blog.json                     # Content manifest
└── get-blog.ts                   # Data fetching helper
```

## Instructions

When this skill is invoked, follow these steps:

### Step 1: Determine Content Type

Infer from the argument or context:
- `blog` → Blog posts at `/blog/[slug]`
- `conditions` → Health conditions at `/conditions/[slug]`
- `treatments` → Treatment methods at `/treatments/[slug]`
- `custom` → Ask user for the type name only

**Default to simple flat structure** (`/[type]/[slug]`).

### Step 2: Configure Next.js for MDX

Update `next.config.ts` to enable MDX:

```typescript
import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  experimental: {
    mdxRs: true,  // Rust MDX compiler for performance
  },
  // ... existing config
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
```

### Step 3: Create Content Manifest

```json
// app/blog.json (or conditions.json, treatments.json)
{
  "posts": [
    {
      "id": "back-pain-causes",
      "date": "Jan 15, 2026",
      "title": "Understanding Back Pain: Causes and Solutions"
    }
  ]
}
```

### Step 4: Create Data Fetching Helper

```typescript
// app/get-blog.ts
import contentData from "./blog.json"

export type Post = {
  id: string
  date: string
  title: string
}

export const getPosts = async (): Promise<Post[]> => {
  return contentData.posts
}

export const getPostById = async (id: string): Promise<Post | undefined> => {
  return contentData.posts.find(post => post.id === id)
}
```

### Step 5: Create Listing Page

```typescript
// app/blog/page.tsx
import { getPosts } from '../get-blog'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'

export const metadata = {
  title: 'Blog | Your Practice Name',
  description: 'Articles about health, wellness, and chiropractic care.'
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post.id}>
            <Link
              href={`/blog/${post.id}`}
              className="block p-4 rounded-lg hover:bg-muted transition-colors"
            >
              <h2 className="font-semibold">{post.title}</h2>
              <p className="text-sm text-muted-foreground">{post.date}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  )
}
```

### Step 6: Create Example Content Page

```mdx
// app/blog/[slug]/page.mdx (e.g., app/blog/back-pain-causes/page.mdx)

export const metadata = {
  title: 'Understanding Back Pain',
  description: 'Learn about the common causes of back pain and effective treatments.',
}

# Understanding Back Pain

Back pain affects millions of people worldwide. In this guide, we'll explore
the most common causes and evidence-based treatments.

## Common Causes [#causes]

The most frequent causes of back pain include:

- **Muscle strain** - From lifting heavy objects or sudden movements
- **Poor posture** - Especially from prolonged sitting
- **Disc problems** - Herniation or degeneration

<Callout emoji="💡">
  Most back pain improves within a few weeks with proper care and treatment.
</Callout>

## Treatment Options [#treatment]

Our clinic offers several effective treatments for back pain...
```

### Step 7: Update Navigation

Add the new content section to navigation:

```typescript
// lib/data/navigation.ts
export const navigation = [
  // ... existing items
  { name: 'Blog', href: '/blog' },
]
```

### Step 8: Add to Sitemap

Update `app/sitemap.ts`:

```typescript
import { getPosts } from './get-blog'

export default async function sitemap() {
  const posts = await getPosts()

  const postUrls = posts.map(post => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    // ... existing pages
    ...postUrls,
  ]
}
```

### Step 9: Validate

```bash
bun check      # Must pass
bun run build  # Must succeed
```

### Step 10: Report Summary

```
## MDX Content Setup Complete

**Content Type:** [type]
**URL Structure:** /[type]/[slug]

### Files Created
- next.config.ts - Updated with MDX config
- app/[type].json - Content manifest
- app/get-[type].ts - Data fetching
- app/[type]/page.tsx - Listing page
- app/[type]/[slug]/page.mdx - Example content page
- Navigation updated

### Available Components
All MDX components from /components/mdx/ are ready to use:
- <Callout emoji="💡">Info text</Callout>
- <Tweet id="123456" />
- <YouTube id="abc123" />
- <Figure wide>...</Figure>
- <FootNotes>, <Ref id="1" />, <FootNote id="1">...</FootNote>

### Next Steps
1. Add more content pages at app/[type]/[slug]/page.mdx
2. Update [type].json manifest for each new post
```

## Key Patterns

### 1. Metadata via JS Export (Not YAML)

```mdx
export const metadata = {
  title: 'Post Title',
  description: 'Description',
  openGraph: {
    title: 'Post Title',
    images: [{ url: '/og/slug' }]
  }
}
```

### 2. Heading Anchor Pattern

Use `[#anchor-id]` syntax in headings:

```mdx
## Section Title [#section-title]
```

Creates a linkable anchor at `#section-title`.

### 3. Image Size Parsing

Support percentage sizing via alt text:

```mdx
![Image caption [50%]](/image.png)
```

### 4. Available Custom Components

```mdx
<Callout emoji="💡">Important information</Callout>

<Tweet id="1234567890" caption="Optional caption" />

<YouTube id="dQw4w9WgXcQ" caption="Video explanation" />

<Figure wide>
  <Image src="/wide-image.jpg" alt="Full width" />
</Figure>

Text with citation<Ref id="1" />.

<FootNotes>
  <FootNote id="1">Citation details here.</FootNote>
</FootNotes>
```

### 5. Smart Link Component

Links are automatically handled:
- `#anchor` - Same-page anchor
- `/path` - Internal link via Next.js Link
- `https://...` - External link with `target="_blank"`

## BlogPostLayout (Recommended for Blogs)

For blog content, it's often nice to create a `BlogPostLayout` component that wraps all posts. This provides a polished, consistent experience with elements like breadcrumbs, author info, reading time, and related content.

**Auto-calculate reading time** instead of hardcoding:

```tsx
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}
```

## Table of Contents (For Informational Articles)

For medical/educational content, add a **TableOfContents** component that extracts h2 headings:

**Horizontal variant** (sticky bar at top):
```
Contents ↓ | Overview | Possible Causes | Care and Treatment | When To Call
```

**Sidebar variant** (for longer guides):
- Vertical list in the sidebar
- Highlights current section on scroll

Auto-generate from headings with `[#anchor]` syntax.

## Brand Integration

Before creating blog components:
1. Read `docs/brand-guide.md` for colors and typography
2. Use design tokens: `primary`, `muted`, `background`, etc.
3. Match button and link styles from existing sections
4. Adapt the layout to feel consistent with the rest of the site

## Custom MDX Components

Create business-specific MDX components where they add value:

```mdx
<BookingCTA />           {/* Inline appointment button */}
<ServiceCard slug="sports-injury" />  {/* Link to a service */}
<InsuranceNote />        {/* Standard insurance disclaimer */}
```

## Industry-Specific Content Ideas

### Chiropractor / Physiotherapist
- **Conditions**: Back Pain, Sciatica, Neck Pain, Headaches, Sports Injuries
- **Treatments**: Spinal Adjustment, Dry Needling, Sports Therapy
- **Blog**: Wellness tips, posture guides, exercise routines

### Dentist
- **Conditions**: Cavities, Gum Disease, TMJ, Tooth Sensitivity
- **Treatments**: Cleanings, Fillings, Root Canals, Whitening
- **Blog**: Oral health tips, procedure guides

### General
- Use conditions/treatments pages to rank for symptom searches
- Use blog for educational content and local SEO
- Each page should have Schema.org markup (MedicalCondition, MedicalProcedure)
- Informational articles benefit from table of contents navigation
