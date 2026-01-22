interface LIProps {
  children: React.ReactNode
}

export function LI({ children }: LIProps) {
  return <li className="my-1">{children}</li>
}
