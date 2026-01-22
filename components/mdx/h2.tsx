import { withHeadingId } from "./utils"

interface H2Props {
  children: React.ReactNode
}

export function H2({ children }: H2Props) {
  return (
    <h2 className="group font-bold text-xl my-8 relative">
      {withHeadingId(children)}
    </h2>
  )
}
