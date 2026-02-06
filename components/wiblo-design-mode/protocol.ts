export const DESIGN_BRIDGE_PROTOCOL = "wiblo.design-bridge.v1" as const
export type DesignBridgeProtocol = typeof DESIGN_BRIDGE_PROTOCOL

export const DESIGN_BRIDGE_CONNECT_TYPE = "BRIDGE_CONNECT" as const

export type SelectionConfidence = "high" | "medium" | "low"
export type SelectionMode = "point" | "drag"
export type SelectionFramework = "react" | "nextjs" | "unknown"

export interface ElementRect {
  top: number
  left: number
  width: number
  height: number
  right: number
  bottom: number
}

export interface ElementBounds {
  x: number
  y: number
  width: number
  height: number
  borderRadius: string
  transform: string
}

export interface ElementStyles {
  fontFamily: string
  fontSize: string
  fontWeight: string
  lineHeight: string
  letterSpacing: string
  textAlign: string
  color: string
  backgroundColor: string
  backgroundImage: string
  padding: string
  paddingTop: string
  paddingRight: string
  paddingBottom: string
  paddingLeft: string
  margin: string
  marginTop: string
  marginRight: string
  marginBottom: string
  marginLeft: string
  display: string
  position: string
  flexDirection: string
  justifyContent: string
  alignItems: string
  gap: string
  opacity: string
  borderRadius: string
  borderWidth: string
  borderColor: string
  borderStyle: string
  width: string
  height: string
  minWidth: string
  maxWidth: string
  minHeight: string
  maxHeight: string
}

export interface ReactSelectionContext {
  componentName?: string | null
  filePath?: string | null
  lineNumber?: number | null
  columnNumber?: number | null
  framework?: SelectionFramework
}

export interface SelectionSnapshot {
  selector: string
  domId: string
  tagName: string
  className: string
  id: string | null
  textContent: string | null
  attributes: Record<string, string>
  parentPath: string[]
  rect: ElementRect
  bounds: ElementBounds
  styles: ElementStyles
  reactContext?: ReactSelectionContext
  confidence: SelectionConfidence
  selectionMode: SelectionMode
}

export interface BridgeCapabilities {
  protocol: DesignBridgeProtocol
  selectionModes: SelectionMode[]
  supportsReactContext: boolean
  supportsMultiSelectDrag: boolean
  supportsFreeze: boolean
}

export interface PreviewErrorInfo {
  message: string
  filename?: string
  lineno?: number
  colno?: number
  stack?: string
  type: "runtime" | "unhandled-rejection" | "nextjs-overlay" | "console-error" | "dev-server"
}

export interface ParentCommandPayloadMap {
  DESIGN_MODE_SET_ENABLED: {
    reason?: "sidebar" | "restore"
  }
  DESIGN_MODE_SET_DISABLED: {
    reason?: "sidebar" | "dispose"
  }
  SELECTION_HIGHLIGHT_SELECTOR: {
    selector: string | null
  }
  SELECTION_APPLY_TEMP_STYLES: {
    selector: string
    styles: Partial<ElementStyles>
  }
  SELECTION_CLEAR_TEMP_STYLES: {
    selector?: string
  }
  SELECTION_REQUEST_SNAPSHOT: {
    selector?: string
  }
  BRIDGE_DISPOSE: Record<string, never>
}

export interface IframeEventPayloadMap {
  BRIDGE_CONNECTED: {
    capabilities: BridgeCapabilities
    sessionToken: string
  }
  PREVIEW_READY: {
    capabilities: BridgeCapabilities
  }
  ELEMENT_HOVERED: {
    selection: SelectionSnapshot | null
  }
  ELEMENT_SELECTED: {
    selection: SelectionSnapshot
  }
  ELEMENTS_SELECTED: {
    selections: SelectionSnapshot[]
  }
  SELECTION_CONTEXT_ENRICHED: {
    selection: SelectionSnapshot
    resolved: boolean
  }
  PREVIEW_ERROR: {
    error: PreviewErrorInfo
  }
  PREVIEW_ERROR_CLEAR: {
    errorType?: PreviewErrorInfo["type"]
  }
  BRIDGE_HEARTBEAT: {
    uptimeMs: number
    designModeEnabled: boolean
    selectionCount: number
  }
}

