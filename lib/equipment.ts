import { ObjectId, type Filter, type Document } from "mongodb"
import { db } from "@/lib/auth"
import type { CatalogEquipment } from "@/lib/types/customer"
import type { AdminEquipment } from "@/lib/types/admin"

/**
 * Server-side equipment data helpers. Queries run against MongoDB through the
 * shared connection used by BetterAuth; the public catalogue only exposes
 * approved equipment.
 */

const EQUIPMENT_COLLECTION = "equipment"

export type EquipmentDocument = {
  _id: unknown
  name?: string | null
  description?: string | null
  category?: string | null
  location?: string | null
  rentalPrice?: number | null
  rentalType?: string | null
  availableQuantity?: number | null
  condition?: string | null
  brand?: string | null
  model?: string | null
  image?: string | null
  terms?: string | null
  status?: string | null
  ownerId?: string | null
  ownerName?: string | null
  ownerEmail?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
};

export type ListEquipmentFilters = {
  q?: string
  category?: string
  location?: string
  rentalType?: string
  minPrice?: number
  maxPrice?: number
  availability?: string
  sort?: "price-asc" | "price-desc" | "recent"
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function toIdString(value: unknown) {
  return value === null || value === undefined ? "" : String(value)
}

function toDateString(value: Date | string | null | undefined) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function toRentalType(value: string | null | undefined) {
  return value === "weekly" || value === "monthly" ? value : "daily"
}

export function toCatalogEquipment(doc: EquipmentDocument): CatalogEquipment {
  return {
    id: toIdString(doc._id),
    name: String(doc.name ?? ""),
    description: String(doc.description ?? ""),
    category: String(doc.category ?? ""),
    location: String(doc.location ?? ""),
    rentalPrice: Number(doc.rentalPrice ?? 0),
    rentalType: toRentalType(doc.rentalType),
    availableQuantity: Number(doc.availableQuantity ?? 0),
    condition: String(doc.condition ?? ""),
    brand: String(doc.brand ?? ""),
    model: String(doc.model ?? ""),
    image: String(doc.image ?? ""),
    terms: String(doc.terms ?? ""),
    status: "approved",
    ownerId: String(doc.ownerId ?? ""),
    ownerName: String(doc.ownerName ?? ""),
    ownerEmail: String(doc.ownerEmail ?? ""),
    createdAt: toDateString(doc.createdAt),
    updatedAt: toDateString(doc.updatedAt),
  }
}

export function toAdminEquipment(doc: EquipmentDocument): AdminEquipment {
  const status = (
    doc.status === "pending" || doc.status === "approved" || doc.status === "rejected"
      ? doc.status
      : "pending"
  ) as AdminEquipment["status"]

  return {
    id: toIdString(doc._id),
    name: String(doc.name ?? ""),
    description: String(doc.description ?? ""),
    category: String(doc.category ?? ""),
    location: String(doc.location ?? ""),
    rentalPrice: Number(doc.rentalPrice ?? 0),
    rentalType: toRentalType(doc.rentalType),
    availableQuantity: Number(doc.availableQuantity ?? 0),
    condition: String(doc.condition ?? ""),
    brand: String(doc.brand ?? ""),
    model: String(doc.model ?? ""),
    image: String(doc.image ?? ""),
    terms: String(doc.terms ?? ""),
    status,
    ownerId: String(doc.ownerId ?? ""),
    ownerName: String(doc.ownerName ?? ""),
    ownerEmail: String(doc.ownerEmail ?? ""),
    createdAt: toDateString(doc.createdAt),
    updatedAt: toDateString(doc.updatedAt),
  };
}

export async function listEquipment(
  filters: ListEquipmentFilters = {}
): Promise<CatalogEquipment[]> {
  const query: Record<string, unknown> = { status: "approved" }

  const category = filters.category?.trim()
  if (category) {
    query.category = { $regex: `^${escapeRegex(category)}$`, $options: "i" }
  }

  const location = filters.location?.trim()
  if (location) {
    query.location = { $regex: escapeRegex(location), $options: "i" }
  }

  if (
    filters.rentalType === "daily" ||
    filters.rentalType === "weekly" ||
    filters.rentalType === "monthly"
  ) {
    query.rentalType = filters.rentalType
  }

  if (
    typeof filters.minPrice === "number" ||
    typeof filters.maxPrice === "number"
  ) {
    query.rentalPrice = {
      ...(typeof filters.minPrice === "number" ? { $gte: filters.minPrice } : {}),
      ...(typeof filters.maxPrice === "number" ? { $lte: filters.maxPrice } : {}),
    }
  }

  if (filters.availability === "available") {
    query.availableQuantity = { $gt: 0 }
  } else if (filters.availability === "unavailable") {
    query.availableQuantity = { $lte: 0 }
  }

  const q = filters.q?.trim()
  if (q) {
    const pattern = new RegExp(escapeRegex(q), "i")
    query.$or = [
      { name: pattern },
      { description: pattern },
      { category: pattern },
      { location: pattern },
      { brand: pattern },
      { model: pattern },
    ]
  }

  const docs = await db
    .collection(EQUIPMENT_COLLECTION)
    .find(query)
    .sort(
      filters.sort === "price-asc"
        ? { rentalPrice: 1 }
        : filters.sort === "price-desc"
          ? { rentalPrice: -1 }
          : { createdAt: -1 }
    )
    .toArray();

  return docs.map((doc) => toCatalogEquipment(doc as EquipmentDocument));
}

export async function getEquipmentById(
  id: string,
  status: string = "approved"
): Promise<CatalogEquipment | null> {
  const documentId = ObjectId.isValid(id) ? new ObjectId(id) : id
  const doc = await db.collection(EQUIPMENT_COLLECTION).findOne({
    _id: documentId,
    status,
  } as Filter<Document>);

  if (!doc) return null;

  const equipment = toCatalogEquipment(doc as EquipmentDocument)
  return equipment.status === "approved" ? equipment : null;
}

export async function getOwnerEquipmentById(
  id: string
): Promise<AdminEquipment | null> {
  const doc = await db
    .collection(EQUIPMENT_COLLECTION)
    .findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : id,
    } as Filter<Document>);

  if (!doc) return null;

  return toAdminEquipment(doc as EquipmentDocument);
}

