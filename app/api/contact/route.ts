import { NextResponse } from "next/server"

import {
  validateContactForm,
  type ContactFormValues,
} from "@/lib/validation"

/**
 * Demo contact endpoint.
 *
 * The request is parsed, validated on the server and logged with a reference
 * ID, but no email is delivered. This keeps the form honest until a real
 * provider is connected.
 *
 * To enable real email delivery:
 *   1. Add an email provider (Resend, SendGrid, or Nodemailer with SMTP).
 *   2. Store the API key / SMTP credentials in server-only env vars.
 *   3. Send the message from this handler after validation succeeds.
 *   4. Return `delivered: true` and update the form copy + success toast.
 */

const MAX_BODY_BYTES = 20_000

function asString(value: unknown) {
  return typeof value === "string" ? value : ""
}

function createReferenceId() {
  const time = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `RP-${time}-${random}`
}

export async function POST(request: Request) {
  let rawBody: string

  try {
    rawBody = await request.text()
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to read the request." },
      { status: 400 }
    )
  }

  if (rawBody.length > MAX_BODY_BYTES) {
    return NextResponse.json(
      { success: false, message: "Your message is too large to submit." },
      { status: 413 }
    )
  }

  let payload: unknown

  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request payload." },
      { status: 400 }
    )
  }

  const record =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {}

  const values: ContactFormValues = {
    fullName: asString(record.fullName).trim(),
    email: asString(record.email).trim(),
    phone: asString(record.phone).trim(),
    subject: asString(record.subject).trim(),
    message: asString(record.message).trim(),
  }

  const errors = validateContactForm(values)

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      {
        success: false,
        message: "Please check the highlighted fields.",
        errors,
      },
      { status: 400 }
    )
  }

  const referenceId = createReferenceId()

  // Demo "inbox": the submission is visible in the server logs only.
  console.info("[contact:demo] Contact message received", {
    referenceId,
    fullName: values.fullName,
    email: values.email,
    phone: values.phone || null,
    subject: values.subject,
    message: values.message,
  })

  return NextResponse.json({
    success: true,
    message: "Demo submission received. No email was sent.",
    data: {
      referenceId,
      demoMode: true,
      delivered: false,
    },
  })
}
