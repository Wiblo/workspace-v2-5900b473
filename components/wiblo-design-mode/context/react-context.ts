// Adapted from react-grab context extraction strategy (MIT).
import "bippy"
import {
  getDisplayName,
  getFiberFromHostInstance,
  isCompositeFiber,
  isInstrumentationActive,
} from "bippy"
import {
  getOwnerStack,
  isSourceFile,
  normalizeFileName,
  type StackFrame,
} from "bippy/source"
import type { ReactSelectionContext } from "@/components/wiblo-design-mode/protocol"

const NEXT_INTERNAL_COMPONENT_NAMES = new Set([
  "InnerLayoutRouter",
  "RedirectErrorBoundary",
  "RedirectBoundary",
  "HTTPAccessFallbackErrorBoundary",
  "HTTPAccessFallbackBoundary",
  "LoadingBoundary",
  "ErrorBoundary",
  "InnerScrollAndFocusHandler",
  "ScrollAndFocusHandler",
  "RenderFromTemplateContext",
  "OuterLayoutRouter",
  "AppRouter",
  "ServerRoot",
  "HotReload",
  "Router",
  "html",
  "body",
])

const REACT_INTERNAL_COMPONENT_NAMES = new Set([
  "Suspense",
  "Fragment",
  "StrictMode",
  "Profiler",
  "SuspenseList",
])

const checkIsNextProject = (): boolean =>
  Boolean(document.getElementById("__NEXT_DATA__") || document.querySelector("nextjs-portal"))

const isCapitalized = (value: string): boolean => {
  if (!value) return false
  const first = value.charCodeAt(0)
  return first >= 65 && first <= 90
}

const checkIsInternalComponentName = (name: string): boolean => {
  if (name.startsWith("_")) return true
  if (NEXT_INTERNAL_COMPONENT_NAMES.has(name)) return true
  if (REACT_INTERNAL_COMPONENT_NAMES.has(name)) return true
  return false
}

const checkIsSourceComponentName = (name: string): boolean => {
  if (name.length <= 1) return false
  if (!isCapitalized(name)) return false
  if (checkIsInternalComponentName(name)) return false
  if (name.startsWith("Primitive.")) return false
  if (name.includes("Provider") && name.includes("Context")) return false
  return true
}

const isUsefulComponentName = (name: string): boolean => {
  if (!name) return false
  if (checkIsInternalComponentName(name)) return false
  if (name.startsWith("Primitive.")) return false
  if (name === "SlotClone" || name === "Slot") return false
  return true
}

const stackCache = new WeakMap<Element, Promise<StackFrame[] | null>>()

const fetchStack = async (element: Element): Promise<StackFrame[] | null> => {
  try {
    const fiber = getFiberFromHostInstance(element)
    if (!fiber) return null
    return await getOwnerStack(fiber)
  } catch {
    return null
  }
}

const getStack = (element: Element): Promise<StackFrame[] | null> => {
  if (!isInstrumentationActive()) return Promise.resolve([])

  const cached = stackCache.get(element)
  if (cached) return cached

  const promise = fetchStack(element)
  stackCache.set(element, promise)
  return promise
}

const getComponentDisplayName = (element: Element): string | null => {
  if (!isInstrumentationActive()) return null

  const fiber = getFiberFromHostInstance(element)
  if (!fiber) return null

  let currentFiber = fiber.return

  while (currentFiber) {
    if (isCompositeFiber(currentFiber)) {
      const name = getDisplayName(currentFiber.type)
      if (name && isUsefulComponentName(name)) {
        return name
      }
    }

    currentFiber = currentFiber.return
  }

  return null
}

const getFirstSourceFrame = (stack: StackFrame[] | null): StackFrame | null => {
  if (!stack) return null

  for (const frame of stack) {
    if (frame.fileName && isSourceFile(frame.fileName)) {
      return frame
    }
  }

  return null
}

const getComponentNameFromStack = (stack: StackFrame[] | null): string | null => {
  if (!stack) return null

  for (const frame of stack) {
    if (frame.functionName && checkIsSourceComponentName(frame.functionName)) {
      return frame.functionName
    }
  }

  return null
}

export const resolveReactContext = async (
  element: Element
): Promise<ReactSelectionContext | null> => {
  if (!isInstrumentationActive()) return null

  const stack = await getStack(element)
  const sourceFrame = getFirstSourceFrame(stack)

  const componentName =
    getComponentNameFromStack(stack) ?? getComponentDisplayName(element)

  const filePath = sourceFrame?.fileName
    ? normalizeFileName(sourceFrame.fileName)
    : null

  const lineNumber = sourceFrame?.lineNumber ?? null
  const columnNumber = sourceFrame?.columnNumber ?? null

  if (!componentName && !filePath) {
    return null
  }

  return {
    componentName: componentName ?? null,
    filePath,
    lineNumber,
    columnNumber,
    framework: checkIsNextProject() ? "nextjs" : "react",
  }
}
