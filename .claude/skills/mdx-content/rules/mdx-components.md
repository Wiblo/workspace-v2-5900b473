# MDX Components Reference

All MDX components are pre-installed at `/components/mdx/`. This document explains how to use them.

## Component Registry

The `mdx-components.ts` file at the project root maps components to MDX. It's already configured.

## Typography Components

### Smart Links (`a.tsx`)

Automatically handles link types:

```mdx
[Internal link](/about)           <!-- Uses Next.js Link -->
[External link](https://example.com)  <!-- Opens in new tab -->
[Anchor link](#section)           <!-- Same-page scroll -->
```

### Headings with Anchors (`h1.tsx`, `h2.tsx`, `h3.tsx`)

Add `[#anchor-id]` to create linkable sections:

```mdx
## Treatment Options [#treatment]

Users can link directly to #treatment
```

### Lists and Text

Standard markdown works automatically:

```mdx
- Bullet point
- Another point

1. Numbered item
2. Another item

**Bold text** and *italic text*
```

## Block Components

### Callout

Highlighted information box:

```mdx
<Callout emoji="💡">
  Most back pain improves within a few weeks with proper care.
</Callout>

<Callout emoji="⚠️">
  Seek immediate care if you experience numbness or weakness.
</Callout>
```

**Props:**
- `emoji` - Icon to display (optional)
- `children` - Content inside the callout

### Figure

Container for images, optionally full-width:

```mdx
<Figure>
  <Image src="/image.jpg" alt="Caption" />
</Figure>

<Figure wide>
  <Image src="/wide-image.jpg" alt="Full width image" />
</Figure>
```

### Snippet (Code Blocks)

Code blocks are automatically styled:

````mdx
```javascript
const greeting = "Hello, world!"
```
````

## Media Components

### Image

Auto-computes dimensions and supports size scaling:

```mdx
![Image caption](/images/photo.jpg)

![Smaller image [50%]](/images/diagram.png)
```

**Features:**
- Auto-computes width/height for local and remote images
- Parses `[50%]` syntax to scale images
- Shows caption from alt text

### YouTube

Embed YouTube videos:

```mdx
<YouTube id="dQw4w9WgXcQ" />

<YouTube id="dQw4w9WgXcQ" caption="Video explanation" />
```

### Tweet

Embed tweets with Suspense loading:

```mdx
<Tweet id="1234567890" />

<Tweet id="1234567890" caption="Interesting perspective" />
```

## Tables

Standard markdown tables work:

```mdx
| Treatment | Duration | Recommended For |
|-----------|----------|-----------------|
| Adjustment | 30 min | Back pain |
| Massage | 60 min | Muscle tension |
```

## Footnotes

Reference system for citations:

```mdx
Studies show chiropractic care is effective<Ref id="1" /> for back pain.

Regular adjustments can prevent<Ref id="2" /> recurring issues.

<FootNotes>
  <FootNote id="1">Smith et al., "Chiropractic Effectiveness," 2024.</FootNote>
  <FootNote id="2">Johnson, "Preventive Care Study," 2023.</FootNote>
</FootNotes>
```

## File Structure

```
components/mdx/
├── index.ts        # Exports all components
├── utils.tsx       # withHeadingId utility
├── a.tsx           # Smart links
├── h1.tsx          # Heading 1
├── h2.tsx          # Heading 2
├── h3.tsx          # Heading 3
├── p.tsx           # Paragraphs
├── ol.tsx          # Ordered lists
├── ul.tsx          # Unordered lists
├── li.tsx          # List items
├── hr.tsx          # Horizontal rule
├── code.tsx        # Inline code
├── blockquote.tsx  # Blockquotes
├── callout.tsx     # Callout boxes
├── caption.tsx     # Image captions
├── figure.tsx      # Figure container
├── snippet.tsx     # Code blocks
├── image.tsx       # Auto-sizing images
├── youtube.tsx     # YouTube embeds
├── tweet.tsx       # Tweet embeds
├── table.tsx       # Table components
└── footnotes.tsx   # Footnote system
```

## Customization

To modify a component's styling, edit the corresponding file in `/components/mdx/`.

All components use the project's design tokens:
- `text-foreground` / `text-muted-foreground`
- `bg-muted` / `bg-background`
- `border-border` / `border-primary`

This ensures consistency with the rest of the site.
