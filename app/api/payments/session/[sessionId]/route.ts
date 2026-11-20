import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { ObjectId } from "mongodb"
import type { Filter, Document } from "mongodb"

import { auth, db } from "@/lib/auth"
import { stripe } from "@/lib/stripe"

export async function GET(
  _request: Request,
  context: { params: Promise<{ sessionId: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return NextResponse.json({ success: false, message: "Sign in to continue." }, { status: 401 })
    const { sessionId } = await context.params
    const checkout = await stripe.checkout.sessions.retrieve(sessionId)
    const bookingId = String(checkout.metadata?.bookingId ?? "")
    if (!bookingId) return NextResponse.json({ success: false, message: "Checkout session is not linked to a rental." }, { status: 400 })

    const bookingIdValue = ObjectId.isValid(bookingId) ? new ObjectId(bookingId) : bookingId
    const booking = await db.collection("bookings").findOne({ _id: bookingIdValue } as Filter<Document>)
    if (!booking || String(booking.customerId) !== session.user.id) {
      return NextResponse.json({ success: false, message: "Payment verification failed." }, { status: 403 })
    }

    const paid = checkout.status === "complete" && checkout.payment_status === "paid"
    if (paid) {
      await db.collection("bookings").updateOne(
        { _id: booking._id },
        {
          $set: {
            paymentStatus: "paid",
            bookingStatus: "active",
            stripeCheckoutSessionId: checkout.id,
            stripePaymentIntentId: typeof checkout.payment_intent === "string" ? checkout.payment_intent : checkout.payment_intent?.id,
            paidAt: new Date(),
            updatedAt: new Date(),
          },
        },
      )
    }

    const equipment = await db.collection("equipment").findOne({
      _id: ObjectId.isValid(String(booking.equipmentId)) ? new ObjectId(String(booking.equipmentId)) : booking.equipmentId,
    })

    return NextResponse.json({
      success: true,
      data: {
        status: paid ? "paid" : "pending",
        sessionStatus: checkout.status,
        amount: Number(booking.totalAmount),
        currency: String(booking.currency ?? "usd"),
        bookingId,
        paymentStatus: paid ? "paid" : booking.paymentStatus,
        updated: paid,
        equipmentName: String(equipment?.name ?? ""),
        equipmentImage: String(equipment?.image ?? ""),
        startDate: booking.startDate ? new Date(booking.startDate as Date).toISOString() : null,
        endDate: booking.endDate ? new Date(booking.endDate as Date).toISOString() : null,
        quantity: Number(booking.quantity),
        durationDays: Number(booking.durationDays),
        billableUnits: Number(booking.billableUnits),
        rentalType: booking.rentalType,
        paidAt: paid ? new Date().toISOString() : null,
        transactionId: typeof checkout.payment_intent === "string" ? checkout.payment_intent : checkout.payment_intent?.id ?? null,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to verify payment."
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
