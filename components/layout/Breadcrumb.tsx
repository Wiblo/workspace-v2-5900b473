import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  name: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

/**
 * Breadcrumb navigation component
 * Shows hierarchical navigation path
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-2 text-sm", className)}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={index} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              >
                {item.name}
              </Link>
            ) : (
              <span
                className={cn(
                  isLast ? "text-foreground font-medium" : "text-muted-foreground"
                )}
                {...(isLast ? { "aria-current": "page" } : {})}
              >
                {item.name}
              </span>
            )}

            {!isLast && (
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
            )}
          </div>
        )
      })}
    </nav>
  )
}
