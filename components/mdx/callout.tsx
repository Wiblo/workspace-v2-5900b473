interface CalloutProps {
  emoji?: string | null
  text?: string | null
  children?: React.ReactNode
}

/**
 * Highlighted callout box for important information
 *
 * Usage in MDX:
 * <Callout emoji="💡">This is important info</Callout>
 * <Callout emoji="⚠️" text="Warning message here" />
 */
export function Callout({ emoji = null, text = null, children }: CalloutProps) {
  return (
    <div className="bg-muted text-foreground flex items-start p-4 my-6 text-base rounded-lg">
      {emoji && (
        <span className="block w-6 text-center mr-3 scale-[1.2]">{emoji}</span>
      )}
      <span className="block grow">{text ?? children}</span>
    </div>
  )
}
