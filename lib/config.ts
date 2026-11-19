/**
 * Client-side configuration. Only NEXT_PUBLIC_* values belong here — anything
 * else would be bundled into the browser build.
 */

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"
).replace(/\/+$/, "")

/** How long a fetched access token is reused before asking BetterAuth again. */
export const TOKEN_CACHE_MS = 60_000
