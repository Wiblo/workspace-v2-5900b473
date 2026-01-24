---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Before You Start (CRITICAL)

### 1. Follow User-Provided Examples EXACTLY
**If the user provides example code, images, or references, follow them exactly:**
- Match the layout, spacing, and visual hierarchy
- Use the same colors, fonts, and styling patterns
- Replicate the structure and component organization
- Don't "improve" or deviate from the example unless asked

### 2. Read Brand Guidelines
**ALWAYS check if `docs/brand-guide.md` exists.** If it does, read it first and follow it exactly:
- Use the documented color palette
- Use the specified fonts
- Match the visual tone and style
- Follow the "Do" and "Don't" guidelines

### 3. Analyze the Target Page
**If designing for an existing page, read the page file first:**
- Understand what components are already on the page
- Match the visual style and patterns of existing sections
- Ensure your new component fits cohesively with siblings
- Use the same spacing, typography scale, and color usage

### 4. Explore Existing Components
**ALWAYS search for existing components before creating new ones:**
- Check `components/sections/` for similar sections
- Check `components/ui/` for shadcn primitives
- Check `components/layout/` for wrappers (Container, SectionWrapper)
- Understand the patterns already in use

### 5. Check the Styling System
Read `app/globals.css` to understand:
- Available color tokens (background, foreground, primary, secondary, muted, accent, etc.)
- Current radius value
- Font variables
- Any custom utilities

## Design Thinking

**If the user provides examples (code, images, screenshots, references):**
Skip the aesthetic exploration below. Your job is to **replicate the example exactly**, not to be creative. Match every detail: layout, colors, spacing, typography, effects. Only deviate if explicitly asked.

**If designing from scratch (no examples provided):**
Understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

**IMPORTANT**: If a brand guide exists, your "bold direction" must stay within the brand's established identity. Creativity happens within constraints.

**IMPORTANT**: If designing for an existing page, match the visual language of components already on that page. Consistency trumps creativity.

Then implement working code (HTML/CSS/JS, Nextjs, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Technical Requirements

### Tailwind CSS 4 Theme System

This project uses Tailwind CSS 4 with:
- CSS variables in `app/globals.css` using **OKLCH color space**
- Theme configuration via `@theme inline` directive
- Dark mode via `.dark` class with `@custom-variant dark (&:is(.dark *))`
- Semantic color tokens: `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `chart-*`

**MUST follow:**
- Use Tailwind CSS defaults unless custom values already exist or are explicitly requested
- Use existing theme color tokens (`bg-primary`, `text-foreground`, etc.) before introducing new ones
- Use `cn()` utility (clsx + tailwind-merge) for conditional class logic
- Use the project's existing component primitives first (shadcn/ui in `components/ui/`)

### Animation Guidelines

| Requirement | Rule |
|-------------|------|
| JS animation | MUST use `motion/react` (formerly framer-motion) |
| CSS animations | SHOULD use `tw-animate-css` for entrance and micro-animations |
| Entrance timing | SHOULD use `ease-out` easing |
| Feedback timing | NEVER exceed 200ms for interaction feedback |
| Paint properties | SHOULD avoid animating `background`, `color` except for small, local UI (text, icons) |
| Looping animations | MUST pause when off-screen |
| Accessibility | MUST respect `prefers-reduced-motion` |

### Layout & Sizing

| Requirement | Rule |
|-------------|------|
| Full height | NEVER use `h-screen`, use `h-dvh` instead |
| Fixed elements | MUST respect `safe-area-inset` for mobile |
| Loading states | SHOULD use structural skeletons |
| Destructive actions | MUST use AlertDialog for confirmation |

### Forms & Input

| Requirement | Rule |
|-------------|------|
| Error display | MUST show errors next to where the action happens |
| Paste handling | NEVER block paste in `input` or `textarea` elements |

### Typography

| Requirement | Rule |
|-------------|------|
| Headings | MUST use `text-balance` |
| Body/paragraphs | MUST use `text-pretty` |
| Numeric data | MUST use `tabular-nums` |
| Dense UI | SHOULD use `truncate` or `line-clamp` |
| Letter spacing | NEVER modify `tracking-*` unless explicitly requested |

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: If no brand guide exists, choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter. If a brand guide exists, use the specified fonts exactly.
- **Color & Theme**: Use the project's existing color tokens (`bg-background`, `text-foreground`, `bg-primary`, etc.). Dominant colors with sharp accents outperform timid, evenly-distributed palettes. If a brand guide exists, follow its color guidance.
- **Motion**: Use animations for effects and micro-interactions. Use `tw-animate-css` for CSS animations and `motion/react` for JS animations. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (`animation-delay`) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

**IMPORTANT**: When a brand guide exists, your creativity operates within those constraints. The brand identity is already established - your job is to execute it beautifully, not to override it with your own aesthetic preferences.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

## Checklist Before Submitting

Before considering any component or page complete:

- [ ] Followed user-provided examples/images exactly (if provided)
- [ ] Read the target page to understand existing components (if adding to a page)
- [ ] New component matches the visual style of sibling components on the page
- [ ] Read `docs/brand-guide.md` (if exists) and followed its guidelines
- [ ] Used existing color tokens from `globals.css` (not hardcoded colors)
- [ ] Used existing component primitives from `components/ui/`
- [ ] Used `cn()` for conditional class logic
- [ ] Used `text-balance` for headings, `text-pretty` for body text
- [ ] Used `h-dvh` instead of `h-screen` for full-height layouts
- [ ] Used `motion/react` for JS animations, `tw-animate-css` for CSS animations
- [ ] Respected `prefers-reduced-motion` for animations
- [ ] Used structural skeletons for loading states
- [ ] Used AlertDialog for destructive/irreversible actions
- [ ] Errors display next to where the action happens
- [ ] No paste blocking on inputs/textareas
- [ ] Fixed elements respect `safe-area-inset`
