"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  CheckCircle2,
  ClipboardList,
  Clock,
  Package,
  RefreshCw,
  ShieldAlert,
} from "lucide-react"

import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { customerApi } from "@/lib/api/customer"
import {
  showPaymentFailedToast,
  showPaymentProcessingToast,
  showPaymentSuccessToast,
  showPaymentVerificationErrorToast,
  showPaymentVerifyingToast,
} from "@/lib/notifications"
import type { CheckoutConfirmation } from "@/lib/types/customer"
import { formatCurrency, formatDate } from "@/lib/rental"
import { ErrorPanel } from "../../_components/state-panels"

type ConfirmationState =
  | { phase: "loading" }
  | { phase: "missing" }
  | { phase: "error"; message: string }
  | { phase: "done"; result: CheckoutConfirmation }

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")?.trim() ?? ""
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<ConfirmationState>(() =>
    sessionId ? { phase: "loading" } : { phase: "missing" }
  )

  useEffect(() => {
    if (!sessionId) {
      return
    }

    let active = true
    const timer = window.setTimeout(() => {
      if (!active) return
      setState({ phase: "loading" })

      customerApi
        .confirmCheckoutSession(sessionId)
        .then((result) => {
          if (active) setState({ phase: "done", result })
        })
        .catch((error) => {
          if (active) {
            setState({
              phase: "error",
              message:
                error instanceof Error
                  ? error.message
                  : "Your payment could not be verified.",
            })
          }
        })
    }, 0)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [sessionId, attempt])

  // Toast the verified Stripe result. The success message is only shown after
  // the API confirms the payment with Stripe, never from the URL alone.
  useEffect(() => {
    if (state.phase === "loading") {
      showPaymentVerifyingToast()
      return
    }

    if (state.phase === "error") {
      showPaymentVerificationErrorToast()
      return
    }

    if (state.phase !== "done") return

    const { result } = state
    const isPaid = result.paymentStatus === "paid" || result.status === "paid"

    if (isPaid) {
      showPaymentSuccessToast()
      return
    }

    if (
      result.paymentStatus === "failed" ||
      result.sessionStatus === "expired"
    ) {
      showPaymentFailedToast()
      return
    }

    showPaymentProcessingToast()
  }, [state])

  if (state.phase === "loading") {
    return (
      <Card className="w-full max-w-lg p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-navy-tint text-brand-navy">
          <RefreshCw className="size-6 animate-spin" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-display text-xl font-semibold text-brand-navy">
          Confirming your payment
        </h1>
        <p className="mt-2 text-sm leading-6 text-brand-ink-soft">
          We are checking the checkout session directly with Stripe. This only
          takes a moment.
        </p>
        <div className="mt-6 space-y-2">
          <Skeleton className="h-4 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
      </Card>
    )
  }

  if (state.phase === "missing") {
    return (
      <Card className="w-full max-w-lg p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
          <ShieldAlert className="size-6" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-display text-xl font-semibold text-brand-navy">
          Checkout session missing
        </h1>
        <p className="mt-2 text-sm leading-6 text-brand-ink-soft">
          This page was opened without a Stripe session. If you completed a
          payment, open your rentals to see its verified status.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            className="gap-2 bg-brand-orange text-white hover:bg-brand-orange-strong"
            render={<Link href="/dashboard/customer/rentals" />}
            nativeButton={false}
          >
            <ClipboardList className="size-4" aria-hidden="true" />
            My rentals
          </Button>
          <Button
            variant="outline"
            render={<Link href="/" />}
            nativeButton={false}
          >
            Browse equipment
          </Button>
        </div>
      </Card>
    )
  }

  if (state.phase === "error") {
    return (
      <Card className="w-full max-w-lg p-8">
        <div className="text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <ShieldAlert className="size-6" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-xl font-semibold text-brand-navy">
            We could not verify the payment yet
          </h1>
          <p className="mt-2 text-sm leading-6 text-brand-ink-soft">
            Your card may still have been charged. Stripe&apos;s webhook can take
            a few seconds, and your rental will update automatically.
          </p>
        </div>
        <div className="mt-5">
          <ErrorPanel message={state.message} />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            className="gap-2 bg-brand-orange text-white hover:bg-brand-orange-strong"
            onClick={() => setAttempt((current) => current + 1)}
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            Check again
          </Button>
          <Button
            variant="outline"
            render={<Link href="/dashboard/customer/rentals" />}
            nativeButton={false}
          >
            View my rentals
          </Button>
        </div>
      </Card>
    )
  }

  const { result } = state
  const isPaid = result.paymentStatus === "paid" || result.status === "paid"
  const isExpired = result.sessionStatus === "expired"

  if (isPaid) {
    return (
      <Card className="w-full max-w-lg p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold tracking-[-0.02em] text-brand-navy">
          Payment Successful!
        </h1>
        <p className="mt-2 text-sm leading-6 text-brand-ink-soft">
          Thank you! Your payment has been successfully processed and your
          booking is confirmed.
        </p>

        {result.equipmentImage ? (
          <img
            src={result.equipmentImage}
            alt={result.equipmentName || "Equipment"}
            className="mt-5 h-36 w-full rounded-xl object-cover"
          />
        ) : null}

        <dl className="mt-6 space-y-2 rounded-xl border border-brand-navy-line bg-brand-navy-tint/50 p-4 text-left text-sm">
          {result.equipmentName ? (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-brand-ink-soft">Equipment</dt>
              <dd className="font-semibold text-brand-navy">{result.equipmentName}</dd>
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-3">
            <dt className="text-brand-ink-soft">Rental period</dt>
            <dd className="font-semibold text-brand-navy">
              {formatDate(result.startDate)} – {formatDate(result.endDate)}
            </dd>
          </div>
          {result.quantity ? (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-brand-ink-soft">Quantity</dt>
              <dd className="font-semibold text-brand-navy">{result.quantity}</dd>
            </div>
          ) : null}
          {result.durationDays ? (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-brand-ink-soft">Rental duration</dt>
              <dd className="font-semibold text-brand-navy">
                {result.durationDays} day{result.durationDays === 1 ? "" : "s"}
              </dd>
            </div>
          ) : null}
          {result.transactionId ? (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-brand-ink-soft">Transaction ID</dt>
              <dd className="max-w-[180px] truncate font-mono text-xs text-brand-navy">{result.transactionId}</dd>
            </div>
          ) : null}
          {result.paidAt ? (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-brand-ink-soft">Payment date</dt>
              <dd className="font-semibold text-brand-navy">{formatDate(result.paidAt)}</dd>
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-3">
            <dt className="text-brand-ink-soft">Amount paid</dt>
            <dd className="font-semibold text-brand-navy">
              {formatCurrency(result.amount, result.currency)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-brand-ink-soft">Booking reference</dt>
            <dd className="font-mono text-xs text-brand-navy">
              {result.bookingId || "—"}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-brand-ink-soft">Payment status</dt>
            <dd>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.04em] text-emerald-700 uppercase">
                Paid
              </span>
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            className="gap-2 bg-brand-orange text-white hover:bg-brand-orange-strong"
            render={<Link href="/dashboard/customer/rentals" />}
            nativeButton={false}
          >
            <ClipboardList className="size-4" aria-hidden="true" />
            View my rentals
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            render={<Link href="/equipment" />}
            nativeButton={false}
          >
            <Package className="size-4" aria-hidden="true" />
            Back to Home
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-lg p-8 text-center">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
        <Clock className="size-6" aria-hidden="true" />
      </span>
      <h1 className="mt-5 font-display text-xl font-semibold text-brand-navy">
        {isExpired ? "Checkout expired" : "Payment is processing"}
      </h1>
      <p className="mt-2 text-sm leading-6 text-brand-ink-soft">
        {isExpired
          ? "Stripe closed this checkout before it was completed, so no payment was taken. Start a new checkout from your rentals."
          : "Stripe has not confirmed this payment yet. If you completed the card form, the status will update automatically once the webhook arrives."}
      </p>

      <div className="mt-4">
        <Alert variant="info">
          Current status:{" "}
          <strong className="font-semibold">
            {result.paymentStatus || "pending"}
          </strong>
          {result.sessionStatus ? ` · session ${result.sessionStatus}` : null}
        </Alert>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {isExpired ? null : (
          <Button
            className="gap-2 bg-brand-orange text-white hover:bg-brand-orange-strong"
            onClick={() => setAttempt((current) => current + 1)}
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            Check again
          </Button>
        )}
        <Button
          variant="outline"
          render={<Link href="/dashboard/customer/rentals" />}
          nativeButton={false}
        >
          Go to my rentals
        </Button>
      </div>
    </Card>
  )
}

function SuccessFallback() {
  return (
    <Card className="w-full max-w-lg p-8 text-center">
      <Skeleton className="mx-auto size-14 rounded-2xl" />
      <Skeleton className="mx-auto mt-5 h-6 w-52" />
      <Skeleton className="mx-auto mt-3 h-4 w-72" />
      <Skeleton className="mx-auto mt-6 h-9 w-40" />
    </Card>
  )
}

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4 sm:p-6">
      <Suspense fallback={<SuccessFallback />}>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  )
}
