# Content Layout Pattern

The content layout provides a shared wrapper for all MDX content pages.

## Route Group Structure

Use a route group to share layout without affecting URLs:

```
app/
├── (blog)/              # Route group - parentheses excluded from URL
│   ├── layout.tsx       # Shared layout for all content
│   └── components/      # MDX components
└── blog/
    ├── page.tsx         # Listing page
    └── [slug]/
        └── page.mdx     # Content pages
```

URLs become `/blog/post-slug`, not `/(blog)/...`

## Simple Layout

```typescript
// app/(blog)/layout.tsx
import { Container } from "@/components/layout/Container"

export const revalidate = 300  // ISR: revalidate every 5 minutes

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container className="py-10">
      <article className="max-w-2xl mx-auto">
        {children}
      </article>
    </Container>
  )
}
```

## With Prose Styling

Use Tailwind Typography plugin for beautiful defaults:

```bash
bun add -d @tailwindcss/typography
```

```typescript
// tailwind.config.ts
plugins: [require('@tailwindcss/typography')]
```

```typescript
// app/(blog)/layout.tsx
import { Container } from "@/components/layout/Container"

export const revalidate = 300

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container className="py-10">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        {children}
      </article>
    </Container>
  )
}
```

**Note:** If using custom MDX components (recommended), you may not need the typography plugin since components handle their own styling.

## ISR (Incremental Static Regeneration)

The `revalidate = 300` setting enables ISR:

- Pages are statically generated at build time
- After 300 seconds (5 minutes), Next.js regenerates the page in the background
- Users always get fast static responses

```typescript
export const revalidate = 300  // Seconds
```

## Breadcrumb Navigation (Optional)

```typescript
// app/(blog)/layout.tsx
import { Breadcrumb } from "@/components/layout/Breadcrumb"
import { Container } from "@/components/layout/Container"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container className="py-10">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
        ]}
      />
      <article className="mt-6 max-w-2xl">
        {children}
      </article>
    </Container>
  )
}
```

## MDX Page Structure

Each MDX page handles its own metadata and title:

```mdx
// app/blog/[slug]/page.mdx
export const metadata = {
  title: 'Understanding Back Pain',
  description: 'Learn about causes and treatments for back pain.'
}

# Understanding Back Pain

<p className="text-muted-foreground text-sm mb-8">
  January 15, 2026 · Dr. Your Name
</p>

Content starts here...
```

## Linking Layout to Content

The route group `(blog)` applies to all pages under `blog/`:

```
app/
├── (blog)/
│   └── layout.tsx       # Applies to all /blog/* pages
└── blog/
    ├── page.tsx         # /blog - listing (uses layout)
    └── [slug]/
        └── page.mdx     # /blog/slug - content (uses layout)
```

Both the listing page and individual posts share the same layout.
