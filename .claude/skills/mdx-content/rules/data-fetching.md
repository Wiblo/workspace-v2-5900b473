# Data Fetching Helper

The data fetching helper reads the content manifest and provides typed access to content metadata.

## Basic Implementation

```typescript
// app/get-blog.ts
import contentData from "./blog.json"

export type Post = {
  id: string
  date: string
  title: string
}

export const getPosts = async (): Promise<Post[]> => {
  return contentData.posts
}

export const getPostById = async (id: string): Promise<Post | undefined> => {
  return contentData.posts.find(post => post.id === id)
}
```

## Helper Functions

### Get Single Post

```typescript
export const getPostById = async (id: string): Promise<Post | undefined> => {
  const posts = await getPosts()
  return posts.find(post => post.id === id)
}
```

### Get Featured Posts

```typescript
export const getFeaturedPosts = async (): Promise<Post[]> => {
  const posts = await getPosts()
  return posts.filter(post => post.featured)
}
```

### Get Posts by Category

```typescript
export const getPostsByCategory = async (category: string): Promise<Post[]> => {
  const posts = await getPosts()
  return posts.filter(post => post.category === category)
}
```

### Get All Post IDs (for generateStaticParams)

```typescript
export const getAllPostIds = async (): Promise<string[]> => {
  const posts = await getPosts()
  return posts.map(post => post.id)
}
```

## For Conditions/Treatments

Same pattern, different naming:

```typescript
// app/get-conditions.ts
import conditionsData from "./conditions.json"

export type Condition = {
  id: string
  date: string
  title: string
  description?: string
}

export const getConditions = async (): Promise<Condition[]> => {
  return conditionsData.conditions
}

export const getConditionById = async (id: string): Promise<Condition | undefined> => {
  const conditions = await getConditions()
  return conditions.find(c => c.id === id)
}
```

## Usage in Pages

### Listing Page

```typescript
// app/blog/page.tsx
import { getPosts } from '../get-blog'

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <main>
      <h1>Blog</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <a href={`/blog/${post.id}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </main>
  )
}
```

### Static Generation

```typescript
// app/blog/[slug]/page.tsx
import { getPosts } from '@/app/get-blog'

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map(post => ({ slug: post.id }))
}
```

## Performance Notes

1. **JSON import is fast**: Static JSON parsed once at build time
2. **No per-post fetching**: Avoid fetching metadata from each MDX file
3. **Single source of truth**: Manifest contains all listing metadata
