---
name: update-components
description: Migrate components from sandbox-chiropractor-new to service-template, preserving styles while following project conventions. Runs code review and fixes issues automatically.
metadata:
  author: local
  version: "1.0.0"
  argument-hint: <category> (layout|hero|about|features|services|cta|faq|gallery|location|testimonials|treatments)
---

# Update Components Skill

Automates the component migration workflow:
1. Compare components between source and target projects
2. Launch parallel agents to migrate each component
3. Run code review on migrated components
4. Fix any high-confidence issues
5. Validate with `bun check` and `bun run build`

## Source and Target

- **Source (style reference):** `/home/mpryce/chiropractor/sandbox-chiropractor-new/components/`
- **Target (this project):** `/home/mpryce/chiropractor/service-template/service-template/components/`

## Usage

```
/update-components layout       # Migrate layout components (Navbar, Footer, etc.)
/update-components hero         # Migrate hero section components
/update-components about        # Migrate about section components
/update-components services     # Migrate services section components
/update-components all          # Migrate all component categories
```

## Instructions

When this skill is invoked, follow these steps:

### Step 1: Identify Components to Migrate

Based on the category argument, identify which components need to be migrated:

**layout** (components/layout/):
- Navbar.tsx
- Footer.tsx
- Container.tsx
- SectionWrapper.tsx
- Breadcrumb.tsx (may be new)

**hero** (components/sections/hero/):
- HeroWithImage.tsx
- HeroSection.tsx
- ServicesHero.tsx

**about** (components/sections/about/):
- AboutFullSection.tsx
- AboutSection.tsx / AboutPreview.tsx

**features** (components/sections/features/):
- FeaturesSection.tsx
- AboutFeatures.tsx

**services** (components/sections/services/):
- FeaturedServices.tsx
- ServicesGrid.tsx
- ServiceDetailSection.tsx
- ServiceCard.tsx

**cta** (components/sections/cta/):
- CTASection.tsx

**faq** (components/sections/faq/):
- FAQSection.tsx / FaqSection.tsx

**gallery** (components/sections/gallery/):
- GallerySection.tsx

**location** (components/sections/location/):
- LocationSection.tsx

**testimonials** (components/sections/testimonials/):
- TestimonialsSection.tsx

**treatments** (components/sections/treatments/):
- TreatmentDetailSection.tsx
- TreatmentsListSection.tsx
- TreatmentsOverviewSection.tsx

For **all**, process each category in sequence.

### Step 2: Launch Parallel Migration Agents

For each component in the category, launch a parallel Task agent with these instructions:

```
Migrate the [ComponentName] component from the old template to the new structure.

**Source file**: `/home/mpryce/chiropractor/sandbox-chiropractor-new/components/[path]/[ComponentName].tsx`
**Target file**: `/home/mpryce/chiropractor/service-template/service-template/components/[path]/[ComponentName].tsx`

**Migration Rules**:
1. Read both source and target files (if target exists)
2. Adopt the source's styling and structure
3. Keep content INLINE in the component (not imported from external data files)
4. EXCEPTION: Import truly shared data from `@/lib/data/` (business info, navigation, services list)
5. Ensure all imports use `@/` path aliases for the target project
6. Apply these accessibility fixes:
   - Add `aria-hidden="true"` to decorative icons
   - Add `aria-label` to icon-only buttons
   - Add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` to interactive elements
   - Replace `transition-all` with explicit properties like `transition-colors` or `transition-[transform,opacity]`
7. Prefer Server Components (no "use client") unless the component needs:
   - useState, useEffect, or other hooks
   - Event handlers like onClick
   - Browser-only APIs
8. If creating a new file, ensure it follows existing patterns in the target project

Write the updated component to the target location.
```

### Step 3: Run Code Review

After all migration agents complete, run the code review skill on the migrated components:

```bash
# Get the path for the category
# layout -> components/layout/
# others -> components/sections/<category>/
```

Invoke `/code-review` with the component path to check for issues.

### Step 4: Fix High-Confidence Issues

For each issue with confidence score >= 80:
1. Read the file
2. Apply the suggested fix
3. Move to the next issue

Common fixes to apply automatically:
- Remove unnecessary `"use client"` directives
- Add `aria-hidden="true"` to decorative icons
- Add `aria-label` to buttons without visible text
- Add `aria-current="page"` to current breadcrumb items
- Replace `transition-all` with specific transition properties
- Add `focus-visible:ring-*` classes to interactive elements

### Step 5: Validate Changes

Run validation commands:

```bash
bun check      # Must pass (warnings OK, errors must be fixed)
bun run build  # Must succeed
```

If errors occur:
1. Read the error message
2. Fix the issue
3. Re-run validation
4. Repeat until both commands pass

### Step 6: Update Migration Plan

Update the `migration-plan.md` file to mark completed components:
- Change `[ ]` to `[x]` for migrated components
- Add notes about what changed

### Step 7: Report Summary

Output a summary:

```
## Migration Summary

**Category:** <category>
**Components Migrated:** <count>

### Changes Made
- [ComponentName]: <brief description of changes>
- ...

### Code Review Results
- Issues Found: <count>
- Issues Fixed: <count>

### Validation
- `bun check`: PASS/FAIL
- `bun run build`: PASS/FAIL

### Updated Files
- components/[path]/[file1].tsx
- components/[path]/[file2].tsx
- ...
```

## Migration Principles (from CLAUDE.md)

1. **Content Placement**: Content lives INSIDE section components, not in separate data files
2. **Shared Data Exception**: Data that appears in multiple places goes in `lib/data/`
   - Business info (name, phone, address) → `lib/data/business-info.ts`
   - Services list → `lib/data/services.ts`
   - Navigation links → `lib/data/navigation.ts`
3. **Server Components**: Prefer Server Components unless client interactivity is needed
4. **Design Tokens**: Use `bg-background`, `text-foreground`, `text-primary` (never `text-white`, `bg-black`)
5. **Tailwind Spacing**: Use spacing scale `p-4`, `mx-2` (not `p-[16px]`)
6. **Icons**: Use lucide-react, add `aria-hidden="true"` to decorative icons
7. **Images**: Use Next.js `<Image>` component with alt text

## Notes

- Components in `components/ui/` are shadcn/ui primitives - DO NOT modify
- Always check if the target component already exists before creating
- Preserve existing functionality unless explicitly changing it
- The source project may have different naming conventions - normalize to target conventions
