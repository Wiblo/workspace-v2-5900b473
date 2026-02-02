# Architecture - Service Business Website Template

## Overview

A minimal, AI-friendly Next.js template for local service businesses. Designed to be customized by Claude Code - ships with placeholder content and reusable sections that AI can edit to match any business.

**Philosophy**: Scaffold the patterns, not the content. AI fills in the rest.

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16 | App Router, RSC, Turbopack |
| React | 19 | UI Framework |
| TypeScript | 5 | Type Safety |
| Tailwind CSS | 4 | Styling (OKLCH colors) |
| shadcn/ui | Latest | UI Component Library (New York style) |
| Bun | Latest | Package Manager & Runtime |

## Project Goals

1. **Fast setup** - `bun install` and `bun dev` in seconds
2. **AI-editable** - Clear patterns that Claude Code can modify
3. **Placeholder content** - No business-specific copy to replace
4. **Production-ready** - Perfect Lighthouse scores out of the box
5. **Teachable patterns** - Shows data → component → page flow

---

## File Structure

```
service-template/
├── app/
│   ├── layout.tsx                 # Root layout (Navbar + Footer)
│   ├── page.tsx                   # Homepage (minimal sections)
│   ├── not-found.tsx              # 404 page
│   ├── services/
│   │   ├── page.tsx               # Services index (grid of cards)
│   │   └── [slug]/
│   │       └── page.tsx           # Individual service detail
│   ├── sitemap.ts                 # Dynamic sitemap
│   └── robots.ts                  # Robots.txt
│
├── components/
│   ├── ui/                        # shadcn/ui primitives 
│   │
│   ├── layout/                    # Layout utilities
│   │   ├── Container.tsx          # Max-width wrapper (horizontal padding)
│   │   ├── SectionWrapper.tsx     # Vertical spacing between sections
│   │   ├── Navbar.tsx             # Site navigation
│   │   └── Footer.tsx             # Site footer
│   │
│   └── sections/                  # Page building blocks
│       ├── hero/
│       │   ├── HeroSimple.tsx     # Text-only hero
│       │   └── HeroWithImage.tsx  # Hero with side image
│       ├── services/
│       │   ├── ServiceCard.tsx    # Reusable service card
│       │   ├── FeaturedServices.tsx  # Homepage: 3 featured services
│       │   └── ServicesGrid.tsx   # /services page: all services
│       ├── features/
│       │   └── FeaturesSection.tsx
│       ├── about/
│       │   └── AboutSection.tsx
│       ├── cta/
│       │   └── CTASection.tsx
│       ├── faq/
│       │   └── FAQSection.tsx
│       ├── testimonials/
│       │   └── TestimonialsSection.tsx
│       ├── location/
│       │   └── LocationSection.tsx
│       └── gallery/
│           └── GallerySection.tsx
│
├── lib/
│   ├── utils.ts                   # cn() utility for Tailwind
│   ├── data/
│   │   ├── business-info.ts       # Central business data
│   │   ├── services.ts            # Services with getServiceBySlug()
│   │   ├── navigation.ts          # Nav links
│   │ 
│   │   ├── testimonials.ts        # Customer reviews
│   │   └── faqs.ts                # FAQ items
│   └── seo/
│       └── metadata.ts            # generatePageMetadata() helper
│
├── hooks/
│   └── use-mobile.ts              # Mobile breakpoint hook
│
├── public/
│   └── images/
│       ├── hero/
│       ├── services/
│       └── team/
│
├── .claude/
│   ├── settings.json              # Enabled plugins & MCP servers
│   └── skills/
│       ├── frontend-design/       # UI design guidance
│       ├── add-page/              # Scaffold new pages
│       └── add-section/           # Create section components
│
├── CLAUDE.md                      # AI development guidelines
└── architecture.md                # This file
```

---

## Component Architecture

### Three-Tier System

```
UI Components (shadcn) → Sections → Pages
```

| Tier | Location | Responsibility |
|------|----------|----------------|
| **UI** | `components/ui/` | Primitives (Button, Card, etc.) - don't modify |
| **Sections** | `components/sections/` | Full-width page blocks with placeholder content |
| **Pages** | `app/**/page.tsx` | Compose sections together |

### Layout Components

**Container** - Constrains content width with horizontal padding:
```tsx
// components/layout/Container.tsx
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("container mx-auto px-4 md:px-6 max-w-7xl", className)}>
      {children}
    </div>
  )
}
```

**SectionWrapper** - Consistent vertical spacing between sections:
```tsx
// components/layout/SectionWrapper.tsx
export function SectionWrapper({ children, className }: SectionWrapperProps) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      {children}
    </section>
  )
}
```

### Section Pattern

