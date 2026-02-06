// Adapted from react-grab (MIT).
import type { ElementBounds } from "@/components/wiblo-design-mode/protocol"
import {
  BOUNDS_CACHE_TTL_MS,
  MAX_TRANSFORM_ANCESTOR_DEPTH,
  TRANSFORM_EARLY_BAIL_DEPTH,
} from "./constants"
import {
  stripTranslateFromMatrix,
  stripTranslateFromTransformString,
} from "./strip-translate-from-transform"

interface CachedBounds {
  bounds: ElementBounds
  timestamp: number
}

let boundsCache = new WeakMap<Element, CachedBounds>()

export const invalidateElementBoundsCache = (): void => {
  boundsCache = new WeakMap<Element, CachedBounds>()
}

const getAccumulatedTransform = (
  element: Element,
  selfTransform: string
): string => {
  const hasSelfTransform = selfTransform && selfTransform !== "none"

  let accumulated: DOMMatrix | null = null
  let current = element.parentElement
  let depth = 0

  while (
    current &&
    current !== document.documentElement &&
    depth < MAX_TRANSFORM_ANCESTOR_DEPTH
  ) {
    const transformValue = window.getComputedStyle(current).transform

    if (transformValue && transformValue !== "none") {
      accumulated = accumulated
        ? new DOMMatrix(transformValue).multiply(accumulated)
        : new DOMMatrix(transformValue)
    } else if (
      !hasSelfTransform &&
      !accumulated &&
      depth >= TRANSFORM_EARLY_BAIL_DEPTH
    ) {
      return "none"
    }

    current = current.parentElement
    depth += 1
  }

  if (!accumulated) {
    return hasSelfTransform
      ? stripTranslateFromTransformString(selfTransform)
      : "none"
  }

  if (hasSelfTransform) {
    accumulated = accumulated.multiply(new DOMMatrix(selfTransform))
  }

  return stripTranslateFromMatrix(accumulated)
}

export const createElementBounds = (element: Element): ElementBounds => {
  const now = performance.now()
  const cached = boundsCache.get(element)

  if (cached && now - cached.timestamp < BOUNDS_CACHE_TTL_MS) {
    return cached.bounds
  }

  const rect = element.getBoundingClientRect()
  const style = window.getComputedStyle(element)
  const transform = getAccumulatedTransform(element, style.transform)

  let bounds: ElementBounds

  if (transform !== "none" && element instanceof HTMLElement) {
    const offsetWidth = element.offsetWidth
    const offsetHeight = element.offsetHeight

    if (offsetWidth > 0 && offsetHeight > 0) {
      const centerX = rect.left + rect.width * 0.5
      const centerY = rect.top + rect.height * 0.5

      bounds = {
        borderRadius: style.borderRadius || "0px",
        width: offsetWidth,
        height: offsetHeight,
        transform,
        x: centerX - offsetWidth * 0.5,
        y: centerY - offsetHeight * 0.5,
      }
    } else {
      bounds = {
        borderRadius: style.borderRadius || "0px",
        width: rect.width,
        height: rect.height,
        transform,
        x: rect.left,
        y: rect.top,
      }
    }
  } else {
    bounds = {
      borderRadius: style.borderRadius || "0px",
      width: rect.width,
      height: rect.height,
      transform,
      x: rect.left,
      y: rect.top,
    }
  }

  boundsCache.set(element, { bounds, timestamp: now })
  return bounds
}
