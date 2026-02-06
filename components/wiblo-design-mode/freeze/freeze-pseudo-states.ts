// Adapted from react-grab (MIT) for phase-3 selection freeze behavior.
import { clearElementPositionCache } from "@/components/wiblo-design-mode/engine/get-element-at-position"
import {
  disablePointerEventsOverride,
  enablePointerEventsOverride,
} from "@/components/wiblo-design-mode/engine/pointer-events-override"
import { createStyleElement } from "@/components/wiblo-design-mode/engine/create-style-element"

const POINTER_EVENTS_STYLES = "* { pointer-events: none !important; }"

const MOUSE_EVENTS_TO_BLOCK = [
  "mouseenter",
  "mouseleave",
  "mouseover",
  "mouseout",
  "pointerenter",
  "pointerleave",
  "pointerover",
  "pointerout",
] as const

const FOCUS_EVENTS_TO_BLOCK = ["focus", "blur", "focusin", "focusout"] as const

const HOVER_STYLE_PROPERTIES = [
  "background-color",
  "color",
  "border-color",
  "box-shadow",
  "transform",
  "opacity",
  "outline",
  "filter",
  "scale",
  "visibility",
] as const

const FOCUS_STYLE_PROPERTIES = [
  "background-color",
  "color",
  "border-color",
  "box-shadow",
  "outline",
  "outline-offset",
  "outline-width",
  "outline-color",
  "outline-style",
  "filter",
  "opacity",
  "ring-color",
  "ring-width",
] as const

const ANIMATION_CONTROLLED_PROPERTIES = [
  "opacity",
  "transform",
  "scale",
  "translate",
  "rotate",
] as const

interface FrozenPseudoState {
  element: HTMLElement
  originalCssText: string
  frozenStyles: string
}

const frozenHoverElements = new Map<HTMLElement, string>()
const frozenFocusElements = new Map<HTMLElement, string>()
let pointerEventsStyle: HTMLStyleElement | null = null

const stopEvent = (event: Event): void => {
  event.stopPropagation()
  event.stopImmediatePropagation()
}

const preventFocusChange = (event: Event): void => {
  event.preventDefault()
  event.stopPropagation()
  event.stopImmediatePropagation()
}

const hasAnimationControlledProperty = (cssText: string): boolean => {
  const lower = cssText.toLowerCase()
  return ANIMATION_CONTROLLED_PROPERTIES.some((property) => lower.includes(property))
}

const collectHoverStates = (): FrozenPseudoState[] => {
  const states: FrozenPseudoState[] = []

  for (const element of document.querySelectorAll(":hover")) {
    if (!(element instanceof HTMLElement)) continue

    const originalCssText = element.style.cssText
    const computed = getComputedStyle(element)
    let frozenStyles = originalCssText

    for (const property of HOVER_STYLE_PROPERTIES) {
      const value = computed.getPropertyValue(property)
      if (value) {
        frozenStyles += `${property}: ${value} !important; `
      }
    }

    states.push({ element, originalCssText, frozenStyles })
  }

  return states
}

const collectFocusStates = (): FrozenPseudoState[] => {
  const states: FrozenPseudoState[] = []

  for (const element of document.querySelectorAll(":focus, :focus-visible")) {
    if (!(element instanceof HTMLElement)) continue
    if (frozenFocusElements.has(element)) continue

    const originalCssText = element.style.cssText
    const computed = getComputedStyle(element)
    let frozenStyles = originalCssText

    for (const property of FOCUS_STYLE_PROPERTIES) {
      const value = computed.getPropertyValue(property)
      if (value) {
        frozenStyles += `${property}: ${value} !important; `
      }
    }

    states.push({ element, originalCssText, frozenStyles })
  }

  return states
}

const applyFrozenStates = (
  states: FrozenPseudoState[],
  storageMap: Map<HTMLElement, string>
): void => {
  for (const { element, originalCssText, frozenStyles } of states) {
    storageMap.set(element, originalCssText)
    element.style.cssText = frozenStyles
  }
}

const restoreFrozenStates = (
  storageMap: Map<HTMLElement, string>,
  styleProperties: readonly string[]
): void => {
  for (const [element, originalCssText] of storageMap) {
    if (hasAnimationControlledProperty(originalCssText)) {
      for (const property of styleProperties) {
        element.style.removeProperty(property)
      }
    } else {
      element.style.cssText = originalCssText
    }
  }

  storageMap.clear()
}

export const freezePseudoStates = (): void => {
  if (pointerEventsStyle) return

  for (const eventType of MOUSE_EVENTS_TO_BLOCK) {
    document.addEventListener(eventType, stopEvent, true)
  }

  for (const eventType of FOCUS_EVENTS_TO_BLOCK) {
    document.addEventListener(eventType, preventFocusChange, true)
  }

  const hoverStates = collectHoverStates()
  const focusStates = collectFocusStates()

  applyFrozenStates(hoverStates, frozenHoverElements)
  applyFrozenStates(focusStates, frozenFocusElements)

  pointerEventsStyle = createStyleElement(
    "data-wiblo-design-frozen-pseudo",
    POINTER_EVENTS_STYLES
  )

  enablePointerEventsOverride()
}

export const unfreezePseudoStates = (): void => {
  disablePointerEventsOverride()
  clearElementPositionCache()

  for (const eventType of MOUSE_EVENTS_TO_BLOCK) {
    document.removeEventListener(eventType, stopEvent, true)
  }

  for (const eventType of FOCUS_EVENTS_TO_BLOCK) {
    document.removeEventListener(eventType, preventFocusChange, true)
  }

  restoreFrozenStates(frozenHoverElements, HOVER_STYLE_PROPERTIES)
  restoreFrozenStates(frozenFocusElements, FOCUS_STYLE_PROPERTIES)

  pointerEventsStyle?.remove()
  pointerEventsStyle = null
}
