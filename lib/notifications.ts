import { toast } from "sonner"

import { ApiError } from "@/lib/api/http"
import type { FieldErrors } from "@/lib/validation"

/**
 * Stable toast ids keep the checkout flow from stacking duplicate messages.
 * Sonner replaces a toast that is shown again with the same id.
 */
const BOOKING_TOAST_ID = "booking-payment"
const PAYMENT_STATUS_TOAST_ID = "payment-status"

const VALIDATION_DURATION = 7000
const RESULT_DURATION = 7000

type ValidationToast = {
  key: string
  message: string
}

/** Shown as soon as "Continue to payment" starts creating the checkout. */
export function showPreparingPaymentToast() {
  toast.loading("Preparing your secure payment...", {
    id: BOOKING_TOAST_ID,
    duration: Infinity,
  })
}

/** Replaces the loading toast once Stripe returned a checkout URL. */
export function showRedirectingToPaymentToast() {
  toast.loading("Booking details verified! Redirecting to secure payment...", {
    id: BOOKING_TOAST_ID,
    duration: Infinity,
  })
}

/** Shown when the checkout session could not be created. */
export function showPaymentInitiationErrorToast() {
  toast.error("Unable to initiate payment. Please try again.", {
    id: BOOKING_TOAST_ID,
    duration: RESULT_DURATION,
  })
}

function dismissBookingToast() {
  toast.dismiss(BOOKING_TOAST_ID)
}

function showValidationToasts(items: ValidationToast[]) {
  dismissBookingToast()

  for (const item of items) {
    toast.error(item.message, {
      id: `booking-validation-${item.key}`,
      duration: VALIDATION_DURATION,
    })
  }
}

function mapFieldErrors(errors: FieldErrors): ValidationToast[] {
  const items: ValidationToast[] = []
  const dateErrors = [errors.startDate, errors.endDate].filter(
    (message): message is string => Boolean(message)
  )

  if (dateErrors.length > 0) {
    const missingDate = dateErrors.some((message) =>
      message.startsWith("Choose a rental")
    )

    items.push(
      missingDate
        ? { key: "dates", message: "Please select your rental dates." }
        : { key: "date-range", message: "Invalid rental date range." }
    )
  }

  if (errors.quantity) {
    items.push({
      key: "quantity",
      message: errors.quantity.includes("available")
        ? "Requested quantity is not available."
        : "Please enter a valid quantity.",
    })
  }

  if (errors.contactNumber) {
    items.push({
      key: "contact",
      message: "Please enter a valid contact number.",
    })
  }

  if (errors.deliveryAddress) {
    items.push({
      key: "address",
      message: "Please provide your delivery address.",
    })
  }

  if (errors.notes) {
    items.push({
      key: "notes",
      message: "Please shorten your additional notes.",
    })
  }

  return items
}

/** Surfaces client-side booking validation failures as toasts. */
export function showBookingValidationToasts(errors: FieldErrors) {
  showValidationToasts(mapFieldErrors(errors))
}

function mapServerMessage(message: string): ValidationToast | null {
  const normalized = message.toLowerCase()

  if (
    normalized.includes("valid rental dates") ||
    normalized.includes("dates are required")
  ) {
    return { key: "dates", message: "Please select your rental dates." }
  }

  if (
    normalized.includes("rental date") ||
    normalized.includes("date must be") ||
    normalized.includes("start date")
  ) {
    return { key: "date-range", message: "Invalid rental date range." }
  }

  if (normalized.includes("available")) {
    return {
      key: "quantity",
      message: "Requested quantity is not available.",
    }
  }

  if (normalized.includes("quantity")) {
    return { key: "quantity", message: "Please enter a valid quantity." }
  }

  if (normalized.includes("contact")) {
    return { key: "contact", message: "Please enter a valid contact number." }
  }

  if (normalized.includes("address")) {
    return { key: "address", message: "Please provide your delivery address." }
  }

  if (normalized.includes("notes")) {
    return { key: "notes", message: "Please shorten your additional notes." }
  }

  return null
}

/**
 * Handles a failed booking / checkout request. Backend validation messages are
 * mapped to the same friendly copy as the client-side form validation, while
 * any other failure falls back to the generic payment error.
 */
export function showBookingRequestError(error: unknown) {
  const message = error instanceof Error ? error.message : ""
  const status = error instanceof ApiError ? error.status : 0
  const isValidationStatus =
    status === 400 || status === 409 || status === 422

  if (isValidationStatus) {
    const mapped = mapServerMessage(message)
    if (mapped) {
      showValidationToasts([mapped])
      return
    }
  }

  showPaymentInitiationErrorToast()
}

/** Shown whenever Stripe's payment status is still being verified. */
export function showPaymentVerifyingToast() {
  toast.info("Your payment is being verified. Please wait.", {
    id: PAYMENT_STATUS_TOAST_ID,
    duration: Infinity,
  })
}

/** Only shown after the server confirms Stripe captured the payment. */
export function showPaymentSuccessToast() {
  toast.success("Payment completed successfully!", {
    id: PAYMENT_STATUS_TOAST_ID,
    duration: RESULT_DURATION,
  })
}

export function showPaymentCancelledToast() {
  toast.info("Payment was cancelled. You can try again anytime.", {
    id: PAYMENT_STATUS_TOAST_ID,
    duration: RESULT_DURATION,
  })
}

export function showPaymentFailedToast() {
  toast.error("Payment could not be completed. Please try again.", {
    id: PAYMENT_STATUS_TOAST_ID,
    duration: RESULT_DURATION,
  })
}

export function showPaymentProcessingToast() {
  toast.info("Your payment is being verified. Please wait.", {
    id: PAYMENT_STATUS_TOAST_ID,
    duration: Infinity,
  })
}

export function showPaymentVerificationErrorToast() {
  toast.error("We could not verify your payment yet. Please check again.", {
    id: PAYMENT_STATUS_TOAST_ID,
    duration: RESULT_DURATION,
  })
}

export function dismissPaymentStatusToast() {
  toast.dismiss(PAYMENT_STATUS_TOAST_ID)
}
