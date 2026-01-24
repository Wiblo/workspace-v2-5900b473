---
name: brand-setup
description: Establish brand identity for a client website. Guides decisions on colors, typography, border radius, and visual tone. Creates docs/brand-guide.md and updates app/globals.css. Run this skill first before building - it informs all other design decisions.
---

This skill establishes the visual brand identity for a client website. It creates a documented brand guide and implements the decisions in the codebase.

## Outputs

1. **`docs/brand-guide.md`** - Human-readable brand documentation
2. **`app/globals.css`** - Updated CSS variables (colors, radius)
3. **`app/layout.tsx`** - Updated with font imports via `next/font/google`

## Philosophy

**The main goal is to meet the user's desires.**

- If the user provides examples, colors, or references - **follow them exactly**
- If they provide minimal input, **get creative and infer** from context
- **Never ask back-and-forth questions** - make decisions and execute
- Most brands use color sparingly (neutrals dominate), but if the user provides a creative/bold example, match that energy exactly

## Process

### Step 1: Understand What's Provided

The user may provide:
- Color values or palettes
- Example websites or screenshots
- Logo or brand assets
- A description of the business
- A mood or feeling they want
- Nothing at all (infer from business type)

**Whatever they provide, follow it closely.** If they give hex colors, convert to OKLCH. If they show a website, match its aesthetic. If they describe a feeling, translate that into concrete design choices.

### Step 2: Make Brand Decisions

#### Colors (Required)

Use **OKLCH color space** for all colors unless user specifies otherwise. Define these tokens:

| Token | Purpose |
|-------|---------|
| `primary` | Buttons, links, key actions |
| `primary-foreground` | Text on primary backgrounds |
| `secondary` | Subtle backgrounds, cards |
| `secondary-foreground` | Text on secondary |
| `muted` | Disabled states, quiet areas |
| `muted-foreground` | Secondary text, captions |
| `accent` | Hover states, highlights |
| `accent-foreground` | Text on accent |
| `background` | Page background |
| `foreground` | Body text |
| `border` | Borders, dividers |
| `destructive` | Errors, delete actions |

**Default approach** (unless user specifies otherwise):
- Use color **sparingly** - neutrals dominate the UI
- Primary color appears on buttons, links, and key CTAs only
- Add subtle brand tint to grays for cohesion

**Creative approach** (when user provides bold examples):
- Match the energy and saturation of their reference
- If they want vibrant, go vibrant
- If they want dark mode by default, do it

#### Typography (Required)

**Always use Google Fonts** via `next/font/google` in the root layout.

Choose fonts that match the brand personality:

| Personality | Heading Examples | Body Examples |
|-------------|------------------|---------------|
| Professional/Trust | Libre Baskerville, Playfair Display, Lora | Source Sans 3, Open Sans, Nunito |
| Modern/Clean | Poppins, Outfit, Plus Jakarta Sans | DM Sans, Work Sans, Rubik |
| Friendly/Warm | Quicksand, Nunito, Comfortaa | Nunito Sans, Open Sans, Lato |
| Bold/Strong | Oswald, Bebas Neue, Anton | Barlow, Source Sans 3, Roboto |
| Elegant/Luxury | Cormorant Garamond, Playfair Display | Raleway, Montserrat, Lato |
| Playful/Creative | Fredoka, Baloo 2, Lilita One | Nunito, Quicksand, Patrick Hand |

**Prefer variable fonts** for best performance. If not available, specify weights.

**Never use**: Inter, Roboto, Arial, system fonts (too generic)

#### Border Radius (Required)

Set the `--radius` variable:

| Value | Feel |
|-------|------|
| `0` | Sharp, brutalist, editorial |
| `0.25rem - 0.5rem` | Subtle, professional |
| `0.625rem` (default) | Balanced, friendly |
| `0.75rem - 1rem` | Soft, approachable |
| `1.5rem+` | Very rounded, playful |

#### Visual Tone

Infer and document:
- Light vs. dark default
- Minimal vs. detailed
- Dense vs. spacious
- Sharp vs. soft
- Formal vs. casual

### Step 3: Create Brand Guide

Write `docs/brand-guide.md`:

```markdown
# Brand Guide

## Overview
[1-2 sentence brand summary]

## Colors

### Primary Palette
- **Primary**: [color] - [when to use]
- **Secondary**: [color] - [when to use]
- **Accent**: [color] - [when to use]

### Neutral Palette
- **Background**: [color]
- **Foreground**: [color]
- **Muted**: [color]
- **Border**: [color]

### OKLCH Values
[Table of all CSS variable values for light and dark modes]

## Typography

### Fonts
- **Headings**: [Font name] - [characteristics]
- **Body**: [Font name] - [characteristics]

### Implementation
[Code snippet for next/font/google setup in layout.tsx]

## Shape & Space

### Border Radius
- Base radius: [value]
- Feel: [description]

## Visual Guidelines

### Do
- [guideline]

### Don't
- [guideline]
```

### Step 4: Update layout.tsx with Fonts

**Fonts must be loaded in `app/layout.tsx`** using `next/font/google`. This is the Next.js recommended approach - it automatically self-hosts fonts and prevents layout shift.

```tsx
import { Poppins, DM_Sans } from 'next/font/google'

// For variable fonts (preferred):
const heading = Poppins({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
})

const body = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

Then reference in CSS:
```css
@theme inline {
  --font-sans: var(--font-body);
  --font-heading: var(--font-heading);
}
```

### Step 5: Update globals.css

Update `app/globals.css` with colors and radius only (fonts go in layout.tsx):

1. Update `:root` with light mode color values
2. Update `.dark` with dark mode color values
3. Update `--radius` if changing roundedness
4. Update font variable references in `@theme inline` if needed

**Do NOT use CSS @import for fonts** - always use `next/font/google` in layout.tsx.

## Hard Rules

**NEVER do these unless the user explicitly requests:**
- NEVER use gradients (solid colors only)
- NEVER use purple or multicolor gradients
- NEVER use glow effects as primary affordances
- NEVER use generic fonts (Inter, Roboto, Arial, system-ui)
- NEVER ask the user back-and-forth questions - infer and execute
- NEVER use CSS @import for fonts - use next/font/google

**ALWAYS do these:**
- ALWAYS use Google Fonts via `next/font/google` in layout.tsx
- ALWAYS use OKLCH color space
- ALWAYS document decisions in brand-guide.md
- ALWAYS follow user-provided examples exactly
- ALWAYS ensure sufficient contrast (4.5:1 minimum for text)
- ALWAYS get creative when given minimal input

## Converting Colors to OKLCH

When user provides hex/rgb colors, convert to OKLCH:

```
Hex #5B8DAE → oklch(0.62 0.08 230)
```

Use an online converter or estimate:
- L (lightness): 0 = black, 1 = white
- C (chroma): 0 = gray, 0.4+ = vivid
- H (hue): 0-360 degrees (0=red, 120=green, 240=blue)

## Example: Minimal Input

User says: "I'm a chiropractor"

Infer:
- Healthcare = trustworthy, calm, professional
- Colors: Blue or teal (trust), soft greens (wellness), warm neutrals
- Typography: Clean but warm (Nunito + Open Sans, or Poppins + DM Sans)
- Radius: 0.625rem-0.75rem (friendly but professional)
- Tone: Light, spacious, calm

## Example: Detailed Input

User provides: Screenshot of a bold dark-mode site with orange accents

Match exactly:
- Dark background as default
- Orange/amber primary
- High contrast typography
- Match their spacing density
- Match their border radius
