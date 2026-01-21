---
name: metadata-files
description: Generate and manage Next.js metadata files including favicons, manifest.json, opengraph images, twitter images, robots.txt, and sitemap.xml following Next.js 16 conventions.
metadata:
  author: local
  version: "1.0.0"
  argument-hint: [type]
---

# Metadata Files Skill

Generate and manage Next.js App Router metadata files for SEO, social sharing, and PWA support.

## Usage

```
/metadata-files              # Show available metadata file types
/metadata-files favicon      # Generate favicon, icon, apple-icon files
/metadata-files manifest     # Generate manifest.json for PWA
/metadata-files opengraph    # Generate opengraph-image and twitter-image
/metadata-files robots       # Generate robots.txt
/metadata-files sitemap      # Generate sitemap.xml
/metadata-files all          # Generate all metadata files
```

## Instructions

When this skill is invoked, follow these steps:

### Step 1: Determine What to Generate

Based on the argument provided:
- No argument: check if everything is in place, if not, generate the missing files
- Specific type: Generate that metadata file type
- "all": Generate all metadata files

### Step 2: Check Current State

Before generating, check what already exists:

```bash
# Check for existing metadata files
ls -la app/favicon.ico app/icon.* app/apple-icon.* 2>/dev/null
ls -la app/manifest.ts app/manifest.json 2>/dev/null
ls -la app/opengraph-image.* app/twitter-image.* 2>/dev/null
ls -la app/robots.ts app/robots.txt 2>/dev/null
ls -la app/sitemap.ts app/sitemap.xml 2>/dev/null
```

### Step 3: Read Reference Documentation

For each file type, read the corresponding documentation:

| Type | Reference Doc |
|------|---------------|
| favicon/icon | `rules/favicon-icon.md` |
| manifest | `rules/manifest.md` |
| opengraph/twitter | `rules/opengraph-image.md` |
| robots | `rules/robots.md` |
| sitemap | `rules/sitemap.md` |

### Step 4: Generate Files

Follow the patterns in the reference docs. Use these project-specific values:

```typescript
// Import business info for consistent data
import { businessInfo } from '@/lib/data/business-info'

// Use these for URLs
const siteUrl = businessInfo.url  // e.g., "https://example.com"
const siteName = businessInfo.name
```

### File Generation Guidelines

#### Favicon & Icons (`/metadata-files favicon`)

1. Check if `app/favicon.ico` exists
2. If not, check for a logo in `public/` (logo.png, logo.svg) and convert to .ico using ImageMagick or png-to-ico
3. Generate `app/icon.tsx` using ImageResponse for dynamic icon generation
4. Generate `app/apple-icon.tsx` for Apple touch icon

To convert PNG to ICO:
```bash
# ImageMagick (if installed)
convert public/logo.png -define icon:auto-resize=64,48,32,16 app/favicon.ico

# Or use png-to-ico package (see rules/favicon-icon.md for script)
```

Reference: Read `rules/favicon-icon.md`

#### Manifest (`/metadata-files manifest`)

Generate `app/manifest.ts` with:
- App name and short_name from businessInfo
- Theme colors from CSS variables or hardcoded brand colors
- Icon references
- PWA configuration

Reference: Read `rules/manifest.md`

#### OpenGraph & Twitter Images (`/metadata-files opengraph`)

Generate:
- `app/opengraph-image.tsx` (1200x630px)
- `app/twitter-image.tsx` (1200x600px)

Use ImageResponse with:
- Business name and tagline
- Brand colors
- Professional layout

Reference: Read `rules/opengraph-image.md`

#### Robots.txt (`/metadata-files robots`)

Generate `app/robots.ts` with:
- Allow all public routes
- Disallow admin/api routes if they exist
- Reference sitemap URL

Reference: Read `rules/robots.md`

#### Sitemap (`/metadata-files sitemap`)

Generate `app/sitemap.ts` with:
- All static pages
- Dynamic pages (services, blog posts if applicable)
- Proper lastModified dates
- Priority and changeFrequency hints

Reference: Read `rules/sitemap.md`

### Step 5: Validate

After generating files:

```bash
bun check      # Ensure no type errors
bun run build  # Verify files generate correctly
```

### Step 6: Report Summary

```
## Metadata Files Summary

**Generated:**
- [x] app/icon.tsx (32x32 PNG)
- [x] app/apple-icon.tsx (180x180 PNG)
- [x] app/manifest.ts
- [x] app/opengraph-image.tsx (1200x630)
- [x] app/twitter-image.tsx (1200x600)
- [x] app/robots.ts
- [x] app/sitemap.ts

**Manual Steps Required:**
- [ ] Verify favicon.ico looks correct (generated from logo if available)
- [ ] Update theme colors in manifest.ts if needed
- [ ] Customize opengraph-image design if needed

**Verification:**
Visit these URLs after `bun dev`:
- /icon - Dynamic favicon
- /apple-icon - Apple touch icon
- /manifest.webmanifest - PWA manifest
- /opengraph-image - OG image preview
- /twitter-image - Twitter card image
- /robots.txt - Robots file
- /sitemap.xml - XML sitemap
```

## Best Practices

1. **Use Dynamic Generation**: Prefer `.ts`/`.tsx` files over static files for easier updates
2. **Consistent Branding**: Pull colors and names from centralized config
3. **Test Images**: Preview OG/Twitter images using social media debuggers
4. **Sitemap Updates**: Sitemap should auto-include new pages if using dynamic generation
5. **Cache Headers**: Generated files are statically optimized by default

## Common Issues

- **favicon.ico**: Cannot be dynamically generated by Next.js, but can be converted from PNG using ImageMagick or png-to-ico
- **Image sizes**: OG = 1200x630, Twitter = 1200x600, Icon = 32x32, Apple = 180x180
- **Build errors**: Ensure ImageResponse imports from 'next/og'
- **Missing in head**: Files must be in `app/` directory root (not `public/`)
