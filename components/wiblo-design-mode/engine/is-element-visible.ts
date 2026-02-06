export const isElementVisible = (
  element: Element,
  computedStyle: CSSStyleDeclaration = window.getComputedStyle(element)
): boolean => {
  if (!(element instanceof HTMLElement)) {
    return (
      computedStyle.display !== "none" &&
      computedStyle.visibility !== "hidden" &&
      computedStyle.opacity !== "0"
    )
  }

  return (
    computedStyle.display !== "none" &&
    computedStyle.visibility !== "hidden" &&
    computedStyle.opacity !== "0" &&
    !element.hasAttribute("hidden")
  )
}
