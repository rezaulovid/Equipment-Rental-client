import { ObjectId, type Filter, type Document } from "mongodb"

import { db } from "@/lib/auth"
import { jwtVerify, importJWK } from "jose"
import type { JWK } from "jose"
import type { UserRole } from "@/lib/user-role"

/**
 * Server-side JWT + role middleware. Every protected API route resolves the
 * caller from a short-lived BetterAuth JWT (`Authorization: Bearer <token>`,
 * issued through the BetterAuth `/api/auth/token` endpoint) and then applies a
 * role guard before touching protected collections.
 */

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export type AuthenticatedUser = {
  id: string
  name: string
  email: string
  role: UserRole
  image: string | null
  phone: string
  address: string
  banned: boolean
}

const BEARER_SCHEME = "bearer"

async function getPublicSigningKey() {
  const keyRecord = await db
    .collection("jwks")
    .findOne({}, { sort: { createdAt: -1 } })

  if (!keyRecord) return null

  const publicKey = JSON.parse(String(keyRecord.publicKey)) as JWK
  const alg = (keyRecord.alg as string) || "EdDSA"
  const cryptoKey = await importJWK(publicKey, alg)

  return { cryptoKey, alg }
}

/** Verifies a BetterAuth signed JWT and returns its subject (user id). */
export async function verifyAccessToken(
  token: string
): Promise<string | null> {
  try {
    const { cryptoKey, alg } = (await getPublicSigningKey()) ?? {
      cryptoKey: null,
      alg: "EdDSA",
    }

    if (!cryptoKey) return null

    const { payload } = await jwtVerify(token, cryptoKey, {
      algorithms: [alg as "EdDSA"],
    })

    if (!payload?.sub) return null

    return String(payload.sub)
  } catch {
    return null
  }
}

async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser> {
  const authHeader =
    request.headers.get("authorization") ??
    request.headers.get("Authorization")

  const [scheme, token] = authHeader?.trim().split(/\s+/) ?? []

  if (
    !authHeader ||
    !scheme ||
    scheme.toLowerCase() !== BEARER_SCHEME ||
    !token
  ) {
    throw new ApiError(401, "Missing bearer token.")
  }

  const subject = await verifyAccessToken(token.trim())
  if (!subject) {
    throw new ApiError(401, "Invalid or expired token.")
  }

  const userId =
    /^[0-9a-fA-F]{24}$/.test(subject) ? new ObjectId(subject) : subject
  const user = await db.collection("user").findOne({
    _id: userId,
  } as Filter<Document>)

  if (!user) {
    throw new ApiError(401, "Authenticated user could not be found.")
  }

  const record = user as unknown as {
    name?: string
    email?: string
    image?: string | null
    phone?: string
    address?: string
    role?: string
    banned?: boolean
  }

  const role = record.role

  return {
    id: String(user._id),
    name: String(record.name ?? ""),
    email: String(record.email ?? ""),
    role:
      role === "customer" || role === "owner" || role === "admin"
        ? (role as UserRole)
        : "customer",
    image: record.image ?? null,
    phone: String(record.phone ?? ""),
    address: String(record.address ?? ""),
    banned: Boolean(record.banned),
  }
}

/** Verifies the bearer JWT and returns the authenticated user. */
export async function verifyToken(request: Request): Promise<AuthenticatedUser> {
  return getAuthenticatedUser(request)
}

/** Allows only authenticated customer (renter) accounts. */
export async function verifyRenter(request: Request): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(request)

  if (user.role !== "customer") {
    throw new ApiError(403, "Only customer accounts can perform this action.")
  }

  return user
}

/** Allows only authenticated equipment owner accounts. */
export async function verifyOwner(request: Request): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(request)

  if (user.role !== "owner") {
    throw new ApiError(403, "Only equipment owner accounts can perform this action.")
  }

  return user
}

/** Allows only authenticated admin accounts. */
export async function verifyAdmin(request: Request): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(request)

  if (user.role !== "admin") {
    throw new ApiError(403, "Only admin accounts can perform this action.")
  }

  return user
}
