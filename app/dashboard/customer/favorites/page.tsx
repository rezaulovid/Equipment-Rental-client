"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, Package, RefreshCw, Trash2 } from "lucide-react"

import { EquipmentCard } from "@/components/equipment/equipment-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { favoritesApi } from "@/lib/api/catalog"
import { useApiQuery } from "@/hooks/use-api-query"
import { CustomerPageHeader } from "../_components/customer-page-header"
import { ErrorPanel, InlineNotice } from "../_components/state-panels"

export default function CustomerFavoritesPage() {
  const { data, loading, error, refetch, setData } = useApiQuery(() =>
    favoritesApi.list()
  )
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [notice, setNotice] = useState<{
    variant: "success" | "error"
    message: string
  } | null>(null)

  const favorites = data ?? []

  async function removeFavorite(equipmentId: string, equipmentName: string) {
    if (removingId) return

    setRemovingId(equipmentId)
    setNotice(null)

    try {
      await favoritesApi.remove(equipmentId)
      setData(favorites.filter((item) => item.id !== equipmentId))
      setNotice({
        variant: "success",
        message: `${equipmentName} was removed from your favorites.`,
      })
    } catch (err) {
      setNotice({
        variant: "error",
        message:
          err instanceof Error
            ? err.message
            : "The favorite could not be removed.",
      })
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-5 p-4 sm:p-6 lg:p-8">
      <CustomerPageHeader
        title="Favorites"
        description="Equipment you saved for later. Favorites stay on your account after signing out and back in."
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => void refetch()}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw
                className={`size-4 ${loading ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              Refresh
            </Button>
            <Button
              className="gap-2 bg-brand-orange text-white hover:bg-brand-orange-strong"
              render={<Link href="/equipment" />}
              nativeButton={false}
            >
              <Package className="size-4" aria-hidden="true" />
              Browse equipment
            </Button>
          </>
        }
      />

      {error ? (
        <ErrorPanel message={error} onRetry={() => void refetch()} />
      ) : null}
      {notice ? (
        <InlineNotice
          variant={notice.variant}
          message={notice.message}
          onDismiss={() => setNotice(null)}
        />
      ) : null}

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-brand-navy-line bg-white"
            >
              <Skeleton className="aspect-[16/10] w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-brand-navy-line bg-white px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-orange-soft text-brand-orange-deep">
            <Heart className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-display text-lg font-semibold text-brand-navy">
            No favorites yet
          </h2>
          <p className="mt-1 max-w-sm text-sm leading-6 text-brand-ink-soft">
            Tap the heart on any equipment card to save it here for later.
          </p>
          <Button
            className="mt-5 gap-2 bg-brand-orange text-white hover:bg-brand-orange-strong"
            render={<Link href="/equipment" />}
            nativeButton={false}
          >
            <Package className="size-4" aria-hidden="true" />
            Explore equipment
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((equipment) => (
              <EquipmentCard
                key={equipment.id}
                equipment={equipment}
                isFavorite
                onFavoriteChange={(favorite) => {
                  if (!favorite) {
                    setData(
                      favorites.filter((item) => item.id !== equipment.id)
                    )
                  }
                }}
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1.5 rounded-full border-red-200 px-3 text-xs text-red-700 hover:bg-red-50"
                    onClick={() =>
                      void removeFavorite(equipment.id, equipment.name)
                    }
                    disabled={removingId === equipment.id}
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                    {removingId === equipment.id ? "Removing…" : "Remove"}
                  </Button>
                }
              />
            ))}
          </div>

          <p className="text-xs text-brand-ink-soft">
            {favorites.length} saved item{favorites.length === 1 ? "" : "s"}.
            Equipment only appears while it is approved and visible in the
            catalogue.
          </p>
        </>
      )}
    </div>
  )
}
