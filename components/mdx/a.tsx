import Link from "next/link"

interface AProps {
  children: React.ReactNode
  className?: string
  href: string
  [key: string]: unknown
}

/**
 * Smart link component that handles internal, external, and anchor links
 */
export function A({ children, className = "", href, ...props }: AProps) {
  const baseStyles = `
    border-b border-border text-foreground/80
    transition-[border-color] hover:border-foreground
  `

  // Anchor link (same page)
  if (href[0] === "#") {
    return (
      <a href={href} className={`${baseStyles} ${className}`} {...props}>
        {children}
      </a>
    )
  }

  // Internal link - use Next.js Link for prefetching
  if (href[0] === "/") {
    return (
      <Link href={href} className={`${baseStyles} ${className}`} {...props}>
        {children}
      </Link>
    )
  }

  // External link - open in new tab
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${className}`}
      {...props}
    >
      {children}
    </a>
  )
}
