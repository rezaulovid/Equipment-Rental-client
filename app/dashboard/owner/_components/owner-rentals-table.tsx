"use client"

import { ClipboardList, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { OwnerRental } from "@/lib/types/owner"
import { formatCurrency, formatDate } from "@/lib/rental"
import { TableEmpty, TableLoading } from "../../admin/_components/state-panels"
import { BookingStatusBadge, PaymentStatusBadge } from "../../admin/_components/status-badge"

const transitions: Record<string, string[]> = {
  pending: ["active", "cancelled"],
  active: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
}

export function OwnerRentalsTable({
  rentals,
  loading,
  updatingId,
  onView,
  onStatusChange,
}: {
  rentals: OwnerRental[]
  loading: boolean
  updatingId: string | null
  onView: (rental: OwnerRental) => void
  onStatusChange: (rental: OwnerRental, status: string) => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer Information</TableHead>
          <TableHead>Equipment Information</TableHead>
          <TableHead>Rental Start Date</TableHead>
          <TableHead>Rental End Date</TableHead>
          <TableHead>Required Quantity</TableHead>
          <TableHead>Booking Amount</TableHead>
          <TableHead>Payment Status</TableHead>
          <TableHead>Booking Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableLoading colSpan={9} rows={6} />
        ) : rentals.length === 0 ? (
          <TableEmpty
            colSpan={9}
            icon={ClipboardList}
            title="No rental requests"
            description="Rental requests for your equipment will appear here once customers book."
          />
        ) : (
          rentals.map((rental) => {
            const options = [rental.bookingStatus, ...transitions[rental.bookingStatus] ?? []]
            const terminal = (transitions[rental.bookingStatus] ?? []).length === 0

            return (
              <TableRow key={rental.id}>
                <TableCell>
                  <p className="font-medium text-brand-navy">{rental.customerName}</p>
                  <p className="text-xs text-brand-ink-soft dark:text-muted-foreground">
                    {rental.customerEmail || "—"}
                  </p>
                  <p className="mt-0.5 text-xs text-brand-ink-soft dark:text-muted-foreground">
                    {rental.contactNumber || "—"}
                  </p>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-navy-tint">
                      {rental.equipmentImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={rental.equipmentImage}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        <ClipboardList className="size-4 text-brand-navy/50" aria-hidden="true" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-brand-navy">
                        {rental.equipmentName}
                      </p>
                      <p className="mt-0.5 text-xs text-brand-ink-soft">
                        {rental.equipmentCategory || "Equipment"}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="whitespace-nowrap">
                  {formatDate(rental.startDate)}
                </TableCell>

                <TableCell className="whitespace-nowrap">
                  {formatDate(rental.endDate)}
                </TableCell>

                <TableCell>{rental.quantity}</TableCell>

                <TableCell className="whitespace-nowrap font-semibold">
                  {formatCurrency(rental.totalAmount)}
                </TableCell>

                <TableCell>
                  <PaymentStatusBadge status={rental.paymentStatus} />
                </TableCell>

                <TableCell>
                  <BookingStatusBadge status={rental.bookingStatus} />
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => onView(rental)}
                    >
                      <Eye className="size-3.5" aria-hidden="true" />
                      Details
                    </Button>

                    <Select
                      items={options.map((status) => ({
                        value: status,
                        label: statusLabels[status] ?? status,
                      }))}
                      value={rental.bookingStatus}
                      disabled={terminal || updatingId === rental.id}
                      onValueChange={(value) => {
                        if (value && value !== rental.bookingStatus) {
                          onStatusChange(rental, value)
                        }
                      }}
                    >
                      <SelectTrigger className="h-8 w-[132px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((status) => (
                          <SelectItem key={status} value={status}>
                            {statusLabels[status] ?? status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
