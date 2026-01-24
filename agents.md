# Agent Architecture

This document describes the multi-agent pipeline for creating websites from this template.

## Overview

When a user provides business details, multiple specialized agents work together to create a complete website:

```
User Input (business details)
         │
         ▼
┌─────────────────┐
│  Planning Agent │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Brand Agent   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Implementation  │
│     Agent       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Image Agent    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Code Review     │
│     Agent       │
└────────┬────────┘
         │
         ▼
      Website
```

---

## User Input

The user provides a prompt with business details:

```
Create a website for my physiotherapy practice in JHB South.

Business: [name]
Phone: [phone]
Address: [address]
Services: [list of services]
Reviews: [customer testimonials]
FAQs: [common questions and answers]
```

---

## Agent Specifications

### 1. Planning Agent

**Purpose:** Analyze user input and create implementation plan

**Input:**
- User prompt with business details
- Template structure (sections, data files, pages)

**Process:**
1. Review available sections in `components/sections/`
2. Review data file structure in `lib/data/`
3. Map user input to data files
4. Decide which pages to create
5. Decide which sections to use on each page
6. Identify any custom sections needed

**Output:** Implementation plan document
```markdown
## Pages to Create
- Home: Hero, FeaturedServices, About, Testimonials, FAQ, CTA
- Services: ServicesGrid
- Service Detail: [for each service]

## Data Mapping
- business-info.ts: name, phone, address, hours
- services.ts: [mapped services]
- testimonials.ts: [mapped reviews]
- faqs.ts: [mapped FAQs]

## Custom Work Needed
- [any sections that need modification]
```

**Skills Used:** None (analysis only)

---

### 2. Brand Agent

**Purpose:** Establish visual identity and design tokens

**Input:**
- Business type (e.g., physiotherapy, restaurant, law firm)
- Location/market
- Any user style preferences
- Industry conventions

**Process:**
1. Analyze business type for appropriate aesthetic
2. Generate color palette (OKLCH format)
3. Select typography approach
4. Set design tokens (border-radius, shadows)

**Output:** Updated design system
- Modified `app/globals.css` with new color variables
- Typography recommendations
- Design token values

**Example Output for Physiotherapy:**
```css
/* Calming, professional palette */
--primary: oklch(0.55 0.15 220);      /* Healing blue */
--secondary: oklch(0.75 0.08 160);    /* Soft teal */
--accent: oklch(0.65 0.12 145);       /* Fresh green */
--background: oklch(0.99 0.005 220);  /* Warm white */
```

**Skills Used:** None (design decisions)

---

### 3. Implementation Agent

**Purpose:** Build the website by updating data and components

**Input:**
- Implementation plan from Planning Agent
- Brand tokens from Brand Agent
- User's business details

**Process:**
1. Update `lib/data/business-info.ts` with business details
2. Update `lib/data/services.ts` with services
3. Update `lib/data/testimonials.ts` with reviews
4. Update `lib/data/faqs.ts` with FAQs
5. Modify section content as needed
6. Create/update pages
7. Ensure all sections use correct data

**Output:** Working website code

**Image Handling:**
- Use Unsplash images for placeholders
- Format: `https://images.unsplash.com/photo-[id]?w=800&h=600&fit=crop`
- Select images appropriate to business type
- Add to `next.config.ts` remotePatterns if needed

**Skills Used:**
- `frontend-design` - For layout and UI decisions

**Important Notes:**
- Always use Next.js `<Image>` component
- Keep placeholder text clearly identifiable if user didn't provide content
- Ensure all links work (services → service detail pages)

---

### 4. Image Agent

**Purpose:** Generate or source custom images for the website

**Input:**
- Business type and details
- Pages/sections that need images
- Brand colors for consistency

**Process:**
1. Identify image needs (hero, services, team, gallery)
2. Generate images using AI image generation OR
3. Source from stock libraries (Unsplash, Pexels)
4. Ensure images match brand aesthetic
5. Optimize for web (appropriate dimensions)

