import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

const ENV_FILES = [".env", ".env.local", ".env.development", ".env.development.local"]

export interface GatewayAuthConfig {
  apiKey: string
  source: "AI_GATEWAY_API_KEY" | "ANTHROPIC_AUTH_TOKEN"
}

function stripQuotes(value: string): string {
  if (
    (value.startsWith("\"") && value.endsWith("\"")) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }
  return value
}

export function loadEnv(): void {
  const cwd = process.cwd()

  for (const filename of ENV_FILES) {
    const filePath = resolve(cwd, filename)
    if (!existsSync(filePath)) continue

    const content = readFileSync(filePath, "utf-8")
    const lines = content.split(/\r?\n/)

    for (const rawLine of lines) {
      const line = rawLine.trim()
      if (!line || line.startsWith("#")) continue

      const normalized = line.startsWith("export ") ? line.slice(7).trim() : line
      const equalsIndex = normalized.indexOf("=")
      if (equalsIndex === -1) continue

      const key = normalized.slice(0, equalsIndex).trim()
      let value = normalized.slice(equalsIndex + 1).trim()
      if (!key) continue

      value = stripQuotes(value)
      value = value.replace(/\\n/g, "\n").replace(/\\r/g, "\r")

      if (process.env[key] === undefined) {
        process.env[key] = value
      }
    }
  }
}

export function resolveGatewayAuth(): GatewayAuthConfig | null {
  const aiGatewayApiKey = process.env.AI_GATEWAY_API_KEY?.trim()
  if (aiGatewayApiKey) {
    return {
      apiKey: aiGatewayApiKey,
      source: "AI_GATEWAY_API_KEY",
    }
  }

  const anthropicAuthToken = process.env.ANTHROPIC_AUTH_TOKEN?.trim()
  if (anthropicAuthToken) {
    return {
      apiKey: anthropicAuthToken,
      source: "ANTHROPIC_AUTH_TOKEN",
    }
  }

  return null
}