export type EquipmentAvailability = {
  equipmentId: string
  totalQuantity: number
  bookedQuantity: number
  availableQuantity: number
  startDate: string
  endDate: string
}

export async function getEquipmentAvailability(
  equipmentId: string,
  startDate: string,
  endDate: string
): Promise<EquipmentAvailability | null> {
  const equipment = await db.collection(EQUIPMENT_COLLECTION).findOne({
    _id: ObjectId.isValid(equipmentId) ? new ObjectId(equipmentId) : equipmentId,
  } as Filter<Document>);

  if (!equipment) return null;

  const totalQuantity = Number((equipment as EquipmentDocument).availableQuantity ?? 0)
  const start = new Date(startDate)
  const end = new Date(endDate)

  let bookedQuantity = 0

  const bookings = await db.collection("bookings").find({}).toArray()

  for (const booking of bookings) {
    if (String((booking as { equipmentId?: string }).equipmentId ?? "") !== equipmentId) {
      continue
    }

    const bookingStatus = String((booking as { bookingStatus?: string }).bookingStatus ?? "")
    if (bookingStatus === "cancelled") continue

    const bookingStart = new Date((booking as { startDate?: Date | string }).startDate ?? 0)
    const bookingEnd = new Date((booking as { endDate?: Date | string }).endDate ?? 0)

    const overlaps =
      bookingStart.getTime() <= end.getTime() &&
      bookingEnd.getTime() >= start.getTime()

    if (!overlaps) continue

    bookedQuantity += Number((booking as { quantity?: number }).quantity ?? 0)
  }

  const availableQuantity = Math.max(totalQuantity - bookedQuantity, 0)

  return {
    equipmentId,
    totalQuantity,
    bookedQuantity,
    availableQuantity,
    startDate: startDate,
    endDate,
  }
}