**Output:**
- Image files in `public/images/`
- Or URLs for remote images
- Updated `next.config.ts` if needed for remote domains

**Image Requirements:**
| Location | Dimensions | Notes |
|----------|------------|-------|
| Hero | 1200x800 | Main visual |
| Services | 600x400 | Card thumbnails |
| Team | 400x400 | Square headshots |
| Gallery | Various | Maintain aspect ratio |
| OG Image | 1200x630 | Social sharing |

---

### 5. Code Review Agent

**Purpose:** Validate implementation against best practices

**Input:**
- All code changes from Implementation Agent
- Generated/sourced images from Image Agent

**Checks:**

#### React/Next.js Best Practices
- Uses skill: `vercel-react-best-practices`
- Server Components by default
- Proper use of `"use client"`
- Correct async/await patterns for Next.js 16
- No unnecessary re-renders

#### Web Design Guidelines
- Uses skill: `web-design-guidelines`
- Consistent spacing
- Responsive design
- Typography hierarchy
- Color contrast

#### SEO Validation
- All pages have metadata
- JSON-LD schemas present and valid
- Images have alt text
- Semantic HTML structure
- Sitemap includes all pages

#### Accessibility (a11y)
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation works
- Focus states visible
- Color contrast ratios (WCAG AA)
- Form labels present

#### TypeScript
- No type errors
- Proper typing for props
- No `any` types

**Output:**
- Approval if all checks pass
- List of issues with file:line references if not

**Example Output:**
```markdown
## Code Review Results

### Passed
- [x] React best practices
- [x] TypeScript types
- [x] JSON-LD schemas

### Issues Found
1. `components/sections/hero/HeroWithImage.tsx:45`
   - Missing alt text on Image component

2. `app/services/page.tsx:12`
   - Missing page metadata export

### Recommendations
- Consider adding loading states for service cards
```

---

## Agent Coordination

### Execution Order
1. **Planning Agent** runs first
2. **Brand Agent** runs second (needs business type from planning)
3. **Implementation Agent** runs third (needs plan + brand)
4. **Image Agent** runs fourth (needs implementation context)
5. **Code Review Agent** runs last (validates everything)

### Iteration Loop
If Code Review Agent finds issues:
1. Issues sent back to Implementation Agent
2. Implementation Agent fixes issues
3. Code Review Agent re-validates
4. Loop until approved (max 3 iterations)

### Human Checkpoints (Optional)
- After Planning: User approves page structure
- After Brand: User approves color palette
- After Implementation: User previews site
- After Code Review: Final approval

---

## Skills Reference

| Skill | Used By | Purpose |
|-------|---------|---------|
| `frontend-design` | Implementation Agent | UI/layout decisions |
| `vercel-react-best-practices` | Code Review Agent | React/Next.js validation |
| `web-design-guidelines` | Code Review Agent | Design validation |

---

## Data Flow

```
User Input
    │
    ├─► business-info.ts ─► Navbar, Footer, JSON-LD, LocationSection
    │
    ├─► services.ts ─► FeaturedServices, ServicesGrid, ServiceCard, /services/[slug]
    │
    ├─► testimonials.ts ─► TestimonialsSection (+ Review JSON-LD)
    │
    ├─► faqs.ts ─► FAQSection (+ FAQPage JSON-LD)
    │
    └─► Brand tokens ─► globals.css ─► All components
```

---

## Future Considerations

### Content Agent (Potential)
- Generate compelling copy from bullet points
- Expand short descriptions into full content
- Match tone to business type

### Analytics Agent (Potential)
- Set up tracking (Plausible, Fathom, GA4)
- Configure conversion goals
- Add event tracking

### Performance Agent (Potential)
- Run Lighthouse audits
- Optimize images
- Analyze bundle size
- Suggest improvements
