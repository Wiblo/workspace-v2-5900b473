interface TableProps {
  children: React.ReactNode
}

export function Table({ children }: TableProps) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="min-w-full divide-y divide-border">{children}</table>
    </div>
  )
}

export function THead({ children }: TableProps) {
  return <thead className="bg-muted">{children}</thead>
}

export function TBody({ children }: TableProps) {
  return (
    <tbody className="bg-background divide-y divide-border">{children}</tbody>
  )
}

export function TR({ children }: TableProps) {
  return <tr>{children}</tr>
}

export function TH({ children }: TableProps) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
      {children}
    </th>
  )
}

export function TD({ children }: TableProps) {
  return <td className="px-6 py-4 text-sm text-foreground">{children}</td>
}