All sections follow this structure:
```tsx
import { Container } from "@/components/layout/Container"
import { SectionWrapper } from "@/components/layout/SectionWrapper"

interface SectionNameProps {
  // Props for customization (optional)
}

export function SectionName({ ...props }: SectionNameProps) {
  return (
    <SectionWrapper>
      <Container>
        {/* Section content */}
      </Container>
    </SectionWrapper>
  )
}
```

### Page Composition

Pages are sections stacked vertically:
```tsx
// app/page.tsx
export default function HomePage() {
  return (
    <>
      <HeroWithImage />
      <FeaturedServices />
      <AboutSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
```

---

## Data Management

### Philosophy

- **Single source of truth** - Data lives in `lib/data/`
- **Components pull from data** - Sections import what they need
- **Not required** - Components can accept props directly too
- **Placeholder content** - All data files ship with example content

### Business Info

```typescript
// lib/data/business-info.ts
export const businessInfo = {
  // Core
  name: "Your Business Name",
  tagline: "Your compelling tagline goes here",
  description: "A brief description of what your business does and who you serve.",

  // Contact
  phone: "(555) 000-0000",
  email: "hello@example.com",

  // Location
  address: {
    street: "123 Main Street",
    city: "Your City",
    state: "ST",
    zip: "00000",
    country: "US",
  },

  // Optional: coordinates for maps
  geo: {
    latitude: 0,
    longitude: 0,
  },

  // Hours
  hours: {
    monday: "9:00 AM - 5:00 PM",
    tuesday: "9:00 AM - 5:00 PM",
    wednesday: "9:00 AM - 5:00 PM",
    thursday: "9:00 AM - 5:00 PM",
    friday: "9:00 AM - 5:00 PM",
    saturday: "Closed",
    sunday: "Closed",
  },

  // Social (optional)
  social: {
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
  },

  // Site
  url: "https://example.com",
  logo: "/logo.png",
}
```

### Services

```typescript
// lib/data/services.ts
export interface Service {
  slug: string
  name: string
  shortDescription: string   // For cards (1-2 sentences)
  description: string        // For detail page (full description)
  icon?: string              // Lucide icon name (e.g., "Heart", "Zap")
  image?: string             // Image path
  featured?: boolean         // Show on homepage
}

export const services: Service[] = [
  {
    slug: "service-one",
    name: "Service One",
    shortDescription: "Brief description of this service for card display.",
    description: "Full description of the service. Explain what it includes, who it's for, and what benefits customers can expect.",
    icon: "Star",
    featured: true,
  },
  {
    slug: "service-two",
    name: "Service Two",
    shortDescription: "Brief description of this service for card display.",
    description: "Full description of the service...",
    icon: "Heart",
    featured: true,
  },
  {
    slug: "service-three",
    name: "Service Three",
    shortDescription: "Brief description of this service for card display.",
    description: "Full description of the service...",
    icon: "Zap",
    featured: true,
  },
]

// Helpers
export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}

export function getFeaturedServices(): Service[] {
  return services.filter((s) => s.featured)
}

export function getAllServices(): Service[] {
  return services
}
```

### Other Data Files

| File | Purpose | Used By |
|------|---------|---------|
| `navigation.ts` | Nav links array | Navbar, Footer |
| `features.ts` | Benefits/features list | FeaturesSection |
| `testimonials.ts` | Customer reviews | TestimonialsSection |
| `faqs.ts` | FAQ Q&A pairs | FAQSection |

---

## Services Pattern (Core Example)

The services implementation demonstrates the full data → component → page flow:

### Data Flow
```
lib/data/services.ts
        ↓
components/sections/services/ServiceCard.tsx
        ↓
┌───────────────────┬─────────────────────────┐
│ FeaturedServices  │  ServicesGrid           │
│ (homepage)        │  (/services page)       │
└───────────────────┴─────────────────────────┘
        ↓                     ↓
   app/page.tsx      app/services/page.tsx
                              ↓
                     app/services/[slug]/page.tsx
```

### ServiceCard Component
```tsx
// components/sections/services/ServiceCard.tsx
import Link from "next/link"
import { Card } from "@/components/ui/card"
import type { Service } from "@/lib/data/services"

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link href={`/services/${service.slug}`}>
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <h3>{service.name}</h3>
        <p>{service.shortDescription}</p>
      </Card>
    </Link>
  )
}
```

### Dynamic Route
```tsx
// app/services/[slug]/page.tsx
import { notFound } from "next/navigation"
import { getServiceBySlug, getAllServices } from "@/lib/data/services"

export async function generateStaticParams() {
  return getAllServices().map((service) => ({
    slug: service.slug,
  }))
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) notFound()

  return (
    <article>
      <h1>{service.name}</h1>
      <p>{service.description}</p>
    </article>
  )
}
```

---

## SEO Implementation

### Approach: Inline JSON-LD

Keep it simple - add JSON-LD directly in pages that need it:

