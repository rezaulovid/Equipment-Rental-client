"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ownerApi } from "@/lib/api/owner"
import type { BookingStatus, OwnerRental } from "@/lib/types/owner"
import { useApiQuery } from "@/hooks/use-api-query"
import { AdminPageHeader } from "../../admin/_components/admin-page-header"
import { OwnerRentalDetailsDialog } from "../_components/owner-rental-details-dialog"
import { OwnerRentalsTable } from "../_components/owner-rentals-table"
import { ErrorPanel, InlineNotice } from "../../admin/_components/state-panels"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

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

export default function OwnerRequestsPage() {
  const { data, loading, error, refetch } = useApiQuery(() => ownerApi.getRentals())

  const [bookingFilter, setBookingFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<OwnerRental | null>(null)
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
        rental.customerName.toLowerCase().includes(query)

      return matchesBooking && matchesPayment && matchesQuery
    })
  }, [rentals, bookingFilter, paymentFilter, search])

  async function handleStatusChange(rental: OwnerRental, status: string) {
    setNotice(null)
    setUpdatingId(rental.id)

    try {
      const updated = await ownerApi.updateRentalStatus(
        rental.id,
        status as BookingStatus
      )

      setSelected((current) =>
        current && current.id === updated.id ? updated : current
      )

      setNotice({
        variant: "success",
        message: `${updated.equipmentName} is now ${updated.bookingStatus}.`,
      })
    } catch (err) {
      setNotice({
        variant: "error",
        message:
          err instanceof Error ? err.message : "The rental status could not be updated.",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-5 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="Rental requests"
        description="Bookings customers placed on your equipment. Manage the rental lifecycle or review the details of a request."
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
              placeholder="Search equipment or customer"
              className="h-9 pl-9"
              aria-label="Search rentals"
            />
          </div>
        </div>

        <OwnerRentalsTable
          rentals={filtered}
          loading={loading}
          updatingId={updatingId}
          onView={setSelected}
          onStatusChange={(rental, status) => void handleStatusChange(rental, status)}
        />
      </Card>

      <OwnerRentalDetailsDialog
        rental={selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      />
    </div>
  )
}
