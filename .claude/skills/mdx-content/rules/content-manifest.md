# Content Manifest Pattern

The content manifest is a JSON file that lists all content items with their metadata. This avoids parsing every MDX file just to list content.

## Why Use a Manifest?

1. **Performance**: Listing posts doesn't require parsing every MDX file
2. **Simplicity**: Single source of truth for content metadata
3. **Flexibility**: Can add computed fields (views) without touching MDX files
4. **Build optimization**: MDX files only parsed when their page is visited

## Structure

```json
// app/posts.json (or conditions.json, treatments.json)
{
  "posts": [
    {
      "id": "understanding-back-pain",
      "date": "Jan 15, 2026",
      "title": "Understanding Back Pain: Causes and Solutions"
    },
    {
      "id": "chiropractic-benefits",
      "date": "Jan 10, 2026",
      "title": "5 Benefits of Regular Chiropractic Care"
    },
    {
      "id": "posture-tips",
      "date": "Jan 5, 2026",
      "title": "Improve Your Posture: A Complete Guide"
    }
  ]
}
```

## Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | URL slug, must match the folder name in `app/(content)/` |
| `date` | string | Yes | Human-readable date (e.g., "Jan 15, 2026") |
| `title` | string | Yes | Display title for listings |
| `category` | string | No | For filtering (e.g., "wellness", "treatment") |
| `featured` | boolean | No | Highlight on homepage |

## Example Manifests

### Blog Posts

```json
// app/posts.json
{
  "posts": [
    {
      "id": "winter-wellness-tips",
      "date": "Jan 20, 2026",
      "title": "Winter Wellness: Staying Healthy in Cold Weather",
      "category": "wellness"
    },
    {
      "id": "back-pain-causes",
      "date": "Jan 15, 2026",
      "title": "Common Causes of Back Pain",
      "category": "education",
      "featured": true
    }
  ]
}
```

### Conditions Pages

```json
// app/conditions.json
{
  "conditions": [
    {
      "id": "back-pain",
      "date": "Jan 1, 2026",
      "title": "Back Pain",
      "description": "Understanding and treating back pain"
    },
    {
      "id": "sciatica",
      "date": "Jan 1, 2026",
      "title": "Sciatica",
      "description": "Causes, symptoms, and treatment for sciatica"
    },
    {
      "id": "neck-pain",
      "date": "Jan 1, 2026",
      "title": "Neck Pain",
      "description": "Relief for chronic and acute neck pain"
    }
  ]
}
```

### Treatments

```json
// app/treatments.json
{
  "treatments": [
    {
      "id": "spinal-adjustment",
      "date": "Jan 1, 2026",
      "title": "Spinal Adjustment",
      "shortDescription": "Manual spinal manipulation for pain relief"
    },
    {
      "id": "decompression-therapy",
      "date": "Jan 1, 2026",
      "title": "Spinal Decompression",
      "shortDescription": "Non-surgical treatment for disc problems"
    }
  ]
}
```

## Ordering

Items should be ordered by date (newest first). The data fetching helper preserves this order:

```json
{
  "posts": [
    { "id": "newest-post", "date": "Jan 20, 2026", "title": "..." },
    { "id": "older-post", "date": "Jan 15, 2026", "title": "..." },
    { "id": "oldest-post", "date": "Jan 10, 2026", "title": "..." }
  ]
}
```

## Correspondence with MDX Files

Each manifest entry must have a corresponding MDX file:

```
Manifest entry:     { "id": "back-pain", "date": "Jan 15, 2026", ... }
                            ↓
MDX file path:      app/(content)/2026/back-pain/page.mdx
                    OR app/(content)/back-pain/page.mdx
```

The `id` field becomes the URL slug.

## Adding New Content

When creating a new post:

1. Create the MDX file: `app/(content)/[year]/[id]/page.mdx`
2. Add entry to manifest (at the TOP for newest first):

```json
{
  "posts": [
    {
      "id": "new-post-slug",
      "date": "Jan 25, 2026",
      "title": "My New Post Title"
    },
    // ... existing posts
  ]
}
```

## TypeScript Type

Define the type for type safety:

```typescript
// app/get-posts.ts
export type Post = {
  id: string
  date: string
  title: string
  category?: string
  featured?: boolean
  views?: number
  viewsFormatted?: string
}
```
