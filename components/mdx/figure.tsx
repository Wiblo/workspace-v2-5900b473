interface FigureProps {
  wide?: boolean
  children: React.ReactNode
}

/**
 * Figure container with optional full-width mode
 *
 * Usage in MDX:
 * <Figure>
 *   <Image src="/image.jpg" alt="Caption" />
 * </Figure>
 *
 * <Figure wide>
 *   <Image src="/wide-image.jpg" alt="Full width image" />
 * </Figure>
 */
export function Figure({ wide = false, children }: FigureProps) {
  return (
    <div
      className={`
        text-center
        ${
          wide
            ? `
              bg-muted
              relative left-[50%] right-[50%]
              ml-[-50vw] mr-[-50vw]
              w-[100vw]
            `
            : ""
        }
      `}
    >
      <div className={wide ? "max-w-2xl mx-auto px-6" : ""}>{children}</div>
    </div>
  )
}
