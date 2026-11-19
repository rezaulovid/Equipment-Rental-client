"use client"

import { Eye, Package, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { OwnerEquipment } from "@/lib/types/owner"
import { TableEmpty, TableLoading } from "../../admin/_components/state-panels"
import { EquipmentStatusBadge } from "../../admin/_components/status-badge"

const priceSuffix = {
  daily: "/ day",
  weekly: "/ week",
  monthly: "/ month",
} as const

export function OwnerEquipmentTable({
  items,
  loading,
  onView,
  onUpdate,
  onDelete,
}: {
  items: OwnerEquipment[]
  loading: boolean
  onView: (equipment: OwnerEquipment) => void
  onUpdate: (equipment: OwnerEquipment) => void
  onDelete: (equipment: OwnerEquipment) => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Equipment Image</TableHead>
          <TableHead>Equipment Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Rental Price</TableHead>
          <TableHead>Available Quantity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableLoading colSpan={7} rows={6} />
        ) : items.length === 0 ? (
          <TableEmpty
            colSpan={7}
            icon={Package}
            title="No equipment yet"
            description="Equipment you submit is listed here and starts as pending owner approval."
          />
        ) : (
          items.map((equipment) => (
            <TableRow key={equipment.id}>
              <TableCell>
                <span className="flex size-11 items-center justify-center overflow-hidden rounded-lg bg-brand-navy-tint">
                  {equipment.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={equipment.image}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <Package className="size-4 text-brand-navy/50" aria-hidden="true" />
                  )}
                </span>
              </TableCell>
              <TableCell>
                <div className="min-w-0">
                  <p className="truncate font-medium text-brand-navy">
                    {equipment.name}
                  </p>
                  <p className="mt-0.5 text-xs text-brand-ink-soft">
                    {[equipment.brand, equipment.model].filter(Boolean).join(" ") ||
                      equipment.location ||
                      "—"}
                  </p>
                </div>
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => onView(equipment)}
                  >
                    <Eye className="size-3.5" aria-hidden="true" />
                    View Details
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label={`Update ${equipment.name}`}
                    onClick={() => onUpdate(equipment)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label={`Delete ${equipment.name}`}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => onDelete(equipment)}
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
