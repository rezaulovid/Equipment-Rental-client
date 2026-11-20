import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { ObjectId, type Filter, type Document } from "mongodb"

import { auth, db } from "@/lib/auth"
import { getEquipmentById } from "@/lib/equipment"
import { getBookedQuantity, parseDateInput, getBillableUnits } from "@/lib/rental-payment"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    const user = session?.user
    if (!user) return NextResponse.json({ success: false, message: "Sign in to continue." }, { status: 401 })
    const userId = ObjectId.isValid(user.id) ? new ObjectId(user.id) : user.id
    const userRecord = await db.collection("user").findOne({ _id: userId } as Filter<Document>)
    if (String(userRecord?.role ?? "") !== "customer") {
      return NextResponse.json({ success: false, message: "Only customer accounts can rent equipment." }, { status: 403 })
    }

    const body = await request.json()
    const equipmentId = String(body.equipmentId ?? "").trim()
    const startDate = parseDateInput(body.startDate)
    const endDate = parseDateInput(body.endDate)
    const quantity = Number(body.quantity)
    const contactNumber = String(body.contactNumber ?? "").trim()
    const deliveryAddress = String(body.deliveryAddress ?? "").trim()
    const notes = String(body.notes ?? "").trim()

    if (!equipmentId || !startDate || !endDate) {
      return NextResponse.json({ success: false, message: "Equipment and valid rental dates are required." }, { status: 400 })
    }
    if (endDate <= startDate) {
      return NextResponse.json({ success: false, message: "End date must be after start date." }, { status: 400 })
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json({ success: false, message: "Quantity must be at least 1." }, { status: 400 })
    }
    if (!/^[+\d()\s.-]{6,30}$/.test(contactNumber)) {
      return NextResponse.json({ success: false, message: "Enter a valid contact number." }, { status: 400 })
    }
    if (deliveryAddress.length < 5 || deliveryAddress.length > 200) {
      return NextResponse.json({ success: false, message: "Delivery address must be between 5 and 200 characters." }, { status: 400 })
    }
    if (notes.length > 500) {
      return NextResponse.json({ success: false, message: "Notes must be at most 500 characters." }, { status: 400 })
    }

    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    if (startDate < today) {
      return NextResponse.json({ success: false, message: "Rental start date cannot be in the past." }, { status: 400 })
    }

    const equipment = await getEquipmentById(equipmentId)
    if (!equipment) return NextResponse.json({ success: false, message: "Equipment not found." }, { status: 404 })

    const bookedQuantity = await getBookedQuantity(equipmentId, startDate, endDate)
    const availableQuantity = Math.max(equipment.availableQuantity - bookedQuantity, 0)
    if (quantity > availableQuantity) {
      return NextResponse.json({ success: false, message: `Only ${availableQuantity} unit${availableQuantity === 1 ? "" : "s"} available.` }, { status: 409 })
    }

    const existing = await db.collection("bookings").findOne({
      customerId: user.id,
      equipmentId,
      startDate,
      endDate,
      quantity,
      paymentStatus: { $in: ["unpaid", "pending"] },
      bookingStatus: { $ne: "cancelled" },
      createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) },
    })
    if (existing?.stripeCheckoutSessionId) {
      const existingSession = await stripe.checkout.sessions.retrieve(String(existing.stripeCheckoutSessionId))
      if (existingSession.status === "open" && existingSession.url) {
        return NextResponse.json({
          success: true,
          data: {
            bookingId: String(existing._id),
            paymentId: String(existing._id),
            checkoutUrl: existingSession.url,
            amount: Number(existing.totalAmount),
            currency: String(existing.currency ?? "usd"),
          },
        })
      }
    }

    const { durationDays, billableUnits } = getBillableUnits(startDate, endDate, equipment.rentalType)
    const unitPrice = Number(equipment.rentalPrice)
    const totalAmount = Math.round(unitPrice * billableUnits * quantity * 100) / 100
    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      return NextResponse.json({ success: false, message: "Invalid rental price." }, { status: 422 })
    }

    const now = new Date()
    const result = await db.collection("bookings").insertOne({
      equipmentId,
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      ownerId: equipment.ownerId,
      ownerName: equipment.ownerName,
      ownerEmail: equipment.ownerEmail,
      startDate,
      endDate,
      quantity,
      contactNumber,
      deliveryAddress,
      notes,
      durationDays,
      billableUnits,
      unitPrice,
      rentalType: equipment.rentalType,
      totalAmount,
      currency: "usd",
      paymentStatus: "pending",
      bookingStatus: "pending",
      createdAt: now,
      updatedAt: now,
    })
    const bookingId = String(result.insertedId)
    const origin = new URL(request.url).origin
    const checkout = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        customer_email: user.email,
        client_reference_id: user.id,
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
          bookingId,
          equipmentId,
          userId: user.id,
          rentalStartDate: body.startDate,
          rentalEndDate: body.endDate,
          quantity: String(quantity),
        },
        success_url: `${origin}/dashboard/customer/payments/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/dashboard/customer/payments/cancelled?booking_id=${encodeURIComponent(bookingId)}`,
      },
      { idempotencyKey: `booking-${bookingId}` },
    )

    await db.collection("bookings").updateOne(
      { _id: result.insertedId },
      { $set: { stripeCheckoutSessionId: checkout.id, updatedAt: new Date() } },
    )

    return NextResponse.json({
      success: true,
      data: {
        bookingId,
        paymentId: bookingId,
        checkoutUrl: checkout.url,
        amount: totalAmount,
        currency: "usd",
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create checkout."
    console.error("Rental checkout failed:", message)
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
