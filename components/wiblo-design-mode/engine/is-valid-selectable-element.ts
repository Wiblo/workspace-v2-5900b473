// Adapted from react-grab (MIT) with Wiblo-specific overlay filtering.
import {
  DEV_TOOLS_OVERLAY_Z_INDEX_THRESHOLD,
  IGNORE_TAGS,
  OVERLAY_ROOT_ATTRIBUTE,
  OVERLAY_Z_INDEX_THRESHOLD,
  USER_IGNORE_ATTRIBUTE,
  VIEWPORT_COVERAGE_THRESHOLD,
  VISIBILITY_CACHE_TTL_MS,
} from "./constants"
import { isElementVisible } from "./is-element-visible"

const isUserIgnoredElement = (element: Element): boolean =>
  element.hasAttribute(USER_IGNORE_ATTRIBUTE) ||
  element.closest(`[${USER_IGNORE_ATTRIBUTE}]`) !== null

const isBridgeOverlayElement = (element: Element): boolean =>
  element.hasAttribute(OVERLAY_ROOT_ATTRIBUTE) ||
  element.closest(`[${OVERLAY_ROOT_ATTRIBUTE}]`) !== null

const isDevToolsOverlay = (computedStyle: CSSStyleDeclaration): boolean => {
  const zIndex = parseInt(computedStyle.zIndex, 10)

  return (
    computedStyle.pointerEvents === "none" &&
    computedStyle.position === "fixed" &&
    !Number.isNaN(zIndex) &&
    zIndex >= DEV_TOOLS_OVERLAY_Z_INDEX_THRESHOLD
  )
}

const isFullViewportOverlay = (
  element: Element,
  computedStyle: CSSStyleDeclaration
): boolean => {
  if (computedStyle.position !== "fixed" && computedStyle.position !== "absolute") {
    return false
  }

  const rect = element.getBoundingClientRect()
  if (window.innerWidth <= 0 || window.innerHeight <= 0) {
    return false
  }

  const coversViewport =
    rect.width / window.innerWidth >= VIEWPORT_COVERAGE_THRESHOLD &&
    rect.height / window.innerHeight >= VIEWPORT_COVERAGE_THRESHOLD

  if (!coversViewport) return false

  const backgroundColor = computedStyle.backgroundColor
  const hasInvisibleBackground =
    backgroundColor === "transparent" ||
    backgroundColor === "rgba(0, 0, 0, 0)" ||
    parseFloat(computedStyle.opacity) < 0.1

  if (hasInvisibleBackground) return true

  const zIndex = parseInt(computedStyle.zIndex, 10)
  return !Number.isNaN(zIndex) && zIndex > OVERLAY_Z_INDEX_THRESHOLD
}

interface VisibilityCache {
  isVisible: boolean
  timestamp: number
}

let visibilityCache = new WeakMap<Element, VisibilityCache>()

export const clearSelectableVisibilityCache = (): void => {
  visibilityCache = new WeakMap<Element, VisibilityCache>()
}

export const isValidSelectableElement = (element: Element): boolean => {
  if (!element || !element.isConnected) return false
  if (element === document.documentElement || element === document.body) return false
  if (IGNORE_TAGS.includes(element.tagName as (typeof IGNORE_TAGS)[number])) return false

  if (isBridgeOverlayElement(element)) return false
  if (isUserIgnoredElement(element)) return false

  const now = performance.now()
  const cached = visibilityCache.get(element)

  if (cached && now - cached.timestamp < VISIBILITY_CACHE_TTL_MS) {
    return cached.isVisible
  }

  const computedStyle = window.getComputedStyle(element)

  if (isDevToolsOverlay(computedStyle)) {
    visibilityCache.set(element, { isVisible: false, timestamp: now })
    return false
  }

  if (isFullViewportOverlay(element, computedStyle)) {
    visibilityCache.set(element, { isVisible: false, timestamp: now })
    return false
  }

  const rect = element.getBoundingClientRect()
  const hasSize = rect.width > 0 && rect.height > 0
  const isVisible = hasSize && isElementVisible(element, computedStyle)

  visibilityCache.set(element, { isVisible, timestamp: now })

  return isVisible
}
