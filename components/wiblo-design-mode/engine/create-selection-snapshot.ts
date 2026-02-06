import type {
  ElementStyles,
  ReactSelectionContext,
  SelectionConfidence,
  SelectionMode,
  SelectionSnapshot,
} from "@/components/wiblo-design-mode/protocol"
import { createElementBounds } from "./create-element-bounds"

const STYLE_PROPERTIES: Array<keyof ElementStyles> = [
  "fontFamily",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "textAlign",
  "color",
  "backgroundColor",
  "backgroundImage",
  "padding",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "margin",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "display",
  "position",
  "flexDirection",
  "justifyContent",
  "alignItems",
  "gap",
  "opacity",
  "borderRadius",
  "borderWidth",
  "borderColor",
  "borderStyle",
  "width",
  "height",
  "minWidth",
  "maxWidth",
  "minHeight",
  "maxHeight",
]

const domIdFallbacks = new WeakMap<Element, string>()

const randomId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }

  return Math.random().toString(36).slice(2, 10)
}

const getDomId = (element: Element): string => {
  if (element instanceof HTMLElement) {
    if (!element.dataset.wibloDomId) {
      element.dataset.wibloDomId = `wiblo-${randomId()}`
    }

    return element.dataset.wibloDomId
  }

  const existing = domIdFallbacks.get(element)
  if (existing) return existing

  const nextId = `wiblo-${randomId()}`
  domIdFallbacks.set(element, nextId)
  return nextId
}

const getElementClassName = (element: Element): string => {
  if (element instanceof HTMLElement && typeof element.className === "string") {
    return element.className
  }

  return element.getAttribute("class") ?? ""
}

const generateSelector = (element: Element): string => {
  const path: string[] = []
  let current: Element | null = element

  while (current && current !== document.documentElement && current !== document.body) {
    let selectorPart = current.tagName.toLowerCase()

    if (current instanceof HTMLElement && current.id) {
      selectorPart = `#${current.id}`
      path.unshift(selectorPart)
      break
    }

    const className = getElementClassName(current)
    if (className) {
      const classes = className.split(/\s+/).filter(Boolean).slice(0, 2)
      if (classes.length > 0) {
        selectorPart += `.${classes.join(".")}`
      }
    }

    const parent = current.parentElement
    if (parent) {
      const sameTagSiblings = Array.from(parent.children).filter(
        (child) => child.tagName === current!.tagName
      )

      if (sameTagSiblings.length > 1) {
        const index = sameTagSiblings.indexOf(current as Element) + 1
        selectorPart += `:nth-of-type(${index})`
      }
    }

    path.unshift(selectorPart)
    current = current.parentElement
  }

  return path.join(" > ")
}

const getParentPath = (element: Element): string[] => {
  const path: string[] = []
  let current: Element | null = element

  while (current && current !== document.documentElement && current !== document.body) {
    path.unshift(current.tagName.toLowerCase())
    current = current.parentElement
  }

  return path
}

const getAttributes = (element: Element): Record<string, string> => {
  const attributes: Record<string, string> = {}

  for (const attribute of Array.from(element.attributes)) {
    if (attribute.name.startsWith("data-wiblo")) continue
    attributes[attribute.name] = attribute.value
  }

  return attributes
}

const getTextContent = (element: Element): string | null => {
  const firstChild = element.childNodes[0]
  const hasOnlyText = element.childNodes.length === 1 && firstChild?.nodeType === Node.TEXT_NODE
  if (!hasOnlyText) return null

  const text = element.textContent?.trim() ?? ""
  return text ? text.slice(0, 250) : null
}

const getStyles = (element: Element): ElementStyles => {
  const computedStyle = window.getComputedStyle(element)
  const styles = {} as ElementStyles

  for (const property of STYLE_PROPERTIES) {
    const cssProperty = property.replace(/[A-Z]/g, (value) => `-${value.toLowerCase()}`)
    styles[property] = computedStyle.getPropertyValue(cssProperty)
  }

  return styles
}

const inferConfidence = (element: Element): SelectionConfidence => {
  const rect = element.getBoundingClientRect()

  if (rect.width <= 2 || rect.height <= 2) {
    return "low"
  }

  if (rect.width <= 8 || rect.height <= 8) {
    return "medium"
  }

  return "high"
}

export const createSelectionSnapshot = (
  element: Element,
  selectionMode: SelectionMode,
  reactContext?: ReactSelectionContext | null
): SelectionSnapshot => {
  const rect = element.getBoundingClientRect()

  const snapshot: SelectionSnapshot = {
    selector: generateSelector(element),
    domId: getDomId(element),
    tagName: element.tagName.toLowerCase(),
    className: getElementClassName(element),
    id: element instanceof HTMLElement ? element.id || null : null,
    textContent: getTextContent(element),
    attributes: getAttributes(element),
    parentPath: getParentPath(element),
    rect: {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      right: rect.right,
      bottom: rect.bottom,
    },
    bounds: createElementBounds(element),
    styles: getStyles(element),
    confidence: inferConfidence(element),
    selectionMode,
  }

  if (reactContext) {
    snapshot.reactContext = reactContext
  }

  return snapshot
}
