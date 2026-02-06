export const createStyleElement = (
  attribute: string,
  content: string
): HTMLStyleElement => {
  const style = document.createElement("style")
  style.setAttribute(attribute, "")
  style.textContent = content
  document.head.appendChild(style)
  return style
}
