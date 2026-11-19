import { API_BASE_URL, TOKEN_CACHE_MS } from "@/lib/config"

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

type ApiPayload<T> = {
  success: boolean
  data?: T
  message?: string
}

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response
    .json()
    .catch(() => null)) as ApiPayload<T> | null

  if (!response.ok || !payload || payload.success === false) {
    throw new ApiError(
      response.status,
      payload?.message ?? "Unable to complete the request."
    )
  }

  return payload.data as T
}

let cachedToken: { value: string; expiresAt: number } | null = null

function apiUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

/**
 * Reads the BetterAuth access token from the same-origin auth route. The
 * cookie is sent automatically, so no client-side secret is involved.
 */
async function getAccessToken(force = false): Promise<string | null> {
  if (!force && cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value
  }

  const response = await fetch("/api/auth/token", {
    credentials: "include",
    cache: "no-store",
  })

  if (!response.ok) {
    cachedToken = null
    return null
  }

  const payload = (await response.json()) as { token?: string }
  if (!payload.token) return null

  cachedToken = {
    value: payload.token,
    expiresAt: Date.now() + TOKEN_CACHE_MS,
  }

  return payload.token
}

export function clearTokenCache() {
  cachedToken = null
}

/** Calls the rental API with the current access token attached. */
export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  retry = true
): Promise<T> {
  const token = await getAccessToken()

  if (!token) {
    throw new ApiError(401, "Your session has expired. Please sign in again.")
  }

  const response = await fetch(apiUrl(path), {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  })

  // A cached token can expire mid-session; refresh once and retry.
  if (response.status === 401 && retry) {
    clearTokenCache()
    return apiRequest<T>(path, init, false)
  }

  return parseResponse<T>(response)
}

/**
 * Calls a public rental endpoint (approved catalogue data) without an access
 * token. Used by the equipment browse and details pages before sign in.
 */
export async function publicApiRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const response = await fetch(apiUrl(path), {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers ?? {}),
    },
  })

  return parseResponse<T>(response)
}
