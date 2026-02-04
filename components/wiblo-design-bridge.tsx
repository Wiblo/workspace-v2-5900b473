"use client"

import { useEffect } from "react"

const STYLE_PROPS = [
  "fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "textAlign", "color",
  "backgroundColor", "backgroundImage", "padding", "paddingTop", "paddingRight", "paddingBottom",
  "paddingLeft", "margin", "marginTop", "marginRight", "marginBottom", "marginLeft", "display",
  "flexDirection", "justifyContent", "alignItems", "gap", "borderRadius", "borderWidth",
  "borderColor", "borderStyle", "width", "height", "minWidth", "maxWidth", "minHeight", "maxHeight",
]

const IGNORE_TAGS = ["SCRIPT", "STYLE", "META", "LINK", "HEAD", "HTML", "NOSCRIPT"]

declare global {
  interface Window {
    __wibloReportedErrors__?: Record<string, boolean>
    __wibloPreviewReadySent__?: boolean
  }
}

export function WibloDesignBridge() {
  useEffect(() => {
    const reportedErrors = window.__wibloReportedErrors__ || {}
    window.__wibloReportedErrors__ = reportedErrors

    let enabled = false
    let selectedEl: HTMLElement | null = null
    let hoveredEl: HTMLElement | null = null

    // === DESIGN MODE HIGHLIGHTING ===
    const hoverHL = document.createElement("div")
    hoverHL.style.cssText =
      "position:fixed;pointer-events:none;border:2px solid #60a5fa;background:rgba(96,165,250,0.1);z-index:999998;display:none;box-sizing:border-box;"
    document.body.appendChild(hoverHL)

    const selectHL = document.createElement("div")
    selectHL.style.cssText =
      "position:fixed;pointer-events:none;border:2px solid #7156FF;background:rgba(113,86,255,0.1);z-index:999999;display:none;box-sizing:border-box;"
    const label = document.createElement("span")
    label.style.cssText =
      "position:absolute;top:-22px;left:0;background:#7156FF;color:#fff;font-size:11px;font-weight:500;padding:2px 6px;border-radius:3px;font-family:system-ui;white-space:nowrap;"
    selectHL.appendChild(label)
    document.body.appendChild(selectHL)

    const ignore = (el: HTMLElement) => !el || IGNORE_TAGS.includes(el.tagName)

    const updateHighlight = (el: HTMLElement, hl: HTMLDivElement) => {
      const r = el.getBoundingClientRect()
      hl.style.top = r.top + "px"
      hl.style.left = r.left + "px"
      hl.style.width = r.width + "px"
      hl.style.height = r.height + "px"
    }

    const onScroll = () => {
      if (!enabled) return
      if (selectedEl && selectHL.style.display !== "none") {
        updateHighlight(selectedEl, selectHL)
      }
      if (hoveredEl && hoverHL.style.display !== "none") {
        updateHighlight(hoveredEl, hoverHL)
      }
    }

    const getInfo = (el: HTMLElement) => {
      const cs = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      const styles: Record<string, string> = {}
      STYLE_PROPS.forEach((p) => {
        styles[p] = cs.getPropertyValue(p.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase()))
      })

      const path: string[] = []
      let cur: HTMLElement | null = el
      while (cur && cur !== document.body) {
        let s = cur.tagName.toLowerCase()
        if (cur.id) {
          path.unshift("#" + cur.id)
          break
        }
        if (cur.className && typeof cur.className === "string") {
          const cls = cur.className.split(" ").filter(Boolean).slice(0, 2)
          if (cls.length) s += "." + cls.join(".")
        }
        path.unshift(s)
        cur = cur.parentElement
      }

      return {
        selector: path.join(" > "),
        tagName: el.tagName.toLowerCase(),
        className: typeof el.className === "string" ? el.className : "",
        id: el.id || null,
        textContent:
          el.childNodes.length === 1 && el.childNodes[0]?.nodeType === 3 ? el.textContent?.slice(0, 100) : null,
        rect: { top: r.top, left: r.left, width: r.width, height: r.height },
        styles,
      }
    }

    const onClick = (e: MouseEvent) => {
      if (!enabled) return
      const t = e.target as HTMLElement
      if (ignore(t)) return
      e.preventDefault()
      e.stopPropagation()
      selectedEl = t
      selectHL.style.display = "block"
      updateHighlight(t, selectHL)
      label.textContent = t.tagName.toLowerCase()
      window.parent?.postMessage({ type: "ELEMENT_CLICKED", element: getInfo(t) }, "*")
    }

    const onOver = (e: MouseEvent) => {
      if (!enabled) return
      const t = e.target as HTMLElement
      if (ignore(t) || t === selectedEl) {
        hoverHL.style.display = "none"
        hoveredEl = null
        return
      }
      hoveredEl = t
      hoverHL.style.display = "block"
      updateHighlight(t, hoverHL)
    }

    const onOut = () => {
      if (enabled) {
        hoverHL.style.display = "none"
        hoveredEl = null
      }
    }

    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === "DESIGN_MODE_ENABLE") {
        if (enabled) return  // Already enabled, ignore duplicate
        enabled = true
        document.body.style.cursor = "crosshair"
        document.addEventListener("click", onClick, true)
        document.addEventListener("mouseover", onOver, true)
        document.addEventListener("mouseout", onOut, true)
        window.addEventListener("scroll", onScroll, true)
        window.parent?.postMessage({ type: "DESIGN_MODE_READY" }, "*")
      } else if (e.data?.type === "DESIGN_MODE_DISABLE") {
        enabled = false
        document.body.style.cursor = ""
        document.removeEventListener("click", onClick, true)
        document.removeEventListener("mouseover", onOver, true)
        document.removeEventListener("mouseout", onOut, true)
        window.removeEventListener("scroll", onScroll, true)
        hoverHL.style.display = "none"
        selectHL.style.display = "none"
        selectedEl = null
        hoveredEl = null
      }
    }

    window.addEventListener("message", onMsg)
    window.parent?.postMessage({ type: "BRIDGE_READY" }, "*")

    // === PREVIEW_READY SIGNAL ===
    const postPreviewReady = () => {
      if (window.__wibloPreviewReadySent__) return
      window.__wibloPreviewReadySent__ = true
      window.parent?.postMessage({ type: "PREVIEW_READY" }, "*")
    }

    postPreviewReady()

    if (document.readyState !== "complete") {
      window.addEventListener("load", postPreviewReady)
    }

    // === ERROR OVERLAY DETECTION ===
    let shadowObserver: MutationObserver | null = null
    let observedPortal: Element | null = null
    let portalShadowAttempts = 0
    const MAX_PORTAL_SHADOW_ATTEMPTS = 10
    let lastOverlayPresent = false

    // FIX: Check if element is actually visible (not hidden)
    const isElementVisible = (el: Element): boolean => {
      const htmlEl = el as HTMLElement
      if (!htmlEl) return false
      const style = window.getComputedStyle(htmlEl)
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0" &&
        htmlEl.offsetParent !== null
      )
    }

    // FIX: Clear overlay keys from reportedErrors so same error can be re-reported
    const clearOverlayKeys = () => {
      Object.keys(reportedErrors).forEach((key) => {
        if (key.startsWith("overlay:")) {
          delete reportedErrors[key]
        }
      })
    }

    const extractOverlayMessage = (errorDialog: Element) => {
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

    const checkForNextjsErrorOverlay = () => {
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

      // FIX: Also check if the overlay is actually visible
      if (errorDialog && !isElementVisible(errorDialog)) {
        errorDialog = null
      }

      // If no visible overlay and we previously had one, send clear signal
      if (!errorDialog) {
        if (lastOverlayPresent) {
          console.log("[Wiblo] Error overlay disappeared, sending clear signal")
          lastOverlayPresent = false
          // FIX: Clear overlay keys so same error can be re-reported later
          clearOverlayKeys()
          window.parent?.postMessage(
            { type: "PREVIEW_ERROR_CLEAR", errorType: "nextjs-overlay" },
            "*"
          )
        }
        return
      }

      // Overlay is present and visible
      lastOverlayPresent = true

      const message = extractOverlayMessage(errorDialog)
      const key = "overlay:" + message.slice(0, 100)
      if (!message || reportedErrors[key]) return

      reportedErrors[key] = true
      window.parent?.postMessage(
        {
          type: "PREVIEW_ERROR",
          error: { message, type: "nextjs-overlay" },
        },
        "*"
      )
    }

    const observePortalShadowRoot = () => {
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
          setTimeout(observePortalShadowRoot, 50)
        }
        return
      }

      if (!shadowObserver) {
        shadowObserver = new MutationObserver(() => {
          checkForNextjsErrorOverlay()
        })
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
    bodyObserver.observe(document.body, { childList: true, subtree: true })

    observePortalShadowRoot()
    if (document.readyState === "complete") {
      checkForNextjsErrorOverlay()
    } else {
      window.addEventListener("load", checkForNextjsErrorOverlay)
    }

    console.log("[Wiblo] Design bridge initialized")

    return () => {
      window.removeEventListener("message", onMsg)
      window.removeEventListener("scroll", onScroll, true)
      window.removeEventListener("load", checkForNextjsErrorOverlay)
      window.removeEventListener("load", postPreviewReady)
      bodyObserver.disconnect()
      shadowObserver?.disconnect()
      hoverHL.remove()
      selectHL.remove()
    }
  }, [])

  return null
}
