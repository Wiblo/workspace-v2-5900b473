# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
bun dev          # Start development server at http://localhost:3000
bun build        # Production build
bun start        # Start production server
bun lint         # Run ESLint
```

## Architecture

This is a Next.js 16 application using the App Router with React 19, TypeScript, and Tailwind CSS v4.

### Key Directories

- `app/` - Next.js App Router pages and layouts
- `components/ui/` - shadcn/ui components (new-york style)
- `lib/utils.ts` - Utility functions including the `cn()` class name merger
- `hooks/` - Custom React hooks

### UI System

The project uses shadcn/ui with the "new-york" style variant. Components are installed to `components/ui/` and configured via `components.json`. Add new components with:

```bash
bunx shadcn@latest add <component-name>
```

### Styling

- Tailwind CSS v4 with CSS variables for theming
- Theme colors defined in `app/globals.css` using OKLCH color space
- Dark mode supported via `.dark` class
- Use `cn()` from `@/lib/utils` to merge class names

### Path Aliases

The `@/*` alias maps to the project root, configured in `tsconfig.json`.
