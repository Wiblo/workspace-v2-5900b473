import { Children } from "react"

/**
 * Parses heading text for anchor ID syntax: "Heading Text [#anchor-id]"
 * Creates a linkable anchor with hover indicator
 */
export function withHeadingId(children: React.ReactNode) {
  return Children.map(children, (el) => {
    if (typeof el === "string") {
      const re = /\[#([^\]]+)\]\s*$/m
      const match = el.match(re)

      if (match && match[1]?.length) {
        return (
          <span className="relative">
            {/* Hover link indicator */}
            <a
              className={`
                absolute px-3 -left-[2rem]
                invisible [span:hover_&]:visible
                font-mono font-normal
                text-muted-foreground hover:text-foreground
                transition-colors
              `}
              href={`#${match[1]}`}
            >
              #
            </a>

            {/* Anchor target (offset for fixed header) */}
            <a id={match[1]} className="absolute -top-[80px]" />

            {/* Heading text (without the [#id] part) */}
            {el.substring(0, match.index)}
          </span>
        )
      }
    }

    return el
  })
}
