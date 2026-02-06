import { clearElementPositionCache } from "./get-element-at-position"
import { invalidateElementBoundsCache } from "./create-element-bounds"
import { clearSelectableVisibilityCache } from "./is-valid-selectable-element"

export const invalidateSelectionCaches = (): void => {
  clearElementPositionCache()
  invalidateElementBoundsCache()
  clearSelectableVisibilityCache()
}

export const attachSelectionCacheInvalidation = (
  onInvalidate?: () => void
): (() => void) => {
  let frame = 0

  const handleInvalidate = () => {
    if (frame) return

    frame = window.requestAnimationFrame(() => {
      frame = 0
      invalidateSelectionCaches()
      onInvalidate?.()
    })
  }

  const mutationObserver = new MutationObserver(handleInvalidate)
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  })

  window.addEventListener("scroll", handleInvalidate, true)
  window.addEventListener("resize", handleInvalidate)

  return () => {
    if (frame) {
      window.cancelAnimationFrame(frame)
      frame = 0
    }

    mutationObserver.disconnect()
    window.removeEventListener("scroll", handleInvalidate, true)
    window.removeEventListener("resize", handleInvalidate)
  }
}
