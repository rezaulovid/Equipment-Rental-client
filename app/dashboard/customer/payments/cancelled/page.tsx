"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  ClipboardList,
  Package,
  RefreshCw,
  ShieldAlert,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { customerApi } from "@/lib/api/customer"

type CancelState =
  | { phase: "loading" }
  | { phase: "missing" }
  | { phase: "done" }
  | { phase: "error"; message: string }

function PaymentCancelledContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("booking_id")?.trim() ?? ""
  const [state, setState] = useState<CancelState>({ phase: "loading" })

  useEffect(() => {
    if (!bookingId) {
      setState({ phase: "missing" })
      return
    }

    let active = true
    setState({ phase: "loading" })

    customerApi
      .cancelBooking(bookingId)
      .then(() => {
        if (active) setState({ phase: "done" })
      })
      .catch((error) => {
        if (active) {
          setState({
            phase: "error",
            message:
              error instanceof Error
                ? error.message
                : "The booking could not be released.",
          })
        }
      })

    return () => {
      active = false
    }
  }, [bookingId])

  if (state.phase === "loading") {
    return (
      <Card className="w-full max-w-lg p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-navy-tint text-brand-navy">
          <RefreshCw className="size-6 animate-spin" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-display text-xl font-semibold text-brand-navy">
          Releasing your booking
        </h1>
        <p className="mt-2 text-sm leading-6 text-brand-ink-soft">
          Stripe reported that the checkout was cancelled. We are releasing the
          held equipment now.
        </p>
      </Card>
    )
  }

  if (state.phase === "missing") {
    return (
      <Card className="w-full max-w-lg p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-navy-tint text-brand-navy">
          <XCircle className="size-6" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-display text-xl font-semibold text-brand-navy">
          Checkout was cancelled
        </h1>
        <p className="mt-2 text-sm leading-6 text-brand-ink-soft">
          No payment was taken. Unpaid bookings are released automatically, but
          this link did not include a booking reference.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            className="gap-2 bg-brand-orange text-white hover:bg-brand-orange-strong"
            render={<Link href="/equipment" />}
            nativeButton={false}
          >
            <Package className="size-4" aria-hidden="true" />
            Browse equipment
          </Button>
          <Button
            variant="outline"
            render={<Link href="/dashboard/customer/rentals" />}
            nativeButton={false}
          >
            My rentals
          </Button>
        </div>
      </Card>
    )
  }

  if (state.phase === "error") {
    return (
      <Card className="w-full max-w-lg p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
          <ShieldAlert className="size-6" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-display text-xl font-semibold text-brand-navy">
          We could not release the booking
        </h1>
        <p className="mt-2 text-sm leading-6 text-brand-ink-soft">
          {state.message} If you already paid, the rental stays intact — open
          your rentals to see the verified status.
        </p>
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
            render={<Link href="/equipment" />}
            nativeButton={false}
          >
            Browse equipment
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-lg p-8 text-center">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
        <XCircle className="size-6" aria-hidden="true" />
      </span>
      <h1 className="mt-5 font-display text-xl font-semibold text-brand-navy">
        Checkout cancelled
      </h1>
      <p className="mt-2 text-sm leading-6 text-brand-ink-soft">
        No payment was taken and the held equipment has been released. You can
        start a new booking whenever you are ready.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button
          className="gap-2 bg-brand-orange text-white hover:bg-brand-orange-strong"
          render={<Link href="/equipment" />}
          nativeButton={false}
        >
          <Package className="size-4" aria-hidden="true" />
          Book again
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

function CancelledFallback() {
  return (
    <Card className="w-full max-w-lg p-8 text-center">
      <Skeleton className="mx-auto size-14 rounded-2xl" />
      <Skeleton className="mx-auto mt-5 h-6 w-48" />
      <Skeleton className="mx-auto mt-3 h-4 w-72" />
      <Skeleton className="mx-auto mt-6 h-9 w-36" />
    </Card>
  )
}

export default function PaymentCancelledPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4 sm:p-6">
      <Suspense fallback={<CancelledFallback />}>
        <PaymentCancelledContent />
      </Suspense>
    </div>
  )
}
