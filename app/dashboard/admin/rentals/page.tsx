"use client"

import { useMemo, useState } from "react"
import { RefreshCw, Search } from "lucide-react"

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
import { adminApi } from "@/lib/api/admin"
import type { AdminRental, BookingStatus } from "@/lib/types/admin"
import { useApiQuery } from "@/hooks/use-api-query"
import { AdminPageHeader } from "../_components/admin-page-header"
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
  { value: "unpaid", label: "Unpaid" },
  { value: "pending", label: "Pending" },
  { value: "refunded", label: "Refunded" },
]

export default function AdminRentalsPage() {
  const { data, loading, error, refetch, setData } = useApiQuery(() =>
    adminApi.getRentals()
  )

  const [bookingFilter, setBookingFilter] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [search, setSearch] = useState("")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [notice, setNotice] = useState<{
    variant: "success" | "error"
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
        rental.customerName.toLowerCase().includes(query) ||
        rental.ownerName.toLowerCase().includes(query)

      return matchesBooking && matchesPayment && matchesQuery
    })
  }, [rentals, bookingFilter, paymentFilter, search])

  async function handleStatusChange(
    rental: AdminRental,
    status: BookingStatus
  ) {
    setNotice(null)
    setUpdatingId(rental.id)

    try {
      const updated = await adminApi.updateRentalStatus(rental.id, status)
      setData(
        rentals.map((item) => (item.id === updated.id ? updated : item))
      )
      setNotice({
        variant: "success",
        message: `${updated.equipmentName} is now ${updated.bookingStatus}.`,
      })
    } catch (err) {
      setNotice({
        variant: "error",
        message:
          err instanceof Error
            ? err.message
            : "The booking status could not be updated.",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-5 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="All rentals"
        description="Monitor every booking, its payment state and the rental lifecycle. Completed and cancelled rentals are final."
        actions={
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
        }
      />

      {error ? <ErrorPanel message={error} onRetry={() => void refetch()} /> : null}
      {notice ? (
        <InlineNotice
          variant={notice.variant}
          message={notice.message}
          onDismiss={() => setNotice(null)}
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
              placeholder="Search equipment, customer or owner"
              className="h-9 pl-9"
              aria-label="Search rentals"
            />
          </div>
        </div>

        <RentalsTable
          rentals={filtered}
          loading={loading}
          updatingId={updatingId}
          onStatusChange={(rental, status) =>
            void handleStatusChange(rental, status)
          }
        />
      </Card>

      <p className="text-xs text-brand-ink-soft dark:text-muted-foreground">
        Showing {filtered.length} of {rentals.length} rental records. Payment
        status is never editable here — it is written by the payment flow.
      </p>
    </div>
  )
}
