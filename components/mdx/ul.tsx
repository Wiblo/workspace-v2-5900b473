interface ULProps {
  children: React.ReactNode
}

export function UL({ children }: ULProps) {
  return <ul className="my-5 list-disc list-inside space-y-1">{children}</ul>
}
