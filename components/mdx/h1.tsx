import { withHeadingId } from "./utils"

interface H1Props {
  children: React.ReactNode
}

export function H1({ children }: H1Props) {
  return (
    <h1 className="group font-bold text-3xl my-8 relative">
      {withHeadingId(children)}
    </h1>
  )
}
