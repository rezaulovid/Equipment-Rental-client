"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Check,
  MapPin,
  Package,
  RefreshCw,
  Tag,
} from "lucide-react"

import { FavoriteToggle } from "@/components/equipment/favorite-toggle"
import { SectionHeading } from "@/components/home/section-heading"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { catalogApi, favoritesApi } from "@/lib/api/catalog"
import { useSession } from "@/lib/auth-client"
import { useApiQuery } from "@/hooks/use-api-query"
import { formatCurrency, rentalPeriodLabel } from "@/lib/rental"
import { cn } from "@/lib/utils"

export function FeaturedEquipment() {
  const { data: equipmentData, error, loading, refetch } = useApiQuery(() =>
    catalogApi.list({ limit: "6", sort: "recent" })
  )
  const [favoriteData, setFavoriteData] = useState<{
    userId: string
    ids: Set<string>
  } | null>(null)
  const [favoriteErrorData, setFavoriteErrorData] = useState<{
    userId: string
    message: string
  } | null>(null)
  const { data: session, isPending: sessionPending } = useSession()
  const customerId =
    session?.user?.role === "customer" ? session.user.id : null
  const equipment = equipmentData ?? []
  const favoriteIds =
    customerId && favoriteData?.userId === customerId
      ? favoriteData.ids
      : new Set<string>()
  const favoriteError =
    customerId && favoriteErrorData?.userId === customerId
      ? favoriteErrorData.message
      : null

  useEffect(() => {
    if (sessionPending || !customerId) return

    let active = true
    favoritesApi
      .ids()
      .then((ids) => {
        if (active) {
          setFavoriteData({ userId: customerId, ids: new Set(ids) })
          setFavoriteErrorData(null)
        }
      })
      .catch((err) => {
        if (active) {
          setFavoriteErrorData({
            userId: customerId,
            message:
              err instanceof Error
                ? err.message
                : "Saved favorites could not be loaded.",
          })
        }
      })

    return () => {
      active = false
    }
  }, [sessionPending, customerId])

  function handleFavoriteChange(equipmentId: string, favorite: boolean) {
    if (!customerId) return

    setFavoriteData((current) => {
      const next = new Set<string>(
        current?.userId === customerId ? current.ids : []
      )
      if (favorite) next.add(equipmentId)
      else next.delete(equipmentId)
      return { userId: customerId, ids: next }
    })
  }

  return (
    <section
      aria-labelledby="featured-equipment-heading"
      className="bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            id="featured-equipment-heading"
            title="Featured Equipment"
            subtitle="Recently approved equipment, ready for your next project."
          />

          <Link
            href="/equipment"
            className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#071D49] px-5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 outline-none hover:bg-[#0C2B63] focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2 sm:self-auto"
          >
            View All
            <ArrowRight
              aria-hidden="true"
              strokeWidth={2.4}
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {favoriteError ? (
          <p role="alert" className="mt-4 text-sm text-red-700">
            Saved favorites could not be synchronized: {favoriteError}
          </p>
        ) : null}

        {error ? (
          <div className="mt-8">
            <Alert variant="error">
              <div className="flex flex-wrap items-center gap-3">
                <span>{error}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void refetch()}
                  disabled={loading}
                  className="gap-2 border-red-200 bg-white text-red-700 hover:bg-red-50"
                >
                  <RefreshCw
                    className={cn("size-4", loading && "animate-spin")}
                    aria-hidden="true"
                  />
                  Try again
                </Button>
              </div>
            </Alert>
          </div>
        ) : loading ? (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <li
                key={index}
                className="overflow-hidden rounded-2xl border border-[#E4EAF3] bg-white"
              >
                <Skeleton className="aspect-[16/10] w-full rounded-none" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </li>
            ))}
          </ul>
        ) : equipment.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-dashed border-[#D5DFEC] bg-[#F8FAFC] px-6 py-8 text-center text-sm text-slate-600">
            No approved equipment is available to feature yet.
          </p>
        ) : (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-6">
            {equipment.map((item) => {
              const isAvailable = item.availableQuantity > 0

              return (
                <li key={item.id} className="min-w-0">
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E4EAF3] bg-white shadow-[0_16px_36px_-30px_rgba(7,29,73,0.55)] transition duration-300 hover:-translate-y-1 hover:border-[#D8E2F0] hover:shadow-[0_26px_46px_-28px_rgba(7,29,73,0.5)]">
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#EEF3FA]">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          loading="lazy"
                        />
                      ) : (
                        <span className="flex size-full items-center justify-center text-[#071D49]/40">
                          <Package className="size-10" aria-hidden="true" />
                        </span>
                      )}

                      <FavoriteToggle
                        equipmentId={item.id}
                        equipmentName={item.name}
                        initialFavorite={favoriteIds.has(item.id)}
                        onChange={(favorite) =>
                          handleFavoriteChange(item.id, favorite)
                        }
                        className="absolute top-3 left-3"
                      />

                      <span
                        className={cn(
                          "absolute top-3 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm",
                          isAvailable ? "bg-[#16A34A]" : "bg-[#64748B]"
                        )}
                      >
                        {isAvailable ? (
                          <Check
                            aria-hidden="true"
                            className="size-3"
                            strokeWidth={3}
                          />
                        ) : null}
                        {isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-lg leading-6 font-semibold text-[#071D49] transition-colors group-hover:text-[#FF6B00]">
                        {item.name}
                      </h3>

                      <span className="mt-2.5 inline-flex w-fit items-center gap-1.5 rounded-md bg-[#FFF4EA] px-2 py-1 text-[11px] font-medium text-[#D95F00]">
                        <Tag
                          aria-hidden="true"
                          className="size-3"
                          strokeWidth={2.2}
                        />
                        {item.category}
                      </span>

                      <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin
                          aria-hidden="true"
                          className="size-3.5 shrink-0 text-[#FF6B00]"
                          strokeWidth={2.2}
                        />
                        {item.location || "Location not specified"}
                      </p>

                      <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#EEF2F8] pt-4">
                        <p className="flex items-baseline gap-1">
                          <span className="font-display text-xl leading-none font-bold text-[#071D49]">
                            {formatCurrency(item.rentalPrice)}
                          </span>
                          <span className="text-xs text-slate-500">
                            /{rentalPeriodLabel(item.rentalType)}
                          </span>
                        </p>

                        <Link
                          href={`/equipment/${item.id}`}
                          aria-label={`View details for ${item.name}`}
                          className="group/button inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#071D49] px-4 text-xs font-semibold text-white transition-colors duration-200 outline-none hover:bg-[#FF6B00] focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2"
                        >
                          View Details
                          <ArrowRight
                            aria-hidden="true"
                            strokeWidth={2.4}
                            className="size-3.5 transition-transform duration-200 group-hover/button:translate-x-0.5"
                          />
                        </Link>
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
