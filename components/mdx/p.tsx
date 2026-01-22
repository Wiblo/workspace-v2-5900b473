interface PProps {
  children: React.ReactNode
}

export function P({ children }: PProps) {
  return <p className="my-5 leading-7 [blockquote_&]:my-2">{children}</p>
}
