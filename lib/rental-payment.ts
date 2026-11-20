import { ObjectId, type Filter, type Document } from "mongodb"

import { db } from "@/lib/auth"

export type RentalBooking = {
  _id: ObjectId | string
  equipmentId: string
  customerId: string
  customerName: string
  customerEmail: string
  ownerId: string
  ownerName: string
  ownerEmail: string
  startDate: Date
  endDate: Date
  quantity: number
  contactNumber: string
  deliveryAddress: string
  notes: string
  durationDays: number
  billableUnits: number
  unitPrice: number
  rentalType: "daily" | "weekly" | "monthly"
  totalAmount: number
  currency: string
  paymentStatus: "unpaid" | "pending" | "paid" | "refunded" | "failed"
  bookingStatus: "pending" | "active" | "completed" | "cancelled"
  stripeCheckoutSessionId?: string
  stripePaymentIntentId?: string
  paidAt?: Date
  createdAt: Date
  updatedAt: Date
}

export function parseEquipmentId(id: string) {
  return ObjectId.isValid(id) ? new ObjectId(id) : id
}

export function parseDateInput(value: unknown) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isNaN(date.getTime()) ? null : date
}

export function getBillableUnits(
  startDate: Date,
  endDate: Date,
  rentalType: "daily" | "weekly" | "monthly"
) {
  const durationDays = Math.round(
    (endDate.getTime() - startDate.getTime()) / 86_400_000
  )
  if (durationDays <= 0) return { durationDays: 0, billableUnits: 0 }
  const billableUnits =
    rentalType === "weekly"
      ? Math.ceil(durationDays / 7)
      : rentalType === "monthly"
        ? Math.ceil(durationDays / 30)
        : durationDays
  return { durationDays, billableUnits }
}

export async function getBookedQuantity(
  equipmentId: string,
  startDate: Date,
  endDate: Date
) {
  const bookings = await db.collection("bookings").find({
    equipmentId,
    bookingStatus: { $ne: "cancelled" },
  } as Filter<Document>).toArray()

  return bookings.reduce((total, booking) => {
    const record = booking as unknown as {
      startDate?: Date | string
      endDate?: Date | string
      quantity?: number
    }
    const bookingStart = new Date(record.startDate ?? 0)
    const bookingEnd = new Date(record.endDate ?? 0)
    const overlaps =
      bookingStart.getTime() <= endDate.getTime() &&
      bookingEnd.getTime() >= startDate.getTime()
    return overlaps ? total + Number(record.quantity ?? 0) : total
  }, 0)
}

export function toPaymentResponse(booking: RentalBooking) {
  return {
    id: String(booking._id),
    bookingId: String(booking._id),
    equipmentId: booking.equipmentId,
    equipmentName: "",
    equipmentImage: "",
    amount: Number(booking.totalAmount),
    currency: booking.currency,
    paymentStatus: booking.paymentStatus,
    bookingStatus: booking.bookingStatus,
  }
}
