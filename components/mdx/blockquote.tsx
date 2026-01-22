interface BlockquoteProps {
  children: React.ReactNode
}

export function Blockquote({ children }: BlockquoteProps) {
  return (
    <blockquote className="border-l-4 border-primary pl-4 my-6 italic text-muted-foreground">
      {children}
    </blockquote>
  )
}
