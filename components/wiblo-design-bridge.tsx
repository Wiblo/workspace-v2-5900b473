"use client"

import { useEffect } from "react"
import { resolveReactContext } from "@/components/wiblo-design-mode/context/react-context"
import {
  attachSelectionCacheInvalidation,
  invalidateSelectionCaches,
} from "@/components/wiblo-design-mode/engine/cache"
import { createSelectionSnapshot } from "@/components/wiblo-design-mode/engine/create-selection-snapshot"
import {
  DRAG_START_THRESHOLD_PX,
  HOVER_EVENT_INTERVAL_MS,
} from "@/components/wiblo-design-mode/engine/constants"
import { getElementAtPosition } from "@/components/wiblo-design-mode/engine/get-element-at-position"
import {
  type DragRect,
  getElementsInDrag,
} from "@/components/wiblo-design-mode/engine/get-elements-in-drag"
import { isValidSelectableElement } from "@/components/wiblo-design-mode/engine/is-valid-selectable-element"
import {
  freezeGlobalAnimations,
  unfreezeGlobalAnimations,
} from "@/components/wiblo-design-mode/freeze/freeze-animations"
import {
  freezePseudoStates,
  unfreezePseudoStates,
} from "@/components/wiblo-design-mode/freeze/freeze-pseudo-states"
import {
  createHighlightRenderer,
  type HighlightRenderer,
} from "@/components/wiblo-design-mode/overlay/highlight-renderer"
import {
  createBridgeEnvelope,
  type BridgeCapabilities,
  type IframeEventPayloadMap,
  type IframeEventType,
  type ParentCommandPayloadMap,
  type ParentToIframeMessage,
  type PreviewErrorInfo,
  type SelectionSnapshot,
  DESIGN_BRIDGE_PROTOCOL,
  isBridgeConnectBootstrapMessage,
  isDesignBridgeEnvelope,
  isParentCommandType,
} from "@/components/wiblo-design-mode/protocol"

