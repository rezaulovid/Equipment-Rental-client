"use client"

import {
  CalendarDays,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  UserRound,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ReviewForm } from "@/components/dashboard/customer/review-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { CustomerRental } from "@/lib/types/customer"
import { formatCurrency, formatDate } from "@/lib/rental"
import {
  CustomerBookingStatusBadge,
  CustomerPaymentStatusBadge,
} from "./status-badges"

export function RentalDetailsDialog({
  rental,
  onOpenChange,
  onPay,
  paying,
}: {
  rental: CustomerRental | null
  onOpenChange: (open: boolean) => void
  onPay: (rental: CustomerRental) => void
  paying: boolean
}) {
  return (
    <Dialog open={Boolean(rental)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="size-4 text-brand-orange" aria-hidden="true" />
            Rental details
          </DialogTitle>
          <DialogDescription>
            Booking reference #{rental?.id.slice(-8).toUpperCase()}
          </DialogDescription>
        </DialogHeader>

        {rental ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-brand-navy-line bg-brand-navy-tint/50 p-3">
              <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                {rental.equipmentImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={rental.equipmentImage}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <Package
                    className="size-5 text-brand-navy/40"
                    aria-hidden="true"
                  />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-semibold text-brand-navy">
                  {rental.equipmentName}
                </p>
                <p className="text-xs text-brand-ink-soft">
                  {rental.equipmentCategory} · Owner {rental.ownerName}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <CustomerPaymentStatusBadge status={rental.paymentStatus} />
                <CustomerBookingStatusBadge status={rental.bookingStatus} />
              </div>
            </div>

            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-brand-navy-line p-3">
                <dt className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-brand-ink-soft uppercase">
                  <CalendarDays className="size-3.5" aria-hidden="true" />
                  Rental period
                </dt>
                <dd className="mt-1 text-sm text-brand-navy">
                  {formatDate(rental.startDate)} → {formatDate(rental.endDate)}
                </dd>
                <dd className="text-xs text-brand-ink-soft">
                  {rental.durationDays} day
                  {rental.durationDays === 1 ? "" : "s"} · {rental.quantity}{" "}
                  unit{rental.quantity === 1 ? "" : "s"}
                </dd>
              </div>

              <div className="rounded-xl border border-brand-navy-line p-3">
                <dt className="text-[11px] font-semibold tracking-[0.08em] text-brand-ink-soft uppercase">
                  Total amount
                </dt>
                <dd className="mt-1 font-display text-lg font-bold text-brand-navy">
                  {formatCurrency(rental.totalAmount)}
                </dd>
                <dd className="text-xs text-brand-ink-soft">
                  Booked {formatDate(rental.createdAt)}
                </dd>
              </div>

              <div className="rounded-xl border border-brand-navy-line p-3">
                <dt className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-brand-ink-soft uppercase">
                  <Phone className="size-3.5" aria-hidden="true" />
                  Contact number
                </dt>
                <dd className="mt-1 text-sm text-brand-navy">
                  {rental.contactNumber || "—"}
                </dd>
              </div>

              <div className="rounded-xl border border-brand-navy-line p-3">
                <dt className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-brand-ink-soft uppercase">
                  <UserRound className="size-3.5" aria-hidden="true" />
                  Owner
                </dt>
                <dd className="mt-1 text-sm text-brand-navy">
                  {rental.ownerName}
                </dd>
                <dd className="truncate text-xs text-brand-ink-soft">
                  {rental.ownerEmail}
                </dd>
              </div>

              <div className="rounded-xl border border-brand-navy-line p-3 sm:col-span-2">
                <dt className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-brand-ink-soft uppercase">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  Delivery address
                </dt>
                <dd className="mt-1 text-sm leading-6 text-brand-navy">
                  {rental.deliveryAddress || "—"}
                </dd>
              </div>

              {rental.notes ? (
                <div className="rounded-xl border border-brand-navy-line p-3 sm:col-span-2">
                  <dt className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-brand-ink-soft uppercase">
                    <MessageSquare className="size-3.5" aria-hidden="true" />
                    Additional notes
                  </dt>
                  <dd className="mt-1 text-sm leading-6 whitespace-pre-line text-brand-navy">
                    {rental.notes}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        ) : null}

        {rental?.bookingStatus === "completed" &&
        rental.paymentStatus === "paid" ? (
          <ReviewForm bookingId={rental.id} />
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {rental?.canPay ? (
            <Button
              className="bg-brand-orange text-white hover:bg-brand-orange-strong"
              onClick={() => onPay(rental)}
              disabled={paying}
            >
              {paying ? "Opening checkout…" : "Continue to payment"}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
