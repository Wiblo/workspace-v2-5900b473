import { createStyleElement } from "./create-style-element"

let overrideStyle: HTMLStyleElement | null = null

export const enablePointerEventsOverride = (): void => {
  if (overrideStyle) return

  overrideStyle = createStyleElement(
    "data-wiblo-design-pointer-override",
    "* { pointer-events: auto !important; }"
  )
}

export const disablePointerEventsOverride = (): void => {
  overrideStyle?.remove()
  overrideStyle = null
}
