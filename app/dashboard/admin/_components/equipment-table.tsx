"use client"

import { Check, Package, Pencil, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { AdminEquipment } from "@/lib/types/admin"
import { TableEmpty, TableLoading } from "./state-panels"
import { EquipmentStatusBadge } from "./status-badge"

const priceSuffix = {
  daily: "/ day",
  weekly: "/ week",
  monthly: "/ month",
} as const

export function EquipmentTable({
  items,
  loading,
  updatingId,
  onApprove,
  onReject,
  onEdit,
  onDelete,
}: {
  items: AdminEquipment[]
  loading: boolean
  updatingId: string | null
  onApprove: (equipment: AdminEquipment) => void
  onReject: (equipment: AdminEquipment) => void
  onEdit: (equipment: AdminEquipment) => void
  onDelete: (equipment: AdminEquipment) => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Equipment</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Rental price</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableLoading colSpan={7} />
        ) : items.length === 0 ? (
          <TableEmpty
            colSpan={7}
            icon={Package}
            title="No equipment to review"
            description="Equipment submitted by owners will show up here for approval."
          />
        ) : (
          items.map((equipment) => (
            <TableRow key={equipment.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-navy-tint text-brand-navy dark:bg-muted dark:text-foreground">
                    {equipment.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={equipment.image}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <Package className="size-4" aria-hidden="true" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{equipment.name}</p>
                    <p className="text-xs text-brand-ink-soft dark:text-muted-foreground">
                      {[equipment.brand, equipment.model]
                        .filter(Boolean)
                        .join(" ") || equipment.location || "—"}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="font-medium">{equipment.ownerName}</p>
                <p className="text-xs text-brand-ink-soft dark:text-muted-foreground">
                  {equipment.ownerEmail || "—"}
                </p>
              </TableCell>
              <TableCell className="text-brand-ink-soft dark:text-muted-foreground">
                {equipment.category}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                ${equipment.rentalPrice.toLocaleString()}
                <span className="text-xs text-brand-ink-soft dark:text-muted-foreground">
                  {" "}
                  {priceSuffix[equipment.rentalType]}
                </span>
              </TableCell>
              <TableCell>{equipment.availableQuantity}</TableCell>
              <TableCell>
                <EquipmentStatusBadge status={equipment.status} />
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1.5">
                  {equipment.status !== "approved" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={updatingId === equipment.id}
                      onClick={() => onApprove(equipment)}
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      <Check className="size-3.5" aria-hidden="true" />
                      Approve
                    </Button>
                  ) : null}
                  {equipment.status !== "rejected" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={updatingId === equipment.id}
                      onClick={() => onReject(equipment)}
                      className="border-amber-200 text-amber-700 hover:bg-amber-50"
                    >
                      <X className="size-3.5" aria-hidden="true" />
                      Reject
                    </Button>
                  ) : null}
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label={`Update ${equipment.name}`}
                    onClick={() => onEdit(equipment)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label={`Delete ${equipment.name}`}
                    onClick={() => onDelete(equipment)}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
