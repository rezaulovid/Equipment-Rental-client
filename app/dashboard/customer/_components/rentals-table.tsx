"use client"

import { Eye, Loader2, Package, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { CustomerRental } from "@/lib/types/customer"
import { formatCurrency, formatDate } from "@/lib/rental"
import { TableEmpty, TableLoading } from "./state-panels"
import {
  CustomerBookingStatusBadge,
  CustomerPaymentStatusBadge,
} from "./status-badges"

export function RentalsTable({
  rentals,
  loading,
  payingId,
  onView,
  onPay,
}: {
  rentals: CustomerRental[]
  loading: boolean
  payingId: string | null
  onView: (rental: CustomerRental) => void
  onPay: (rental: CustomerRental) => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Equipment</TableHead>
          <TableHead>Equipment Name</TableHead>
          <TableHead>Rental Start</TableHead>
          <TableHead>Rental End</TableHead>
          <TableHead>Booking Date</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Booking</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableLoading colSpan={9} rows={6} />
        ) : rentals.length === 0 ? (
          <TableEmpty
            colSpan={9}
            icon={Package}
            title="No rental history"
            description="Your equipment bookings will appear here once you complete a checkout."
          />
        ) : (
          rentals.map((rental) => (
            <TableRow key={rental.id}>
              <TableCell>
                <span className="flex size-12 items-center justify-center overflow-hidden rounded-lg bg-brand-navy-tint">
                  {rental.equipmentImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={rental.equipmentImage}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <Package
                      className="size-4 text-brand-navy/50"
                      aria-hidden="true"
                    />
                  )}
                </span>
              </TableCell>
              <TableCell className="min-w-[180px]">
                <p className="font-medium text-brand-navy">
                  {rental.equipmentName}
                </p>
                <p className="mt-0.5 text-xs text-brand-ink-soft">
                  {rental.equipmentCategory || "Equipment"} · Qty{" "}
                  {rental.quantity}
                </p>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {formatDate(rental.startDate)}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {formatDate(rental.endDate)}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {formatDate(rental.createdAt)}
              </TableCell>
              <TableCell className="whitespace-nowrap font-semibold">
                {formatCurrency(rental.totalAmount)}
              </TableCell>
              <TableCell>
                <CustomerPaymentStatusBadge status={rental.paymentStatus} />
              </TableCell>
              <TableCell>
                <CustomerBookingStatusBadge status={rental.bookingStatus} />
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => onView(rental)}
                  >
                    <Eye className="size-3.5" aria-hidden="true" />
                    Details
                  </Button>
                  {rental.canPay ? (
                    <Button
                      size="sm"
                      className="gap-1.5 bg-brand-orange text-white hover:bg-brand-orange-strong"
                      onClick={() => onPay(rental)}
                      disabled={payingId === rental.id}
                    >
                      {payingId === rental.id ? (
                        <Loader2
                          className="size-3.5 animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <Wallet className="size-3.5" aria-hidden="true" />
                      )}
                      Pay now
                    </Button>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
