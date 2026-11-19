"use client"

import { ClipboardList } from "lucide-react"

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
import type { AdminRental, BookingStatus } from "@/lib/types/admin"
import { TableEmpty, TableLoading } from "./state-panels"
import { BookingStatusBadge, PaymentStatusBadge } from "./status-badge"

const transitions: Record<BookingStatus, BookingStatus[]> = {
  pending: ["active", "cancelled"],
  active: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
}

const statusLabels: Record<BookingStatus, string> = {
  pending: "Pending",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
}

function formatDate(value: string | null) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function RentalsTable({
  rentals,
  loading,
  updatingId,
  onStatusChange,
}: {
  rentals: AdminRental[]
  loading: boolean
  updatingId: string | null
  onStatusChange: (rental: AdminRental, status: BookingStatus) => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Equipment</TableHead>
          <TableHead>Rental period</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Booking</TableHead>
          <TableHead className="text-right">Update</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableLoading colSpan={9} />
        ) : rentals.length === 0 ? (
          <TableEmpty
            colSpan={9}
            icon={ClipboardList}
            title="No rentals yet"
            description="Customer bookings will appear here once equipment starts being rented."
          />
        ) : (
          rentals.map((rental) => {
            const options = [rental.bookingStatus, ...transitions[rental.bookingStatus]]
            const terminal = transitions[rental.bookingStatus].length === 0

            return (
              <TableRow key={rental.id}>
                <TableCell>
                  <p className="font-medium">{rental.customerName}</p>
                  <p className="text-xs text-brand-ink-soft dark:text-muted-foreground">
                    {rental.customerEmail || "—"}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{rental.ownerName}</p>
                  <p className="text-xs text-brand-ink-soft dark:text-muted-foreground">
                    {rental.ownerEmail || "—"}
                  </p>
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <p className="truncate font-medium">{rental.equipmentName}</p>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <p className="text-[13px]">{formatDate(rental.startDate)}</p>
                  <p className="text-xs text-brand-ink-soft dark:text-muted-foreground">
                    to {formatDate(rental.endDate)} · {rental.durationDays}d
                  </p>
                </TableCell>
                <TableCell>{rental.quantity}</TableCell>
                <TableCell className="whitespace-nowrap font-medium">
                  ${rental.totalAmount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <PaymentStatusBadge status={rental.paymentStatus} />
                </TableCell>
                <TableCell>
                  <BookingStatusBadge status={rental.bookingStatus} />
                </TableCell>
                <TableCell className="text-right">
                  <Select
                    items={options.map((status) => ({
                      value: status,
                      label: statusLabels[status],
                    }))}
                    value={rental.bookingStatus}
                    disabled={terminal || updatingId === rental.id}
                    onValueChange={(value) => {
                      if (value && value !== rental.bookingStatus) {
                        onStatusChange(rental, value as BookingStatus)
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 w-[132px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((status) => (
                        <SelectItem key={status} value={status}>
                          {statusLabels[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