```tsx
// app/page.tsx
import { businessInfo } from "@/lib/data/business-info"

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: businessInfo.name,
            description: businessInfo.description,
            telephone: businessInfo.phone,
            email: businessInfo.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: businessInfo.address.street,
              addressLocality: businessInfo.address.city,
              addressRegion: businessInfo.address.state,
              postalCode: businessInfo.address.zip,
              addressCountry: businessInfo.address.country,
            },
            url: businessInfo.url,
          }),
        }}
      />
      {/* Page content */}
    </>
  )
}
```

**Why inline instead of centralized generators:**
- AI can generate exactly what each page needs
- No abstraction layer to learn
- Easier to understand and modify
- Can extract to helpers later if patterns emerge

### Metadata Helper

Simple utility for page metadata:

```typescript
// lib/seo/metadata.ts
import { businessInfo } from "@/lib/data/business-info"
import type { Metadata } from "next"

export function generatePageMetadata(
  title: string,
  description: string,
  path: string = ""
): Metadata {
  const url = `${businessInfo.url}${path}`

  return {
    title: `${title} | ${businessInfo.name}`,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: businessInfo.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  }
}
```

### Usage
```tsx
// app/services/page.tsx
import { generatePageMetadata } from "@/lib/seo/metadata"

export const metadata = generatePageMetadata(
  "Our Services",
  "Explore our range of professional services.",
  "/services"
)
```

---

## Sections Library

Ship these sections with placeholder content. AI edits them to match the business:

| Section | File | Purpose |
|---------|------|---------|
| **HeroSimple** | `hero/HeroSimple.tsx` | Text-focused hero |
| **HeroWithImage** | `hero/HeroWithImage.tsx` | Hero with side image |
| **FeaturedServices** | `services/FeaturedServices.tsx` | 3 service cards for homepage |
| **ServicesGrid** | `services/ServicesGrid.tsx` | All services grid |
| **ServiceCard** | `services/ServiceCard.tsx` | Reusable service card |
| **AboutSection** | `about/AboutSection.tsx` | About the business |
| **FeaturesSection** | `features/FeaturesSection.tsx` | Benefits/features grid |
| **TestimonialsSection** | `testimonials/TestimonialsSection.tsx` | Customer reviews |
| **CTASection** | `cta/CTASection.tsx` | Call-to-action block |
| **FAQSection** | `faq/FAQSection.tsx` | Accordion FAQ |
| **LocationSection** | `location/LocationSection.tsx` | Map + address |
| **GallerySection** | `gallery/GallerySection.tsx` | Image gallery |

---

## Claude Code Integration

### Skills

Located in `.claude/skills/`:

| Skill | Purpose |
|-------|---------|
| `frontend-design/` | UI design guidance and principles |
| `add-page/` | Scaffold a new page with metadata, layout, sections |
| `add-section/` | Create a new section component following patterns |

### Settings

```json
// .claude/settings.json
{
  "enabledPlugins": {
    "frontend-design@claude-plugins-official": true
  },
  "enabledMcpjsonServers": ["next-devtools"],
  "enableAllProjectMcpServers": true
}
```

### CLAUDE.md

The `CLAUDE.md` file provides:
- Development commands and constraints
- Next.js 16 async patterns
- Component architecture guidelines
- Coding standards (Tailwind, TypeScript)
- Data management patterns
- Common task workflows

---

## Pages Shipped

### Included
| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Hero + featured sections |
| Services | `/services` | Grid of all services |
| Service Detail | `/services/[slug]` | Individual service page |
| 404 | `/not-found` | Custom error page |

### Added via Skills (not shipped)
- About (`/about`)
- Contact (`/contact`)
- Blog (`/blog`, `/blog/[slug]`)
- Team (`/team`)

---

## Development Commands

```bash
bun install       # Install dependencies
bun dev           # Start dev server (Turbopack)
bun build         # Production build
bun start         # Start production server
bun check         # Lint + type-check (run after every change)
bun lint          # ESLint only
bun type-check    # TypeScript only
```

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 100 |
| Lighthouse Accessibility | 100 |
| Lighthouse Best Practices | 100 |
| Lighthouse SEO | 100 |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3s |
| JavaScript Bundle | < 100KB |

**Key optimizations:**
- Server Components by default
- `"use client"` only when needed
- Next.js `<Image>` for all images
- Turbopack for fast dev builds
- Bun for fast installs

---

## Placeholder Content Guidelines

All placeholder content should:
1. Be clearly recognizable as placeholder ("Your Business Name", not "Acme Corp")
2. Show the structure (correct number of items, proper lengths)
3. Use realistic formatting (phone numbers as (555) 000-0000)
4. Include helpful comments where needed
5. Be easy to find-and-replace

**Example patterns:**
- Business name: `"Your Business Name"`
- Tagline: `"Your compelling tagline goes here"`
- Phone: `"(555) 000-0000"`
- Email: `"hello@example.com"`
- Service names: `"Service One"`, `"Service Two"`, etc.
- Descriptions: `"Brief description of [what this is]..."`
