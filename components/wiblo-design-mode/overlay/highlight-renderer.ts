import type { SelectionSnapshot } from "@/components/wiblo-design-mode/protocol"
import { OVERLAY_ROOT_ATTRIBUTE } from "@/components/wiblo-design-mode/engine/constants"

interface DragRect {
  x: number
  y: number
  width: number
  height: number
}

export interface HighlightRenderer {
  setHover: (selection: SelectionSnapshot | null) => void
  setSelection: (selections: SelectionSnapshot[]) => void
  setDragRect: (dragRect: DragRect | null) => void
  dispose: () => void
}

const OVERLAY_ROOT_Z_INDEX = 2147483000

const applySnapshotGeometry = (element: HTMLDivElement, snapshot: SelectionSnapshot): void => {
  const { bounds, rect } = snapshot

  if (bounds.transform !== "none") {
    element.style.left = `${bounds.x}px`
    element.style.top = `${bounds.y}px`
    element.style.width = `${bounds.width}px`
    element.style.height = `${bounds.height}px`
    element.style.transform = bounds.transform
    element.style.transformOrigin = "center center"
  } else {
    element.style.left = `${rect.left}px`
    element.style.top = `${rect.top}px`
    element.style.width = `${rect.width}px`
    element.style.height = `${rect.height}px`
    element.style.transform = "none"
  }

  element.style.borderRadius = bounds.borderRadius || "0px"
}

const createSelectionBox = (
  snapshot: SelectionSnapshot,
  index: number,
  total: number
): HTMLDivElement => {
  const box = document.createElement("div")
  box.setAttribute(OVERLAY_ROOT_ATTRIBUTE, "")

  box.style.position = "fixed"
  box.style.pointerEvents = "none"
  box.style.boxSizing = "border-box"
  box.style.border = "2px solid rgba(113, 86, 255, 1)"
  box.style.background = "rgba(113, 86, 255, 0.12)"

  applySnapshotGeometry(box, snapshot)

  if (index === 0) {
    const label = document.createElement("span")
    label.setAttribute(OVERLAY_ROOT_ATTRIBUTE, "")
    label.style.position = "absolute"
    label.style.top = "-22px"
    label.style.left = "0"
    label.style.background = "rgba(113, 86, 255, 1)"
    label.style.color = "white"
    label.style.fontSize = "11px"
    label.style.fontWeight = "600"
    label.style.padding = "2px 6px"
    label.style.borderRadius = "3px"
    label.style.fontFamily = "system-ui, -apple-system, sans-serif"
    label.style.whiteSpace = "nowrap"

    const countSuffix = total > 1 ? ` (+${total - 1})` : ""
    label.textContent = `${snapshot.tagName.toLowerCase()}${countSuffix}`
    box.appendChild(label)
  }

  return box
}

export const createHighlightRenderer = (): HighlightRenderer => {
  const root = document.createElement("div")
  root.setAttribute(OVERLAY_ROOT_ATTRIBUTE, "")
  root.style.position = "fixed"
  root.style.inset = "0"
  root.style.pointerEvents = "none"
  root.style.zIndex = String(OVERLAY_ROOT_Z_INDEX)

  const hoverLayer = document.createElement("div")
  hoverLayer.setAttribute(OVERLAY_ROOT_ATTRIBUTE, "")
  hoverLayer.style.position = "fixed"
  hoverLayer.style.pointerEvents = "none"
  hoverLayer.style.display = "none"
  hoverLayer.style.boxSizing = "border-box"
  hoverLayer.style.border = "2px solid rgba(96, 165, 250, 1)"
  hoverLayer.style.background = "rgba(96, 165, 250, 0.12)"

  const selectionLayer = document.createElement("div")
  selectionLayer.setAttribute(OVERLAY_ROOT_ATTRIBUTE, "")
  selectionLayer.style.position = "fixed"
  selectionLayer.style.inset = "0"
  selectionLayer.style.pointerEvents = "none"

  const dragLayer = document.createElement("div")
  dragLayer.setAttribute(OVERLAY_ROOT_ATTRIBUTE, "")
  dragLayer.style.position = "fixed"
  dragLayer.style.pointerEvents = "none"
  dragLayer.style.boxSizing = "border-box"
  dragLayer.style.border = "1px solid rgba(113, 86, 255, 0.7)"
  dragLayer.style.background = "rgba(113, 86, 255, 0.1)"
  dragLayer.style.display = "none"

  root.appendChild(hoverLayer)
  root.appendChild(selectionLayer)
  root.appendChild(dragLayer)
  document.body.appendChild(root)

  const setHover = (selection: SelectionSnapshot | null): void => {
    if (!selection) {
      hoverLayer.style.display = "none"
      return
    }

    hoverLayer.style.display = "block"
    applySnapshotGeometry(hoverLayer, selection)
  }

  const setSelection = (selections: SelectionSnapshot[]): void => {
    selectionLayer.replaceChildren()

    if (selections.length === 0) {
      return
    }

    const boxes = selections.map((selection, index) =>
      createSelectionBox(selection, index, selections.length)
    )

    for (const box of boxes) {
      selectionLayer.appendChild(box)
    }
  }

  const setDragRect = (dragRect: DragRect | null): void => {
    if (!dragRect || dragRect.width <= 0 || dragRect.height <= 0) {
      dragLayer.style.display = "none"
      return
    }

    dragLayer.style.display = "block"
    dragLayer.style.left = `${dragRect.x}px`
    dragLayer.style.top = `${dragRect.y}px`
    dragLayer.style.width = `${dragRect.width}px`
    dragLayer.style.height = `${dragRect.height}px`
  }

  const dispose = (): void => {
    root.remove()
  }

  return {
    setHover,
    setSelection,
    setDragRect,
    dispose,
  }
}
