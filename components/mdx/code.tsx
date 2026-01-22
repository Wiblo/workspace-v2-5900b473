interface CodeProps {
  children: React.ReactNode
}

export function Code({ children }: CodeProps) {
  return (
    <code className="[p_&]:px-1.5 [p_&]:py-0.5 [p_&]:bg-muted [p_&]:rounded [p_&]:text-sm font-mono">
      {children}
    </code>
  )
}
