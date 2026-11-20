import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import type { Filter, Document } from "mongodb"

import { db } from "@/lib/auth"
import { stripe } from "@/lib/stripe"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature")
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!signature || !secret) {
    return NextResponse.json({ error: "Webhook configuration is missing." }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid webhook signature." }, { status: 400 })
  }

  try {
    if (event.type.startsWith("checkout.session.")) {
      const checkout = event.data.object as { id: string; metadata?: Record<string, string>; payment_status?: string; payment_intent?: string | { id?: string }; amount_total?: number; currency?: string; status?: string }
      const bookingId = String(checkout.metadata?.bookingId ?? "")
      if (!bookingId) return NextResponse.json({ received: true })
      const id = ObjectId.isValid(bookingId) ? new ObjectId(bookingId) : bookingId
      const existing = await db.collection("bookings").findOne({ _id: id } as Filter<Document>)
      if (!existing) return NextResponse.json({ received: true })

      if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
        if (checkout.payment_status === "paid") {
          await db.collection("payments").updateOne(
            { stripeCheckoutSessionId: checkout.id },
            { $setOnInsert: {
              bookingId,
              equipmentId: String(existing.equipmentId),
              customerId: String(existing.customerId),
              amount: Number(checkout.amount_total ?? Math.round(Number(existing.totalAmount) * 100)) / 100,
              currency: String(checkout.currency ?? existing.currency ?? "usd"),
              status: "paid",
              transactionId: typeof checkout.payment_intent === "string" ? checkout.payment_intent : checkout.payment_intent?.id ?? "",
              stripeCheckoutSessionId: checkout.id,
              paidAt: new Date(),
              createdAt: new Date(),
            } },
            { upsert: true },
          )
          await db.collection("bookings").updateOne(
            { _id: id } as Filter<Document>,
            { $set: {
              paymentStatus: "paid",
              bookingStatus: "active",
              stripeCheckoutSessionId: checkout.id,
              stripePaymentIntentId: typeof checkout.payment_intent === "string" ? checkout.payment_intent : checkout.payment_intent?.id ?? "",
              paidAt: new Date(),
              updatedAt: new Date(),
            } },
          )
        }
      } else if (event.type === "checkout.session.async_payment_failed") {
        await db.collection("bookings").updateOne(
          { _id: id } as Filter<Document>,
          { $set: { paymentStatus: "failed", updatedAt: new Date() } },
        )
      } else if (event.type === "checkout.session.expired") {
        await db.collection("bookings").updateOne(
          { _id: id } as Filter<Document>,
          { $set: { paymentStatus: "failed", updatedAt: new Date() } },
        )
      }
    }
    return NextResponse.json({ received: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Webhook processing failed." }, { status: 500 })
  }
}
