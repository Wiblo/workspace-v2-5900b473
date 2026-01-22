interface OLProps {
  children: React.ReactNode
}

export function OL({ children }: OLProps) {
  return <ol className="my-5 list-decimal list-inside space-y-1">{children}</ol>
}
