# Template Migration Plan

## Progress Summary

| Category | Total | Completed | Remaining |
|----------|-------|-----------|-----------|
| Layout | 5 | 5 | 0 |
| Hero | 3 | 3 | 0 |
| About | 2 | 2 | 0 |
| Features | 2 | 2 | 0 |
| Services | 4 | 4 | 0 |
| Treatments | 3 | 3 | 0 |
| CTA | 1 | 1 | 0 |
| FAQ | 1 | 1 | 0 |
| Gallery | 1 | 1 | 0 |
| Location | 1 | 1 | 0 |
| Testimonials | 1 | 1 | 0 |
| **Total** | **24** | **24** | **0** |

---

## Overview

We are adapting the old template (`sandbox-chiropractor-new`) to our new service-template structure. The goal is to:

1. **Keep styles** from the old template (sandbox-chiropractor-new)
2. **Content lives inside sections** - not in separate data files
3. **Shared data stays in `lib/data/`** - only for data that appears in multiple places and needs consistency (business info, services list, navigation, etc.)

## Migration Principles

- **Style Source**: `/home/mpryce/chiropractor/sandbox-chiropractor-new/`
- **Target Project**: `/home/mpryce/chiropractor/service-template/service-template/`
- Each section component should be self-contained with its own content
- Import from `lib/data/` only when data is truly shared across multiple components

---

## Architecture Pattern

All migrated components follow the **"content as variables"** pattern:

```tsx
// =============================================================================
// CONFIGURATION - Edit these variables to customize
// =============================================================================

/** Size option */
const size: "large" | "medium" | "small" = "large"

/** Overlay opacity: 0-100 */
const overlayOpacity = 20

/** Content - edit these values directly */
const sectionContent = {
  title: "Your Title Here",
  subtitle: "Your subtitle here",
  // ... other content
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ComponentName({ className }: Props) {
  // Use variables directly
  return (...)
}
```

### Key Rules

1. **Variables at top** - Configuration (size, columns, overlay) as typed constants
2. **Content inline** - Text, images, items as object variables
3. **Server components** - Remove `"use client"` unless hooks/interactivity needed
4. **Optional props** - For dynamic pages (like service details), allow props to override variables
5. **Accessibility** - `aria-hidden` on icons, `focus-visible:ring-*` on interactive elements
6. **Transitions** - Use specific properties (`transition-colors`) not `transition-all`

---

## Quick Commands

Run these in a new chat to migrate component categories:

```bash
# Migrate about and cta sections
/update-components about cta

# Migrate features and services sections
/update-components features services

# Migrate remaining sections
/update-components faq location testimonials treatments
```

---

## Files to Review & Migrate

### Layout Components ✅ COMPLETE

| Status | Source (sandbox) | Target (service-template) | Notes |
|--------|------------------|---------------------------|-------|
| [x] | `layout/Navbar.tsx` | `layout/Navbar.tsx` | CSS Grid, sticky header, animated CTA, accessibility fixes |
| [x] | `layout/Footer.tsx` | `layout/Footer.tsx` | Server component, rounded card, social icons, accessibility |
| [x] | `layout/Container.tsx` | `layout/Container.tsx` | Uses Tailwind container class |
| [x] | `layout/SectionWrapper.tsx` | `layout/SectionWrapper.tsx` | as prop includes "main" |
| [x] | `layout/Breadcrumb.tsx` | `layout/Breadcrumb.tsx` | **CREATED** - Server component with accessibility |

### Hero Sections ✅ COMPLETE

| Status | Source (sandbox) | Target (service-template) | Notes |
|--------|------------------|---------------------------|-------|
| [x] | `sections/hero/HeroWithImage.tsx` | `sections/hero/HeroWithImage.tsx` | Config via variables, optional props for dynamic pages, overlay opacity control |
| [x] | N/A | `sections/hero/HeroSection.tsx` | Config via variables, server component |
| [x] | N/A | `sections/hero/ServicesHero.tsx` | Config via variables, server component, size=small |

### About Sections ✅ COMPLETE

| Status | Source (sandbox) | Target (service-template) | Notes |
|--------|------------------|---------------------------|-------|
| [x] | `sections/about/AboutFullSection.tsx` | `sections/about/AboutFullSection.tsx` | Server component, rounded-4xl, content inline |
| [x] | `sections/about/AboutSection.tsx` | `sections/about/AboutPreview.tsx` | Server component, focus-visible styles, aria-hidden on icon |

