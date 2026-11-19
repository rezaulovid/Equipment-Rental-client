"use client"

import {
  CalendarDays,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  UserRound,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { OwnerRental } from "@/lib/types/owner"
import { formatCurrency, formatDate } from "@/lib/rental"
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "../../admin/_components/status-badge"

/**
 * Read-only rental details for an owner. Payment transactions are never
 * editable here — they are written by the verified payment flow only.
 */
export function OwnerRentalDetailsDialog({
  rental,
  onOpenChange,
}: {
  rental: OwnerRental | null
  onOpenChange: (open: boolean) => void
}) {
  if (!rental) {
    return null
  }

  return (
    <Dialog open={Boolean(rental)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="size-4 text-brand-orange" aria-hidden="true" />
            Rental details
          </DialogTitle>
          <DialogDescription>
            Booking reference #{rental.id.slice(-8).toUpperCase()}
          </DialogDescription>
        </DialogHeader>

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
                <Package className="size-5 text-brand-navy/40" aria-hidden="true" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-base font-semibold text-brand-navy">
                {rental.equipmentName}
              </p>
              <p className="text-xs text-brand-ink-soft">
                {rental.equipmentCategory} · {rental.quantity}{" "}
                {rental.quantity === 1 ? "unit" : "units"}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <PaymentStatusBadge status={rental.paymentStatus} />
              <BookingStatusBadge status={rental.bookingStatus} />
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
                {rental.durationDays} day{rental.durationDays === 1 ? "" : "s"} booked
              </dd>
            </div>

            <div className="rounded-xl border border-brand-navy-line p-3">
              <dt className="text-[11px] font-semibold tracking-[0.08em] text-brand-ink-soft uppercase">
                Booking amount
              </dt>
              <dd className="mt-1 font-display text-lg font-bold text-brand-navy">
                {formatCurrency(rental.totalAmount)}
              </dd>
              <dd className="text-xs text-brand-ink-soft">
                {rental.rentalType ?? "daily"} rate
                {rental.billableUnits ? ` · ${rental.billableUnits} billable unit(s)` : ""}
              </dd>
            </div>

            <div className="rounded-xl border border-brand-navy-line p-3">
              <dt className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-brand-ink-soft uppercase">
                <Phone className="size-3.5" aria-hidden="true" />
                Contact number
              </dt>
              <dd className="mt-1 text-sm text-brand-navy">{rental.contactNumber || "—"}</dd>
            </div>

            <div className="rounded-xl border border-brand-navy-line p-3">
              <dt className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-brand-ink-soft uppercase">
                <UserRound className="size-3.5" aria-hidden="true" />
                Customer
              </dt>
              <dd className="mt-1 text-sm text-brand-navy">{rental.customerName}</dd>
              <dd className="flex items-center gap-1 text-xs text-brand-ink-soft">
                <Mail className="size-3" aria-hidden="true" />
                {rental.customerEmail || "—"}
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

          <p className="rounded-xl border border-brand-navy-line bg-brand-navy-tint/60 p-3 text-[11px] leading-5 text-brand-ink-soft">
            Booked {formatDate(rental.createdAt)} · Owner {rental.ownerName || "You"}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