export function WibloDesignBridge() {
  useEffect(() => {
    const capabilities: BridgeCapabilities = {
      protocol: DESIGN_BRIDGE_PROTOCOL,
      selectionModes: ["point", "drag"],
      supportsReactContext: true,
      supportsMultiSelectDrag: true,
      supportsFreeze: true,
    }

    const renderer: HighlightRenderer = createHighlightRenderer()

    let sessionId: string | null = null
    let parentOrigin: string | null = null
    let bridgePort: MessagePort | null = null
    let isDesignModeEnabled = false
    let startedAt = Date.now()

    let selectedElements: Element[] = []
    let selectedSnapshots: SelectionSnapshot[] = []
    const enrichedReactContext = new WeakMap<Element, SelectionSnapshot["reactContext"]>()

    let hoveredElement: Element | null = null

    let pendingHoverSnapshot: SelectionSnapshot | null = null
    let hoverEmitTimer: number | null = null
    let lastHoverEmitAt = 0
    let lastHoveredSelector: string | null = null

    let activePointerId: number | null = null
    let pointerDownPoint: { x: number; y: number } | null = null
    let pointerCurrentPoint: { x: number; y: number } | null = null
    let isDraggingSelection = false
    let dragSelectedElements: Element[] = []
    let isFreezeActive = false

    let heartbeatTimer: number | null = null
    let cacheInvalidationCleanup: (() => void) | null = null

    const tempStyleMemory = new Map<HTMLElement, Map<string, string>>()
    const emittedErrorKeys = new Set<string>()

    const sendEvent = <TType extends IframeEventType>(
      type: TType,
      payload: IframeEventPayloadMap[TType]
    ): void => {
      if (!bridgePort || !sessionId) return

      const message = createBridgeEnvelope(
        sessionId,
        type,
        payload as Record<string, unknown>
      )

      bridgePort.postMessage(message)
    }

    const clearHoverEmitTimer = (): void => {
      if (hoverEmitTimer !== null) {
        window.clearTimeout(hoverEmitTimer)
        hoverEmitTimer = null
      }
    }

    const flushPendingHover = (): void => {
      hoverEmitTimer = null

      const nextSnapshot = pendingHoverSnapshot
      pendingHoverSnapshot = null

      const nextSelector = nextSnapshot?.selector ?? null
      if (nextSelector === lastHoveredSelector) {
        return
      }

      lastHoveredSelector = nextSelector
      lastHoverEmitAt = Date.now()

      sendEvent("ELEMENT_HOVERED", { selection: nextSnapshot })
    }

    const queueHoverEvent = (snapshot: SelectionSnapshot | null): void => {
      pendingHoverSnapshot = snapshot

      if (hoverEmitTimer !== null) {
        return
      }

      const elapsed = Date.now() - lastHoverEmitAt
      const delay = Math.max(0, HOVER_EVENT_INTERVAL_MS - elapsed)

      hoverEmitTimer = window.setTimeout(flushPendingHover, delay)
    }

    const snapshotForElement = (
      element: Element,
      selectionMode: SelectionSnapshot["selectionMode"]
    ): SelectionSnapshot =>
      createSelectionSnapshot(
        element,
        selectionMode,
        enrichedReactContext.get(element) ?? null
        )

    const createDragRect = (
      startPoint: { x: number; y: number },
      currentPoint: { x: number; y: number }
    ): DragRect => ({
      x: Math.min(startPoint.x, currentPoint.x),
      y: Math.min(startPoint.y, currentPoint.y),
      width: Math.abs(currentPoint.x - startPoint.x),
      height: Math.abs(currentPoint.y - startPoint.y),
    })

    const getPointerTravelDistance = (
      startPoint: { x: number; y: number },
      currentPoint: { x: number; y: number }
    ): number => {
      const deltaX = currentPoint.x - startPoint.x
      const deltaY = currentPoint.y - startPoint.y
      return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    }

    const enableSelectionFreeze = (): void => {
      if (isFreezeActive) return

      freezePseudoStates()
      freezeGlobalAnimations()
      isFreezeActive = true
    }

    const disableSelectionFreeze = (): void => {
      if (!isFreezeActive) return

      unfreezePseudoStates()
      unfreezeGlobalAnimations()
      isFreezeActive = false
    }

    const getElementFromSelector = (selector: string): Element | null => {
      try {
        const element = document.querySelector(selector)
        if (!element || !isValidSelectableElement(element)) return null
        return element
      } catch {
        return null
      }
    }

    const enrichSelectionContext = (
      element: Element,
      snapshot: SelectionSnapshot
    ): void => {
      void resolveReactContext(element)
        .then((context) => {
          const index = selectedElements.findIndex((item) => item === element)
          if (index < 0) return

          if (!context) {
            sendEvent("SELECTION_CONTEXT_ENRICHED", {
              selection: snapshot,
              resolved: false,
            })
            return
          }

          enrichedReactContext.set(element, context)

          const enrichedSnapshot: SelectionSnapshot = {
            ...snapshot,
            reactContext: context,
          }

          selectedSnapshots[index] = enrichedSnapshot
          renderer.setSelection(selectedSnapshots)

          sendEvent("SELECTION_CONTEXT_ENRICHED", {
            selection: enrichedSnapshot,
            resolved: true,
          })
        })
        .catch(() => {
          sendEvent("SELECTION_CONTEXT_ENRICHED", {
            selection: snapshot,
            resolved: false,
          })
        })
    }

    const updateSelectionsFromElements = (): void => {
      const selectionModesByElement = new Map(
        selectedElements.map((element, index) => [
          element,
          selectedSnapshots[index]?.selectionMode ?? "point",
        ])
      )

      const filteredElements = selectedElements.filter(
        (element) => element.isConnected && isValidSelectableElement(element)
      )

      selectedElements = filteredElements
      selectedSnapshots = filteredElements.map((element) =>
        snapshotForElement(
          element,
          selectionModesByElement.get(element) ?? "point"
        )
      )

      renderer.setSelection(selectedSnapshots)
    }

    const clearSelectionState = (): void => {
      selectedElements = []
      selectedSnapshots = []
      renderer.setSelection([])
    }

    const selectElements = (
      nextElements: Element[],
      mode: SelectionSnapshot["selectionMode"]
    ): void => {
      const uniqueElements: Element[] = []

      for (const element of nextElements) {
        if (!isValidSelectableElement(element)) continue
        if (!uniqueElements.includes(element)) {
          uniqueElements.push(element)
        }
      }

      selectedElements = uniqueElements
      selectedSnapshots = uniqueElements.map((element) =>
        snapshotForElement(element, mode)
      )

      renderer.setSelection(selectedSnapshots)
      renderer.setHover(null)

      hoveredElement = null
      lastHoveredSelector = null
      queueHoverEvent(null)

      if (selectedSnapshots.length === 0) return

      if (selectedSnapshots.length === 1) {
        const singleSelection = selectedSnapshots[0]
        if (singleSelection) {
          sendEvent("ELEMENT_SELECTED", { selection: singleSelection })
        }
      } else {
        sendEvent("ELEMENTS_SELECTED", {
          selections: selectedSnapshots,
        })
      }

      for (const [index, element] of selectedElements.entries()) {
        const snapshot = selectedSnapshots[index]
        if (!snapshot) continue
        enrichSelectionContext(element, snapshot)
      }
    }

    const resetPointerState = (): void => {
      activePointerId = null
      pointerDownPoint = null
      pointerCurrentPoint = null
      isDraggingSelection = false
      dragSelectedElements = []
      renderer.setDragRect(null)
      disableSelectionFreeze()
    }

    const updateDragSelectionPreview = (): void => {
      if (!pointerDownPoint || !pointerCurrentPoint) return

      const dragRect = createDragRect(pointerDownPoint, pointerCurrentPoint)
      renderer.setDragRect(dragRect)

      const elements = getElementsInDrag(dragRect, isValidSelectableElement, true)
      dragSelectedElements = elements

      const snapshots = elements.map((element) =>
        snapshotForElement(element, "drag")
      )
      renderer.setSelection(snapshots)
    }

    const emitPreviewError = (error: PreviewErrorInfo): void => {
      const key = `${error.type}:${error.message.slice(0, 200)}`
      if (emittedErrorKeys.has(key)) return

      emittedErrorKeys.add(key)
      sendEvent("PREVIEW_ERROR", { error })
    }

    const clearPreviewError = (errorType?: PreviewErrorInfo["type"]): void => {
      if (errorType) {
        for (const key of Array.from(emittedErrorKeys)) {
          if (key.startsWith(`${errorType}:`)) {
            emittedErrorKeys.delete(key)
          }
        }
      } else {
        emittedErrorKeys.clear()
      }

      sendEvent("PREVIEW_ERROR_CLEAR", {
        errorType,
      })
    }

    const stopHeartbeat = (): void => {
      if (heartbeatTimer !== null) {
        window.clearInterval(heartbeatTimer)
        heartbeatTimer = null
      }
    }

    const startHeartbeat = (): void => {
      stopHeartbeat()

      heartbeatTimer = window.setInterval(() => {
        sendEvent("BRIDGE_HEARTBEAT", {
          uptimeMs: Date.now() - startedAt,
          designModeEnabled: isDesignModeEnabled,
          selectionCount: selectedSnapshots.length,
        })
      }, 10000)
    }

    const attachInteractionListeners = (): void => {
      const onPointerDown = (event: PointerEvent) => {
        if (!isDesignModeEnabled || event.button !== 0) return

        activePointerId = event.pointerId
        pointerDownPoint = { x: event.clientX, y: event.clientY }
        pointerCurrentPoint = { x: event.clientX, y: event.clientY }
        isDraggingSelection = false
        dragSelectedElements = []
        renderer.setDragRect(null)

        event.preventDefault()
        event.stopPropagation()
      }

      const onPointerMove = (event: PointerEvent) => {
        if (!isDesignModeEnabled) return

        if (activePointerId === event.pointerId && pointerDownPoint) {
          pointerCurrentPoint = { x: event.clientX, y: event.clientY }

          if (!isDraggingSelection) {
            const travelDistance = getPointerTravelDistance(
              pointerDownPoint,
              pointerCurrentPoint
            )
            if (travelDistance >= DRAG_START_THRESHOLD_PX) {
              isDraggingSelection = true
              enableSelectionFreeze()
            }
          }

          if (isDraggingSelection) {
            updateDragSelectionPreview()
          }

          event.preventDefault()
          event.stopPropagation()
          return
        }

        const element = getElementAtPosition(event.clientX, event.clientY)

        if (!element || selectedElements.includes(element)) {
          if (hoveredElement) {
            hoveredElement = null
            renderer.setHover(null)
            queueHoverEvent(null)
          }
          return
        }

        if (element === hoveredElement) {
          return
        }

        hoveredElement = element

        const snapshot = snapshotForElement(element, "point")
        renderer.setHover(snapshot)
        queueHoverEvent(snapshot)
      }

      const onPointerUp = (event: PointerEvent) => {
        if (!isDesignModeEnabled || activePointerId !== event.pointerId) return

        event.preventDefault()
        event.stopPropagation()

        if (isDraggingSelection) {
          const draggedElements = [...dragSelectedElements]
          resetPointerState()
          selectElements(draggedElements, "drag")
          return
        }

        const element = getElementAtPosition(event.clientX, event.clientY)
        resetPointerState()

        if (!element) return
        selectElements([element], "point")
      }

      const onPointerCancel = (event: PointerEvent) => {
        if (activePointerId !== event.pointerId) return
        resetPointerState()
      }

      const onClick = (event: MouseEvent) => {
        if (!isDesignModeEnabled) return

        event.preventDefault()
        event.stopPropagation()
      }

      const onContextMenu = (event: MouseEvent) => {
        if (!isDesignModeEnabled) return
        event.preventDefault()
        event.stopPropagation()
      }

      document.addEventListener("pointerdown", onPointerDown, true)
      document.addEventListener("pointermove", onPointerMove, true)
      document.addEventListener("pointerup", onPointerUp, true)
      document.addEventListener("pointercancel", onPointerCancel, true)
      document.addEventListener("click", onClick, true)
      document.addEventListener("contextmenu", onContextMenu, true)

      const cacheCleanup = attachSelectionCacheInvalidation(() => {
        invalidateSelectionCaches()

        if (hoveredElement && hoveredElement.isConnected && isValidSelectableElement(hoveredElement)) {
          const snapshot = snapshotForElement(hoveredElement, "point")
          renderer.setHover(snapshot)
        } else {
          hoveredElement = null
          renderer.setHover(null)
        }

        if (isDraggingSelection) {
          updateDragSelectionPreview()
        } else {
          updateSelectionsFromElements()
        }
      })

      cacheInvalidationCleanup = () => {
        cacheCleanup()
        document.removeEventListener("pointerdown", onPointerDown, true)
        document.removeEventListener("pointermove", onPointerMove, true)
        document.removeEventListener("pointerup", onPointerUp, true)
        document.removeEventListener("pointercancel", onPointerCancel, true)
        document.removeEventListener("click", onClick, true)
        document.removeEventListener("contextmenu", onContextMenu, true)
      }
    }

    const detachInteractionListeners = (): void => {
      cacheInvalidationCleanup?.()
      cacheInvalidationCleanup = null
    }

    const restoreTempStylesForElement = (element: HTMLElement): void => {
      const storedStyles = tempStyleMemory.get(element)
      if (!storedStyles) return

      for (const [property, value] of storedStyles.entries()) {
        if (value) {
          element.style.setProperty(property, value)
        } else {
          element.style.removeProperty(property)
        }
      }

      tempStyleMemory.delete(element)
    }

    const clearAllTempStyles = (): void => {
      for (const element of Array.from(tempStyleMemory.keys())) {
        restoreTempStylesForElement(element)
      }
    }

    const setDesignModeEnabled = (enabled: boolean): void => {
      if (enabled === isDesignModeEnabled) {
        if (enabled) {
          sendEvent("PREVIEW_READY", { capabilities })
        }
        return
      }

      isDesignModeEnabled = enabled

      if (enabled) {
        document.body.style.cursor = "crosshair"
        attachInteractionListeners()

        sendEvent("PREVIEW_READY", { capabilities })
        return
      }

      document.body.style.cursor = ""
      detachInteractionListeners()

      clearHoverEmitTimer()
      pendingHoverSnapshot = null
      hoveredElement = null
      lastHoveredSelector = null

      renderer.setHover(null)
      renderer.setDragRect(null)

      resetPointerState()
      clearSelectionState()
      clearAllTempStyles()
    }

    const applyTempStyles = (
      selector: string,
      styles: ParentCommandPayloadMap["SELECTION_APPLY_TEMP_STYLES"]["styles"]
    ): void => {
      const element = getElementFromSelector(selector)
      if (!element || !(element instanceof HTMLElement)) {
        return
      }

      let styleMap = tempStyleMemory.get(element)
      if (!styleMap) {
        styleMap = new Map<string, string>()
        tempStyleMemory.set(element, styleMap)
      }

      for (const [styleKey, styleValue] of Object.entries(styles)) {
        const cssProperty = styleKey.replace(/[A-Z]/g, (value) => `-${value.toLowerCase()}`)

        if (!styleMap.has(cssProperty)) {
          styleMap.set(cssProperty, element.style.getPropertyValue(cssProperty))
        }

        if (typeof styleValue === "string") {
          element.style.setProperty(cssProperty, styleValue)
        }
      }
    }

    const handleCommand = (message: ParentToIframeMessage): void => {
      switch (message.type) {
        case "DESIGN_MODE_SET_ENABLED": {
          setDesignModeEnabled(true)
          break
        }

        case "DESIGN_MODE_SET_DISABLED": {
          setDesignModeEnabled(false)
          break
        }

        case "SELECTION_HIGHLIGHT_SELECTOR": {
          const selector = message.payload.selector

          if (!selector) {
            clearSelectionState()
            renderer.setHover(null)
            break
          }

          const element = getElementFromSelector(selector)
          if (!element) {
            clearSelectionState()
            break
          }

          selectElements([element], "point")
          break
        }

        case "SELECTION_APPLY_TEMP_STYLES": {
          applyTempStyles(message.payload.selector, message.payload.styles)
          break
        }

        case "SELECTION_CLEAR_TEMP_STYLES": {
          const selector = message.payload.selector
          if (selector) {
            const element = getElementFromSelector(selector)
            if (element instanceof HTMLElement) {
              restoreTempStylesForElement(element)
            }
          } else {
            clearAllTempStyles()
          }
          break
        }

        case "SELECTION_REQUEST_SNAPSHOT": {
          if (message.payload.selector) {
            const element = getElementFromSelector(message.payload.selector)
            if (element) {
              const snapshot = snapshotForElement(element, "point")
              sendEvent("ELEMENT_SELECTED", { selection: snapshot })
            }
            break
          }

          if (selectedSnapshots.length === 1) {
            const selection = selectedSnapshots[0]
            if (selection) {
              sendEvent("ELEMENT_SELECTED", { selection })
            }
          } else if (selectedSnapshots.length > 1) {
            sendEvent("ELEMENTS_SELECTED", {
              selections: selectedSnapshots,
            })
          }

          break
        }

        case "BRIDGE_DISPOSE": {
          setDesignModeEnabled(false)

          if (bridgePort) {
            bridgePort.onmessage = null
            bridgePort.onmessageerror = null
            bridgePort.close()
          }

          bridgePort = null
          sessionId = null
          parentOrigin = null

          stopHeartbeat()
          break
        }
      }
    }

    const handleBridgePortMessage = (event: MessageEvent<unknown>): void => {
      if (!isDesignBridgeEnvelope(event.data)) return
      if (!isParentCommandType(event.data.type)) return

      if (!sessionId || event.data.sessionId !== sessionId) {
        return
      }

      handleCommand(event.data as ParentToIframeMessage)
    }

    const handleBootstrapMessage = (event: MessageEvent<unknown>): void => {
      if (!isBridgeConnectBootstrapMessage(event.data)) return
      if (event.source !== window.parent) return
      if (!event.ports || event.ports.length === 0) return

      if (parentOrigin && parentOrigin !== event.origin) {
        return
      }

      const [port] = event.ports
      if (!port) return

      if (bridgePort) {
        bridgePort.onmessage = null
        bridgePort.onmessageerror = null
        bridgePort.close()
      }

      bridgePort = port
      sessionId = event.data.sessionId
      parentOrigin = event.origin
      startedAt = Date.now()

      bridgePort.onmessage = handleBridgePortMessage
      bridgePort.onmessageerror = () => {
        emitPreviewError({
          type: "runtime",
          message: "Bridge port message error",
        })
      }
      bridgePort.start()

      sendEvent("BRIDGE_CONNECTED", {
        capabilities,
        sessionToken: event.data.sessionToken,
      })
      startHeartbeat()
    }

    // Runtime error forwarding
    const handleRuntimeError = (event: ErrorEvent): void => {
      emitPreviewError({
        type: "runtime",
        message: event.message || "Runtime error",
        filename: event.filename || undefined,
        lineno: event.lineno || undefined,
        colno: event.colno || undefined,
        stack: event.error?.stack,
      })
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
      const reason = event.reason
      const message =
        typeof reason === "string"
          ? reason
          : reason instanceof Error
            ? reason.message
            : "Unhandled promise rejection"

      emitPreviewError({
        type: "unhandled-rejection",
        message,
        stack: reason instanceof Error ? reason.stack : undefined,
      })
    }

    // Next.js overlay detection
    let shadowObserver: MutationObserver | null = null
    let observedPortal: Element | null = null
    let portalShadowAttempts = 0
    const MAX_PORTAL_SHADOW_ATTEMPTS = 10
    let lastOverlayPresent = false

    const isElementVisible = (element: Element): boolean => {
      const htmlElement = element as HTMLElement
      const style = window.getComputedStyle(htmlElement)

      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0" &&
        htmlElement.offsetParent !== null
      )
    }

    const extractOverlayMessage = (errorDialog: Element): string => {
      const header =
        (errorDialog.querySelector("[data-nextjs-dialog-header]") as HTMLElement | null)?.textContent?.trim() ??
        (errorDialog.querySelector("h1") as HTMLElement | null)?.textContent?.trim() ??
        ""

      const body =
        (errorDialog.querySelector("[data-nextjs-dialog-body]") as HTMLElement | null)?.textContent?.trim() ??
        (errorDialog.querySelector("[data-nextjs-error-message]") as HTMLElement | null)?.textContent?.trim() ??
        ""

      const codeframe =
        (errorDialog.querySelector("[data-nextjs-codeframe]") as HTMLElement | null)?.textContent?.trim() ??
        (errorDialog.querySelector("pre") as HTMLElement | null)?.textContent?.trim() ??
        ""

      let message = [header, body, codeframe].filter(Boolean).join("\n").trim()

      if (!message) {
        const rawText = (errorDialog as HTMLElement).innerText || errorDialog.textContent || ""
        message = rawText.replace(/\n{3,}/g, "\n\n").trim()
      }

      if (!message) {
        message = "Next.js error overlay detected"
      }

      return message.slice(0, 2000)
    }

    const checkForNextjsErrorOverlay = (): void => {
      let errorDialog: Element | null =
        document.querySelector("[data-nextjs-dialog]") ||
        document.querySelector("[data-nextjs-error-overlay]") ||
        document.querySelector("#__next-build-watcher")

      if (!errorDialog) {
        const portal = document.querySelector("nextjs-portal")
        if (portal?.shadowRoot) {
          errorDialog =
            portal.shadowRoot.querySelector("[data-nextjs-dialog]") ||
            portal.shadowRoot.querySelector("[data-nextjs-error-overlay]") ||
            portal.shadowRoot.querySelector("[role='dialog']")
        }
      }

      if (errorDialog && !isElementVisible(errorDialog)) {
        errorDialog = null
      }

      if (!errorDialog) {
        if (lastOverlayPresent) {
          lastOverlayPresent = false
          clearPreviewError("nextjs-overlay")
        }
        return
      }

      lastOverlayPresent = true

      const message = extractOverlayMessage(errorDialog)
      emitPreviewError({
        type: "nextjs-overlay",
        message,
      })
    }

    const observePortalShadowRoot = (): void => {
      const portal = document.querySelector("nextjs-portal")

      if (!portal) {
        if (observedPortal) {
          shadowObserver?.disconnect()
          shadowObserver = null
          observedPortal = null
        }
        portalShadowAttempts = 0
        return
      }

      if (portal !== observedPortal) {
        observedPortal = portal
        portalShadowAttempts = 0
        shadowObserver?.disconnect()
        shadowObserver = null
      }

      const shadowRoot = portal.shadowRoot
      if (!shadowRoot) {
        if (portalShadowAttempts < MAX_PORTAL_SHADOW_ATTEMPTS) {
          portalShadowAttempts += 1
          window.setTimeout(observePortalShadowRoot, 50)
        }
        return
      }

      if (!shadowObserver) {
        shadowObserver = new MutationObserver(checkForNextjsErrorOverlay)
        shadowObserver.observe(shadowRoot, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true,
        })
        checkForNextjsErrorOverlay()
      }
    }

    const bodyObserver = new MutationObserver(() => {
      observePortalShadowRoot()
      checkForNextjsErrorOverlay()
    })

    window.addEventListener("message", handleBootstrapMessage)
    window.addEventListener("error", handleRuntimeError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    bodyObserver.observe(document.body, { childList: true, subtree: true })

    observePortalShadowRoot()
    if (document.readyState === "complete") {
      checkForNextjsErrorOverlay()
    } else {
      window.addEventListener("load", checkForNextjsErrorOverlay)
    }

    return () => {
      clearHoverEmitTimer()
      stopHeartbeat()
      detachInteractionListeners()
      setDesignModeEnabled(false)

      window.removeEventListener("message", handleBootstrapMessage)
      window.removeEventListener("error", handleRuntimeError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
      window.removeEventListener("load", checkForNextjsErrorOverlay)

      bodyObserver.disconnect()
      shadowObserver?.disconnect()

      if (bridgePort) {
        bridgePort.onmessage = null
        bridgePort.onmessageerror = null
        bridgePort.close()
      }

      resetPointerState()
      clearAllTempStyles()
      renderer.dispose()
    }
  }, [])

  return null
}
