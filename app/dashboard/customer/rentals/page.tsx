"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Package, RefreshCw, Search, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { customerApi } from "@/lib/api/customer"
import {
  showBookingRequestError,
  showPreparingPaymentToast,
  showRedirectingToPaymentToast,
} from "@/lib/notifications"
import type { CustomerRental } from "@/lib/types/customer"
import { useApiQuery } from "@/hooks/use-api-query"
import { CustomerPageHeader } from "../_components/customer-page-header"
import { RentalDetailsDialog } from "../_components/rental-details-dialog"
import { RentalsTable } from "../_components/rentals-table"
import { ErrorPanel, InlineNotice } from "../_components/state-panels"

const bookingFilters = [
  { value: "all", label: "All bookings" },
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

const paymentFilters = [
  { value: "all", label: "All payments" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "unpaid", label: "Unpaid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
]

export default function CustomerRentalsPage() {
  const { data, loading, error, refetch } = useApiQuery(() =>
    customerApi.getRentals()
  )

  const [bookingFilter, setBookingFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<CustomerRental | null>(null)
  const [payingId, setPayingId] = useState<string | null>(null)
  const [notice, setNotice] = useState<{
    variant: "success" | "error" | "info"
    message: string
  } | null>(null)

  const rentals = useMemo(() => data ?? [], [data])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return rentals.filter((rental) => {
      const matchesBooking =
        bookingFilter === "all" || rental.bookingStatus === bookingFilter
      const matchesPayment =
        paymentFilter === "all" || rental.paymentStatus === paymentFilter
      const matchesQuery =
        !query ||
        rental.equipmentName.toLowerCase().includes(query) ||
        rental.ownerName.toLowerCase().includes(query)

      return matchesBooking && matchesPayment && matchesQuery
    })
  }, [rentals, bookingFilter, paymentFilter, search])

  async function handlePay(rental: CustomerRental) {
    if (payingId) return

    setNotice(null)
    setPayingId(rental.id)
    showPreparingPaymentToast()

    try {
      const result = await customerApi.retryCheckout(rental.id)
      if (!result.checkoutUrl) {
        throw new Error("Stripe did not return a checkout link.")
      }
      showRedirectingToPaymentToast()
      window.location.assign(result.checkoutUrl)
    } catch (err) {
      setNotice({
        variant: "error",
        message:
          err instanceof Error
            ? err.message
            : "The payment could not be started.",
      })
      showBookingRequestError(err)
      setPayingId(null)
    }
  }

  const awaitingPayment = rentals.filter((rental) => rental.canPay).length

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-5 p-4 sm:p-6 lg:p-8">
      <CustomerPageHeader
        title="My rentals"
        description="Every booking on your account, with its real payment and booking status. Payments are confirmed by Stripe's verified webhook."
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => void refetch()}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw
                className={`size-4 ${loading ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              Refresh
            </Button>
            <Button
              className="gap-2 bg-brand-orange text-white hover:bg-brand-orange-strong"
              render={<Link href="/equipment" />}
              nativeButton={false}
            >
              <Package className="size-4" aria-hidden="true" />
              Rent equipment
            </Button>
          </>
        }
      />

      {error ? (
        <ErrorPanel message={error} onRetry={() => void refetch()} />
      ) : null}
      {notice ? (
        <InlineNotice
          variant={notice.variant}
          message={notice.message}
          onDismiss={() => setNotice(null)}
        />
      ) : null}

      {awaitingPayment > 0 ? (
        <InlineNotice
          variant="info"
          message={`${awaitingPayment} rental${awaitingPayment === 1 ? "" : "s"} still ${
            awaitingPayment === 1 ? "needs" : "need"
          } payment. Use “Pay now” to reopen Stripe Checkout.`}
        />
      ) : null}

      <Card>
        <div className="flex flex-col gap-3 border-b border-brand-navy-line p-4 lg:flex-row lg:items-center lg:justify-between dark:border-border">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select
              items={bookingFilters}
              value={bookingFilter}
              onValueChange={(value) => value && setBookingFilter(value)}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bookingFilters.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              items={paymentFilters}
              value={paymentFilter}
              onValueChange={(value) => value && setPaymentFilter(value)}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentFilters.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative w-full lg:max-w-xs">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-ink-soft"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search equipment or owner"
              className="h-9 pl-9"
              aria-label="Search rentals"
            />
          </div>
        </div>

        <RentalsTable
          rentals={filtered}
          loading={loading}
          payingId={payingId}
          onView={setSelected}
          onPay={(rental) => {
            setSelected(null)
            void handlePay(rental)
          }}
        />
      </Card>

      <p className="flex flex-wrap items-center gap-2 text-xs text-brand-ink-soft">
        <Wallet className="size-3.5" aria-hidden="true" />
        Showing {filtered.length} of {rentals.length} rental records. Payment
        amounts are recalculated by the server at checkout and cannot be edited
        here.
      </p>

      <RentalDetailsDialog
        rental={selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
        onPay={(rental) => {
          setSelected(null)
          void handlePay(rental)
        }}
        paying={Boolean(payingId)}
      />
    </div>
  )
}
