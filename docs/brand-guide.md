# Brand Guide

## Overview

Professional, trustworthy aesthetic for local service businesses. Blue conveys reliability and calm; warm neutrals prevent clinical coldness. Color is used sparingly - the UI is predominantly neutral with blue reserved for key actions.

## Colors

### Primary Palette

| Token | Purpose | Usage |
|-------|---------|-------|
| **Primary** | Buttons, links, CTAs | Main brand color - use sparingly for key actions |
| **Secondary** | Subtle backgrounds | Footer, FAQ cards, alternate sections |
| **Accent** | Hover states | Interactive element highlights |

### Neutral Palette

| Token | Purpose |
|-------|---------|
| **Background** | Page background (white) |
| **Foreground** | Body text (dark with blue undertone) |
| **Muted** | Disabled states, quiet backgrounds |
| **Muted Foreground** | Secondary text, captions |
| **Border** | Dividers, input borders |

### OKLCH Values

#### Light Mode

```css
--background: oklch(0.995 0 0);
--foreground: oklch(0.15 0.01 240);
--primary: oklch(0.55 0.12 240);
--primary-foreground: oklch(0.98 0 0);
--secondary: oklch(0.82 0.03 240);
--secondary-foreground: oklch(0.2 0.02 240);
--muted: oklch(0.96 0.01 240);
--muted-foreground: oklch(0.45 0.02 240);
--accent: oklch(0.94 0.03 240);
--accent-foreground: oklch(0.2 0.02 240);
--border: oklch(0.91 0.01 240);
--ring: oklch(0.55 0.12 240);
```

#### Dark Mode

```css
--background: oklch(0.14 0.015 240);
--foreground: oklch(0.96 0.005 240);
--primary: oklch(0.7 0.12 240);
--primary-foreground: oklch(0.14 0.015 240);
--secondary: oklch(0.22 0.02 240);
--secondary-foreground: oklch(0.96 0.005 240);
--muted: oklch(0.22 0.02 240);
--muted-foreground: oklch(0.65 0.02 240);
--accent: oklch(0.26 0.04 240);
--accent-foreground: oklch(0.96 0.005 240);
--border: oklch(1 0 0 / 10%);
--ring: oklch(0.7 0.12 240);
```

### Color Hue Reference

- **Hue 240** = Blue (primary brand color)
- **Chroma 0.12** = Moderate saturation (professional, not flashy)
- **Chroma 0.01-0.03** = Very subtle tint (for neutrals)

## Typography

### Fonts

| Role | Font | Characteristics |
|------|------|-----------------|
| **Headings** | Geist Sans | Clean, modern, geometric |
| **Body** | Geist Sans | Same family for consistency |

### Implementation

Fonts are loaded via `next/font/google` in `app/layout.tsx`:

```tsx
import { Geist } from 'next/font/google'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})
```

## Shape & Space

### Border Radius

| Variable | Value | Components |
|----------|-------|------------|
| `--radius` | `0.625rem` | Base radius |
| `--radius-sm` | `0.375rem` | Small elements |
| `--radius-lg` | `0.625rem` | Cards, modals |
| `--radius-xl` | `1rem` | Large containers |
| `--radius-4xl` | `2rem` | Hero sections, major blocks |

**Feel**: Balanced - friendly but professional. Not too sharp, not too soft.

### Spacing

Use Tailwind's default spacing scale. Key patterns:
- Section padding: `py-16 md:py-24`
- Card padding: `p-6` or `p-8`
- Gap between items: `gap-4` to `gap-8`

## Visual Guidelines

### Do

- Use primary color only for buttons, links, and key CTAs
- Keep backgrounds neutral (white, light gray)
- Add subtle blue undertones to grays for cohesion
- Use generous whitespace
- Maintain strong contrast for readability

### Don't

- Don't use gradients (solid colors only)
- Don't use glow effects
- Don't overuse the primary color
- Don't use pure black (#000) - use the foreground token
- Don't use highly saturated colors

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

### Subtle Backgrounds

```tsx
// For sections needing visual separation
className="bg-secondary/10"
```

## Accessibility

- Primary on white: ~4.7:1 contrast ratio (WCAG AA)
- Foreground on background: ~12:1 contrast ratio (WCAG AAA)
- All interactive elements have visible focus states
- Minimum touch target: 44x44px
