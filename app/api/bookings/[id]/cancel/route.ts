import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { ObjectId } from "mongodb"
import type { Filter, Document } from "mongodb"

import { auth, db } from "@/lib/auth"

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ success: false, message: "Sign in to continue." }, { status: 401 })
  const { id } = await context.params
  const bookingId = ObjectId.isValid(id) ? new ObjectId(id) : id
  const booking = await db.collection("bookings").findOne({ _id: bookingId } as Filter<Document>)
  if (!booking) return NextResponse.json({ success: false, message: "Booking not found." }, { status: 404 })
  if (String(booking.customerId) !== session.user.id) {
    return NextResponse.json({ success: false, message: "You do not own this booking." }, { status: 403 })
  }
  if (booking.paymentStatus === "paid") {
    return NextResponse.json({ success: false, message: "Paid bookings cannot be cancelled here." }, { status: 409 })
  }

  await db.collection("bookings").updateOne(
    { _id: bookingId } as Filter<Document>,
    { $set: { bookingStatus: "cancelled", paymentStatus: "failed", updatedAt: new Date() } },
  )
  return NextResponse.json({ success: true, data: { id, bookingStatus: "cancelled" } })
}
