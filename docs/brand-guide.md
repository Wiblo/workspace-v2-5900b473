# Brand Guide - Proactive Therapy

## Overview

A professional, modern purple brand for Proactive Therapy, a physiotherapy practice that helps people recover from injury, manage pain, and achieve movement goals. The purple conveys trust, expertise, and a progressive approach to care. Color is used sparingly -- the UI is predominantly neutral with purple reserved for key actions and CTAs.

## Colors

### Primary Palette

| Token | Purpose | Usage |
|-------|---------|-------|
| **Primary** | Buttons, links, CTAs | Rich purple - use for key actions only |
| **Secondary** | Subtle backgrounds | Light purple-tinted gray for cards, alternate sections |
| **Accent** | Hover states | Soft purple tint for interactive highlights |

### Neutral Palette

| Token | Purpose |
|-------|---------|
| **Background** | Page background (near-white with faint purple warmth) |
| **Foreground** | Body text (dark with purple undertone) |
| **Muted** | Disabled states, quiet backgrounds |
| **Muted Foreground** | Secondary text, captions |
| **Border** | Dividers, input borders (purple-tinted gray) |

### OKLCH Values

#### Light Mode

```css
--background: oklch(0.995 0.002 300);
--foreground: oklch(0.15 0.015 300);
--card: oklch(1 0 0);
--card-foreground: oklch(0.15 0.015 300);
--primary: oklch(0.5 0.16 295);
--primary-foreground: oklch(0.98 0 0);
--secondary: oklch(0.93 0.02 295);
--secondary-foreground: oklch(0.2 0.02 295);
--muted: oklch(0.96 0.01 295);
--muted-foreground: oklch(0.45 0.02 295);
--accent: oklch(0.94 0.03 295);
--accent-foreground: oklch(0.2 0.02 295);
--border: oklch(0.91 0.012 295);
--ring: oklch(0.5 0.16 295);
```

#### Dark Mode

```css
--background: oklch(0.14 0.018 295);
--foreground: oklch(0.96 0.006 295);
--card: oklch(0.18 0.018 295);
--card-foreground: oklch(0.96 0.006 295);
--primary: oklch(0.7 0.14 295);
--primary-foreground: oklch(0.14 0.018 295);
--secondary: oklch(0.22 0.025 295);
--secondary-foreground: oklch(0.96 0.006 295);
--muted: oklch(0.22 0.025 295);
--muted-foreground: oklch(0.65 0.02 295);
--accent: oklch(0.26 0.045 295);
--accent-foreground: oklch(0.96 0.006 295);
--border: oklch(1 0 0 / 10%);
--ring: oklch(0.7 0.14 295);
```

### Color Hue Reference

- **Hue 295** = Purple (primary brand color, in the violet-purple range)
- **Chroma 0.16** = Moderate-strong saturation (vibrant but professional)
- **Chroma 0.01-0.03** = Very subtle tint (for neutrals with purple warmth)

## Typography

### Fonts

| Role | Font | Characteristics |
|------|------|-----------------|
| **Headings** | Plus Jakarta Sans | Modern, geometric, confident -- conveys expertise and forward-thinking care |
| **Body** | DM Sans | Clean, highly readable, friendly -- approachable for all audiences |

### Implementation

Fonts are loaded via `next/font/google` in `app/layout.tsx`:

```tsx
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google'

const heading = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700', '800'],
})

const body = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
})
```

### Font Usage in CSS

```css
@theme inline {
  --font-sans: var(--font-body);
  --font-heading: var(--font-heading);
}
```

Use `font-heading` for headings: `className="font-heading text-3xl font-bold"`
Body text uses the default `font-sans` (DM Sans) automatically.

## Shape & Space

### Border Radius

| Variable | Value | Components |
|----------|-------|------------|
| `--radius` | `0.75rem` | Base radius |
| `--radius-sm` | `0.5rem` | Small elements, badges |
| `--radius-lg` | `0.75rem` | Cards, modals |
| `--radius-xl` | `1.125rem` | Large containers |
| `--radius-4xl` | `2.25rem` | Hero sections, major blocks |

**Feel**: Soft and approachable -- rounded enough to feel friendly and modern, but not so rounded as to feel playful. Matches the approachable, professional brand personality.

### Spacing

Use Tailwind's default spacing scale. Key patterns:
- Section padding: `py-16 md:py-24`
- Card padding: `p-6` or `p-8`
- Gap between items: `gap-4` to `gap-8`

## Visual Guidelines

### Tone

- **Light default** -- clean, clinical-but-warm
- **Modern and minimal** -- not cluttered
- **Spacious** -- generous whitespace
- **Soft edges** -- rounded corners
- **Professional but approachable** -- not cold or sterile

### Do

- Use purple primarily for buttons, links, and key CTAs
- Keep backgrounds neutral (white, near-white with subtle purple warmth)
- Add subtle purple undertones to grays for cohesion
- Use generous whitespace for a clean, professional feel
- Maintain strong contrast for readability (4.5:1 minimum)
- Use `font-heading` class for all headings and hero text

### Don't

- Don't use gradients (solid colors only)
- Don't use glow effects
- Don't overuse the primary purple -- keep it for actions
- Don't use pure black (#000) -- use the foreground token
- Don't use highly saturated backgrounds -- keep purple for accents
- Don't mix heading and body fonts inconsistently

## Component Patterns

### Buttons

```tsx
// Primary action
className="bg-primary text-primary-foreground hover:bg-primary/90"

// Secondary action
className="bg-secondary text-secondary-foreground hover:bg-secondary/80"

// Outline
className="border border-primary text-primary hover:bg-accent"
```

### Cards

```tsx
className="bg-card text-card-foreground border border-border rounded-lg"
```

### Headings

```tsx
// Section heading
className="font-heading text-3xl font-bold tracking-tight"

// Page title
className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight"
```

### Subtle Backgrounds

```tsx
// For sections needing visual separation
className="bg-secondary/30"
```

## Accessibility

- Primary on white: ~4.5:1 contrast ratio (WCAG AA)
- Foreground on background: ~12:1 contrast ratio (WCAG AAA)
- All interactive elements have visible focus states
- Minimum touch target: 44x44px
- Purple primary chosen at lightness 0.5 for strong contrast against white text
