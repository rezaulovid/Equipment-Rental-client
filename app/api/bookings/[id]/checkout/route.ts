import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { ObjectId } from "mongodb"
import type { Filter, Document } from "mongodb"

import { auth, db } from "@/lib/auth"
import { getEquipmentById } from "@/lib/equipment"
import { getBookedQuantity, getBillableUnits } from "@/lib/rental-payment"
import { stripe } from "@/lib/stripe"

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return NextResponse.json({ success: false, message: "Sign in to continue." }, { status: 401 })
    const { id } = await context.params
    const bookingId = ObjectId.isValid(id) ? new ObjectId(id) : id
    const booking = await db.collection("bookings").findOne({ _id: bookingId } as Filter<Document>)
    if (!booking) return NextResponse.json({ success: false, message: "Booking not found." }, { status: 404 })
    if (String(booking.customerId) !== session.user.id) {
      return NextResponse.json({ success: false, message: "You do not own this booking." }, { status: 403 })
    }
    if (["paid", "refunded"].includes(String(booking.paymentStatus)) || booking.bookingStatus === "cancelled") {
      return NextResponse.json({ success: false, message: "This booking is not eligible for payment." }, { status: 409 })
    }

    const equipment = await getEquipmentById(String(booking.equipmentId))
    if (!equipment) return NextResponse.json({ success: false, message: "Equipment not found." }, { status: 404 })
    const startDate = new Date(booking.startDate as Date)
    const endDate = new Date(booking.endDate as Date)
    const quantity = Number(booking.quantity)
    const bookedQuantity = await getBookedQuantity(String(booking.equipmentId), startDate, endDate)
    const available = Math.max(equipment.availableQuantity - (bookedQuantity - quantity), 0)
    if (quantity > available) return NextResponse.json({ success: false, message: "Equipment is no longer available." }, { status: 409 })

    const { durationDays, billableUnits } = getBillableUnits(startDate, endDate, equipment.rentalType)
    const totalAmount = Math.round(Number(equipment.rentalPrice) * billableUnits * quantity * 100) / 100
    const origin = new URL(request.url).origin
    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email,
      client_reference_id: session.user.id,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(totalAmount * 100),
          product_data: {
            name: equipment.name,
            description: `${durationDays} day rental - ${quantity} unit${quantity === 1 ? "" : "s"}`,
            images: equipment.image ? [equipment.image] : undefined,
          },
        },
      }],
      metadata: {
        bookingId: id,
        equipmentId: String(booking.equipmentId),
        userId: session.user.id,
        rentalStartDate: startDate.toISOString().slice(0, 10),
        rentalEndDate: endDate.toISOString().slice(0, 10),
        quantity: String(quantity),
      },
      success_url: `${origin}/dashboard/customer/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/customer/payments/cancelled?booking_id=${encodeURIComponent(id)}`,
    }, { idempotencyKey: `booking-retry-${id}-${Date.now()}` })

    await db.collection("bookings").updateOne(
      { _id: bookingId } as Filter<Document>,
      { $set: {
        totalAmount,
        unitPrice: Number(equipment.rentalPrice),
        durationDays,
        billableUnits,
        paymentStatus: "pending",
        bookingStatus: "pending",
        stripeCheckoutSessionId: checkout.id,
        updatedAt: new Date(),
      } },
    )

    return NextResponse.json({
      success: true,
      data: { bookingId: id, paymentId: id, checkoutUrl: checkout.url, amount: totalAmount, currency: "usd" },
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unable to retry checkout." }, { status: 500 })
  }
}
