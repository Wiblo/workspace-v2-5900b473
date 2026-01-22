import { A } from "./a"
import { P } from "./p"

interface FootNotesProps {
  children: React.ReactNode
}

interface RefProps {
  id: string | number
}

interface FootNoteProps {
  id: string | number
  children: React.ReactNode
}

/**
 * Footnotes container - renders a separator line before footnotes
 *
 * Usage in MDX:
 * <FootNotes>
 *   <FootNote id="1">First footnote content</FootNote>
 *   <FootNote id="2">Second footnote content</FootNote>
 * </FootNotes>
 */
export function FootNotes({ children }: FootNotesProps) {
  return (
    <div className="text-base before:w-[200px] before:m-auto before:content-[''] before:border-t before:border-border before:block before:my-10">
      {children}
    </div>
  )
}

/**
 * Inline footnote reference
 *
 * Usage in MDX:
 * This is a statement that needs a citation<Ref id="1" />.
 */
export function Ref({ id }: RefProps) {
  return (
    <a
      href={`#f${id}`}
      id={`s${id}`}
      className="relative text-xs top-[-5px] no-underline text-primary"
    >
      [{id}]
    </a>
  )
}

/**
 * Footnote content with back-link
 *
 * Usage in MDX:
 * <FootNote id="1">
 *   Smith et al., "Research Paper Title," Journal Name, 2024.
 * </FootNote>
 */
export function FootNote({ id, children }: FootNoteProps) {
  return (
    <P>
      {id}.{" "}
      <A href={`#s${id}`} id={`f${id}`} className="no-underline">
        ^
      </A>{" "}
      {children}
    </P>
  )
}
