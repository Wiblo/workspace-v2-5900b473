import type { MDXComponents } from "mdx/types"

// Typography
import { A } from "@/components/mdx/a"
import { H1 } from "@/components/mdx/h1"
import { H2 } from "@/components/mdx/h2"
import { H3 } from "@/components/mdx/h3"
import { P } from "@/components/mdx/p"
import { OL } from "@/components/mdx/ol"
import { UL } from "@/components/mdx/ul"
import { LI } from "@/components/mdx/li"
import { HR } from "@/components/mdx/hr"
import { Code } from "@/components/mdx/code"
import { Blockquote } from "@/components/mdx/blockquote"

// Blocks
import { Callout } from "@/components/mdx/callout"
import { Caption } from "@/components/mdx/caption"
import { Figure } from "@/components/mdx/figure"
import { Snippet } from "@/components/mdx/snippet"

// Media
import { Image } from "@/components/mdx/image"
import { YouTubeEmbed } from "@/components/mdx/youtube"
import { Tweet } from "@/components/mdx/tweet"

// Tables
import { Table, THead, TBody, TR, TH, TD } from "@/components/mdx/table"

// Footnotes
import { FootNotes, Ref, FootNote } from "@/components/mdx/footnotes"

/**
 * MDX component registry
 *
 * This file maps HTML elements and custom components for use in MDX files.
 * All MDX files in the project will automatically use these components.
 *
 * HTML elements (lowercase) are automatically applied to markdown syntax:
 * - # Heading -> <h1>
 * - **bold** -> <strong>
 * - [link](url) -> <a>
 * - ```code``` -> <pre>
 *
 * Custom components (PascalCase) are used directly in MDX:
 * - <Callout emoji="💡">Info</Callout>
 * - <Tweet id="123456" />
 * - <YouTube id="abc123" />
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,

    // HTML element overrides (lowercase - applied to markdown syntax)
    a: A,
    h1: H1,
    h2: H2,
    h3: H3,
    p: P,
    ol: OL,
    ul: UL,
    li: LI,
    hr: HR,
    code: Code,
    pre: Snippet,
    img: Image,
    blockquote: Blockquote,
    table: Table,
    thead: THead,
    tbody: TBody,
    tr: TR,
    th: TH,
    td: TD,

    // Custom components (PascalCase - used directly in MDX)
    Image,
    Figure,
    Snippet,
    Caption,
    Callout,
    YouTube: YouTubeEmbed,
    Tweet,
    Ref,
    FootNotes,
    FootNote,
  }
}