### Features Sections ✅ COMPLETE

| Status | Source (sandbox) | Target (service-template) | Notes |
|--------|------------------|---------------------------|-------|
| [x] | `sections/features/FeaturesSection.tsx` | `sections/features/FeaturesSection.tsx` | Server component, rounded-4xl, content inline as variables |
| [x] | N/A | `sections/features/AboutFeatures.tsx` | Server component, rounded-4xl, content inline as variables |

### Services Sections ✅ COMPLETE

| Status | Source (sandbox) | Target (service-template) | Notes |
|--------|------------------|---------------------------|-------|
| [x] | `sections/services/FeaturedServices.tsx` | `sections/services/FeaturedServices.tsx` | Server component, focus-visible, aria-hidden, specific transitions |
| [x] | N/A | `sections/services/ServicesGrid.tsx` | Server component, uses ServiceCard with compact variant |
| [x] | N/A | `sections/services/ServiceDetailSection.tsx` | Server component, focus-visible, aria-hidden, specific transitions |
| [x] | N/A | `sections/services/ServiceCard.tsx` | Server component, focus-visible, aria-hidden, specific transitions, two variants |

### Treatments Sections ✅ COMPLETE

| Status | Source (sandbox) | Target (service-template) | Notes |
|--------|------------------|---------------------------|-------|
| [x] | `sections/treatments/TreatmentDetailSection.tsx` | `sections/treatments/TreatmentDetailSection.tsx` | Server component, uses services data, accessibility (aria-hidden, focus-visible) |
| [x] | `sections/treatments/TreatmentsListSection.tsx` | `sections/treatments/TreatmentsListSection.tsx` | Server component, alternating layout, uses services data |
| [x] | `sections/treatments/TreatmentsOverviewSection.tsx` | `sections/treatments/TreatmentsOverviewSection.tsx` | Server component, card grid, links to /treatments/[slug] |

### CTA Sections ✅ COMPLETE

| Status | Source (sandbox) | Target (service-template) | Notes |
|--------|------------------|---------------------------|-------|
| [x] | `sections/cta/CTASection.tsx` | `sections/cta/CTASection.tsx` | Server component, rounded-4xl, specific transitions, focus-visible, aria-hidden on icons |

### FAQ Sections ✅ COMPLETE

| Status | Source (sandbox) | Target (service-template) | Notes |
|--------|------------------|---------------------------|-------|
| [x] | `sections/faq/FaqSection.tsx` | `sections/faq/FAQSection.tsx` | Client component (needs useState), focus-visible styles, aria-hidden, specific transitions, JsonLd component |

### Gallery Sections ✅ COMPLETE

| Status | Source (sandbox) | Target (service-template) | Notes |
|--------|------------------|---------------------------|-------|
| [x] | `sections/gallery/GallerySection.tsx` | `sections/gallery/GallerySection.tsx` | Config via variables, content inline, server component |

### Location Sections ✅ COMPLETE

| Status | Source (sandbox) | Target (service-template) | Notes |
|--------|------------------|---------------------------|-------|
| [x] | `sections/location/LocationSection.tsx` | `sections/location/LocationSection.tsx` | Client component (needs useState/useEffect), rounded-4xl, focus-visible styles, aria-hidden, specific transitions |

### Testimonials Sections ✅ COMPLETE

| Status | Source (sandbox) | Target (service-template) | Notes |
|--------|------------------|---------------------------|-------|
| [x] | N/A | `sections/testimonials/TestimonialsSection.tsx` | Server component (removed use client), aria-hidden on stars, JsonLd component |

---

## Shared Data Files (lib/data/)

These should remain as imports because they're used across multiple components:

| File | Used By |
|------|---------|
| `business-info.ts` | Navbar, Footer, Hero, Contact, JSON-LD |
| `services.ts` | Navigation, Services page, Service cards |
| `navigation.ts` | Navbar, Footer |
| `testimonials.ts` | Testimonials section (multiple pages) |
| `faqs.ts` | FAQ section |
| `gallery.ts` | Can be removed - content now inline in GallerySection |

---

## Validation Checklist

After each migration batch:

- [ ] `bun check` passes (warnings OK, errors must be fixed)
- [ ] `bun run build` succeeds
- [ ] Components are server components where possible
- [ ] Accessibility attributes present (aria-hidden, aria-label, focus-visible)
- [ ] No `transition-all` usage
- [ ] Content is inline as variables (not imported from lib/data unless shared)