export type ParentCommandType = keyof ParentCommandPayloadMap
export type IframeEventType = keyof IframeEventPayloadMap
export type BridgeMessageType = ParentCommandType | IframeEventType

export interface DesignBridgeEnvelope<
  TType extends string = BridgeMessageType,
  TPayload extends Record<string, unknown> = Record<string, unknown>,
> {
  protocol: DesignBridgeProtocol
  sessionId: string
  messageId: string
  timestamp: number
  type: TType
  payload: TPayload
}

export type ParentToIframeMessage = {
  [TType in ParentCommandType]: DesignBridgeEnvelope<TType, ParentCommandPayloadMap[TType]>
}[ParentCommandType]

export type IframeToParentMessage = {
  [TType in IframeEventType]: DesignBridgeEnvelope<TType, IframeEventPayloadMap[TType]>
}[IframeEventType]

export type ParentCommand<TType extends ParentCommandType = ParentCommandType> = {
  type: TType
  payload: ParentCommandPayloadMap[TType]
}

export interface BridgeConnectBootstrapMessage {
  type: typeof DESIGN_BRIDGE_CONNECT_TYPE
  protocol: DesignBridgeProtocol
  sessionId: string
  sessionToken: string
  timestamp: number
}

const randomId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export const createBridgeEnvelope = <
  TType extends BridgeMessageType,
  TPayload extends Record<string, unknown>,
>(
  sessionId: string,
  type: TType,
  payload: TPayload
): DesignBridgeEnvelope<TType, TPayload> => ({
  protocol: DESIGN_BRIDGE_PROTOCOL,
  sessionId,
  messageId: randomId(),
  timestamp: Date.now(),
  type,
  payload,
})

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

export const isBridgeConnectBootstrapMessage = (
  value: unknown
): value is BridgeConnectBootstrapMessage => {
  if (!isRecord(value)) return false

  return (
    value.type === DESIGN_BRIDGE_CONNECT_TYPE &&
    value.protocol === DESIGN_BRIDGE_PROTOCOL &&
    typeof value.sessionId === "string" &&
    typeof value.sessionToken === "string" &&
    typeof value.timestamp === "number"
  )
}

export const isDesignBridgeEnvelope = (value: unknown): value is DesignBridgeEnvelope => {
  if (!isRecord(value)) return false

  return (
    value.protocol === DESIGN_BRIDGE_PROTOCOL &&
    typeof value.sessionId === "string" &&
    typeof value.messageId === "string" &&
    typeof value.timestamp === "number" &&
    typeof value.type === "string" &&
    isRecord(value.payload)
  )
}

export const PARENT_COMMAND_TYPES = [
  "DESIGN_MODE_SET_ENABLED",
  "DESIGN_MODE_SET_DISABLED",
  "SELECTION_HIGHLIGHT_SELECTOR",
  "SELECTION_APPLY_TEMP_STYLES",
  "SELECTION_CLEAR_TEMP_STYLES",
  "SELECTION_REQUEST_SNAPSHOT",
  "BRIDGE_DISPOSE",
] as const

export const IFRAME_EVENT_TYPES = [
  "BRIDGE_CONNECTED",
  "PREVIEW_READY",
  "ELEMENT_HOVERED",
  "ELEMENT_SELECTED",
  "ELEMENTS_SELECTED",
  "SELECTION_CONTEXT_ENRICHED",
  "PREVIEW_ERROR",
  "PREVIEW_ERROR_CLEAR",
  "BRIDGE_HEARTBEAT",
] as const

export const isParentCommandType = (value: string): value is ParentCommandType =>
  PARENT_COMMAND_TYPES.includes(value as ParentCommandType)
