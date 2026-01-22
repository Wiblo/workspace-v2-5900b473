import { withHeadingId } from "./utils"

interface H3Props {
  children: React.ReactNode
}

export function H3({ children }: H3Props) {
  return (
    <h3 className="group font-semibold text-lg my-6 relative">
      {withHeadingId(children)}
    </h3>
  )
}
