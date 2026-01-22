import Balancer from "react-wrap-balancer"
import type { ReactNode } from "react"

interface CaptionProps {
  children: ReactNode
}

/**
 * Balanced text caption for images and figures
 */
export function Caption({ children }: CaptionProps) {
  return (
    <span className="block w-full text-xs my-3 font-mono text-muted-foreground text-center leading-normal">
      <Balancer>
        <span className="[&>a]:border-b [&>a]:border-border">{children}</span>
      </Balancer>
    </span>
  )
}
