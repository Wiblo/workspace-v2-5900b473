import { Caption } from "./caption"

interface SnippetProps {
  children: React.ReactNode
  scroll?: boolean
  caption?: string | null
}

/**
 * Code block with optional caption and scroll control
 *
 * Automatically used for ```code blocks``` in MDX via the `pre` mapping
 */
export function Snippet({ children, scroll = true, caption = null }: SnippetProps) {
  return (
    <div className="my-6">
      <pre
        className={`
          p-4 text-sm rounded-lg
          bg-muted text-foreground
          ${scroll ? "overflow-x-auto" : "whitespace-pre-wrap break-all overflow-hidden"}
        `}
      >
        <code>{children}</code>
      </pre>

      {caption != null && <Caption>{caption}</Caption>}
    </div>
  )
}
