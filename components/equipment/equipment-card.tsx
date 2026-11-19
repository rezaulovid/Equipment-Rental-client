import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowRight, Check, MapPin, Package, Tag } from "lucide-react"

import { FavoriteToggle } from "@/components/equipment/favorite-toggle"
import type { CatalogEquipment } from "@/lib/types/customer"
import { formatCurrency, rentalPeriodLabel } from "@/lib/rental"
import { cn } from "@/lib/utils"

export function EquipmentCard({
  equipment,
  isFavorite = false,
  onFavoriteChange,
  action,
}: {
  equipment: CatalogEquipment
  isFavorite?: boolean
  onFavoriteChange?: (favorite: boolean) => void
  action?: ReactNode
}) {
  const available = equipment.availableQuantity > 0

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-navy-line bg-white shadow-[0_16px_36px_-30px_rgba(7,29,73,0.55)] transition duration-300 hover:-translate-y-1 hover:border-brand-orange/30 hover:shadow-[0_26px_46px_-28px_rgba(7,29,73,0.5)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-navy-tint">
        {equipment.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={equipment.image}
            alt={equipment.name}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-brand-navy/40">
            <Package className="size-10" aria-hidden="true" />
          </span>
        )}

        <FavoriteToggle
          equipmentId={equipment.id}
          equipmentName={equipment.name}
          initialFavorite={isFavorite}
          onChange={onFavoriteChange}
          className="absolute top-3 left-3"
        />

        <span
          className={cn(
            "absolute top-3 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm",
            available ? "bg-emerald-600" : "bg-slate-500"
          )}
        >
          {available ? (
            <Check className="size-3" strokeWidth={3} aria-hidden="true" />
          ) : null}
          {available ? "Available" : "Unavailable"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg leading-6 font-semibold text-brand-navy transition-colors group-hover:text-brand-orange-deep">
          {equipment.name}
        </h3>

        <span className="mt-2.5 inline-flex w-fit items-center gap-1.5 rounded-md bg-brand-orange-soft px-2 py-1 text-[11px] font-medium text-brand-orange-deep">
          <Tag aria-hidden="true" className="size-3" strokeWidth={2.2} />
          {equipment.category}
        </span>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-brand-ink-soft">
          <MapPin
            aria-hidden="true"
            className="size-3.5 shrink-0 text-brand-orange"
            strokeWidth={2.2}
          />
          {equipment.location || "Location not specified"}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-brand-navy-line pt-4">
          <p className="flex items-baseline gap-1">
            <span className="font-display text-xl leading-none font-bold text-brand-navy">
              {formatCurrency(equipment.rentalPrice)}
            </span>
            <span className="text-xs text-brand-ink-soft">
              /{rentalPeriodLabel(equipment.rentalType)}
            </span>
          </p>

          <span className="text-[11px] font-medium text-brand-ink-soft">
            {equipment.availableQuantity} available
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link
            href={`/equipment/${equipment.id}`}
            aria-label={`View details for ${equipment.name}`}
            className="group/button inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-brand-navy px-4 text-xs font-semibold text-white transition-colors outline-none hover:bg-brand-orange focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
          >
            View Equipment
            <ArrowRight
              aria-hidden="true"
              strokeWidth={2.4}
              className="size-3.5 transition-transform duration-200 group-hover/button:translate-x-0.5"
            />
          </Link>
          {action}
        </div>
      </div>
    </article>
  )
}
