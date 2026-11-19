"use client"

import { useState } from "react"
import { CalendarDays, MapPin, Package, Pencil, ShieldCheck, Tag, Wrench } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { OwnerEquipment } from "@/lib/types/owner"
import { formatCurrency, rentalPeriodLabel } from "@/lib/rental"
import { EquipmentStatusBadge } from "../../admin/_components/status-badge"

/**
 * Read-only details dialog for an owner listing. Editing happens through the
 * owner update API and never touches the approval status.
 */
export function OwnerEquipmentDetailsDialog({
  equipment,
  onOpenChange,
  onEdit,
}: {
  equipment: OwnerEquipment | null
  onOpenChange: (open: boolean) => void
  onEdit: (equipment: OwnerEquipment) => void
}) {
  const [saving, setSaving] = useState(false)

  if (!equipment) {
    return (
      <Dialog open={false} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Equipment details</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  async function handleEdit() {
    setSaving(true)
    try {
      onEdit(equipment as OwnerEquipment)
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={Boolean(equipment)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="size-4 text-brand-orange" aria-hidden="true" />
            {equipment.name}
          </DialogTitle>
          <DialogDescription>
            Listing details for your equipment. Approved listings become visible
            in the public catalogue.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-brand-navy-line bg-brand-navy-tint/50 p-3">
            <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
              {equipment.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={equipment.image}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <Package className="size-5 text-brand-navy/40" aria-hidden="true" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-base font-semibold text-brand-navy">
                {equipment.name}
              </p>
              <p className="text-xs text-brand-ink-soft">
                {equipment.category || "Uncategorized"} · {equipment.location || "No location"}
              </p>
              <div className="mt-2">
                <EquipmentStatusBadge status={equipment.status} />
              </div>
            </div>
            <div className="text-right">
              <p className="font-display text-lg font-bold text-brand-navy">
                {formatCurrency(equipment.rentalPrice)}
              </p>
              <p className="text-xs text-brand-ink-soft">
                / {rentalPeriodLabel(equipment.rentalType)}
              </p>
            </div>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-brand-navy-line p-3">
              <dt className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-brand-ink-soft uppercase">
                <Tag className="size-3.5" aria-hidden="true" />
                Category
              </dt>
              <dd className="mt-1 text-sm text-brand-navy">
                {equipment.category || "—"}
              </dd>
            </div>

            <div className="rounded-xl border border-brand-navy-line p-3">
              <dt className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-brand-ink-soft uppercase">
                <MapPin className="size-3.5" aria-hidden="true" />
                Location
              </dt>
              <dd className="mt-1 text-sm text-brand-navy">
                {equipment.location || "—"}
              </dd>
            </div>

            <div className="rounded-xl border border-brand-navy-line p-3">
              <dt className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-brand-ink-soft uppercase">
                <CalendarDays className="size-3.5" aria-hidden="true" />
                Rental period
              </dt>
              <dd className="mt-1 text-sm text-brand-navy">
                {rentalPeriodLabel(equipment.rentalType)}
              </dd>
            </div>

            <div className="rounded-xl border border-brand-navy-line p-3">
              <dt className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-brand-ink-soft uppercase">
                <Wrench className="size-3.5" aria-hidden="true" />
                Condition
              </dt>
              <dd className="mt-1 text-sm text-brand-navy">
                {equipment.condition || "—"}
              </dd>
            </div>
          </dl>

          {equipment.brand || equipment.model ? (
            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-brand-navy-line p-3">
                <dt className="text-[11px] font-semibold tracking-[0.08em] text-brand-ink-soft uppercase">
                  Brand
                </dt>
                <dd className="mt-1 text-sm text-brand-navy">{equipment.brand || "—"}</dd>
              </div>
              <div className="rounded-xl border border-brand-navy-line p-3">
                <dt className="text-[11px] font-semibold tracking-[0.08em] text-brand-ink-soft uppercase">
                  Model
                </dt>
                <dd className="mt-1 text-sm text-brand-navy">{equipment.model || "—"}</dd>
              </div>
            </dl>
          ) : null}

          <div className="rounded-xl border border-brand-navy-line p-3">
            <dt className="text-[11px] font-semibold tracking-[0.08em] text-brand-ink-soft uppercase">
              Availability
            </dt>
            <dd className="mt-1 text-sm text-brand-navy">
              {equipment.availableQuantity} unit
              {equipment.availableQuantity === 1 ? "" : "s"} available
            </dd>
          </div>

          {equipment.description ? (
            <div className="rounded-xl border border-brand-navy-line p-3">
              <dt className="text-[11px] font-semibold tracking-[0.08em] text-brand-ink-soft uppercase">
                Description
              </dt>
              <dd className="mt-1 text-sm leading-6 text-brand-navy">
                {equipment.description}
              </dd>
            </div>
          ) : null}

          {equipment.terms ? (
            <div className="rounded-xl border border-brand-navy-line p-3">
              <dt className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-brand-ink-soft uppercase">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Rental terms
              </dt>
              <dd className="mt-1 text-sm leading-6 whitespace-pre-line text-brand-navy">
                {equipment.terms}
              </dd>
            </div>
          ) : null}

          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-brand-navy-line p-3">
              <dt className="text-[11px] font-semibold tracking-[0.08em] text-brand-ink-soft uppercase">
                Owner
              </dt>
              <dd className="mt-1 text-sm text-brand-navy">
                {equipment.ownerName || "You"}
              </dd>
              <dd className="text-xs text-brand-ink-soft">
                {equipment.ownerEmail || "—"}
              </dd>
            </div>
            <div className="rounded-xl border border-brand-navy-line p-3">
              <dt className="text-[11px] font-semibold tracking-[0.08em] text-brand-ink-soft uppercase">
                Submitted
              </dt>
              <dd className="mt-1 text-sm text-brand-navy">
                {equipment.createdAt ? new Date(equipment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
              </dd>
            </div>
          </dl>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            className="gap-2 bg-brand-orange text-white hover:bg-brand-orange-strong"
            onClick={() => void handleEdit()}
            disabled={saving}
          >
            <Pencil className="size-4" aria-hidden="true" />
            Edit listing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
