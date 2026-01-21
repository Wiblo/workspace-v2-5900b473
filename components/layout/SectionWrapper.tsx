import { cn } from "@/lib/utils"

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  /** HTML element to render. Defaults to 'section' */
  as?: "section" | "div" | "article" | "main"
}

/**
 * SectionWrapper provides consistent vertical spacing between page sections.
 * Use this to wrap all major page sections for uniform spacing.
 *
 * @example
 * <SectionWrapper>
 *   <Container>
 *     <h2>Section Title</h2>
 *   </Container>
 * </SectionWrapper>
 *
 * @example
 * // With custom element
 * <SectionWrapper as="article" className="bg-secondary/10">
 *   <Container>...</Container>
 * </SectionWrapper>
 */
export function SectionWrapper({
  children,
  className,
  as: Component = "section",
}: SectionWrapperProps) {
  return (
    <Component className={cn("py-16 md:py-24", className)}>{children}</Component>
  )
}
