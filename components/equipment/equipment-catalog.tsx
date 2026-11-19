"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, PackageSearch, RefreshCw, Search, X } from "lucide-react"

import { EquipmentCard } from "@/components/equipment/equipment-card"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { catalogApi, favoritesApi } from "@/lib/api/catalog"
import { useSession } from "@/lib/auth-client"
import type { CatalogEquipment } from "@/lib/types/customer"
import { cn } from "@/lib/utils"

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function resolveInitialCategory(
  data: CatalogEquipment[],
  initialCategory: string
) {
  const requested = initialCategory.toLowerCase()
  if (!requested) return ""

  const match = data.find(
    (item) =>
      normalizeSlug(item.category) === requested ||
      normalizeSlug(item.category).startsWith(`${requested}-`) ||
      normalizeSlug(item.category).startsWith(requested)
  )

  return match?.category ?? ""
}

const NO_FAVORITES: ReadonlySet<string> = new Set()

export function EquipmentCatalog({ initialCategory = "" }: { initialCategory?: string }) {
  const router = useRouter()
  const { data: session, isPending: sessionPending } = useSession()
  const [items, setItems] = useState<CatalogEquipment[]>([])
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")

  async function load() {
    setLoading(true)
    setError(null)

    try {
      const data = await catalogApi.list()
      setItems(data)

      const requested = resolveInitialCategory(data, initialCategory)
      if (requested) setCategory(requested)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "The equipment catalogue could not be loaded."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    catalogApi
      .list()
      .then((data) => {
        if (!active) return
        setItems(data)

        const requested = resolveInitialCategory(data, initialCategory)
        if (requested) setCategory(requested)
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "The equipment catalogue could not be loaded."
          )
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [initialCategory])

  useEffect(() => {
    if (sessionPending) return
    if (!session?.user || session.user.role !== "customer") {
      return
    }

    let active = true

    favoritesApi
      .ids()
      .then((ids) => {
        if (active) setFavoriteIds(new Set(ids))
      })
      .catch(() => {
        if (active) setFavoriteIds(new Set())
      })

    return () => {
      active = false
    }
  }, [sessionPending, session?.user])

  const categories = useMemo(
    () =>
      [...new Set(items.map((item) => item.category).filter(Boolean))].sort(
        (a, b) => a.localeCompare(b)
      ),
    [items]
  )

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return items.filter((item) => {
      const matchesCategory = !category || item.category === category
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query) ||
        item.model.toLowerCase().includes(query)

      return matchesCategory && matchesQuery
    })
  }, [items, search, category])

  const visibleFavoriteIds =
    session?.user?.role === "customer" ? favoriteIds : NO_FAVORITES

  function handleFavoriteChange(equipmentId: string, favorite: boolean) {
    setFavoriteIds((current) => {
      const next = new Set(current)
      if (favorite) next.add(equipmentId)
      else next.delete(equipmentId)
      return next
    })
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-brand-orange uppercase">
            Live rental catalogue
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.02em] text-brand-navy sm:text-4xl">
            All Equipment
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-ink-soft">
            Approved equipment from verified owners. Choose your dates on the
            details page to see live availability and book securely.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => void load()}
          disabled={loading}
          className="w-fit gap-2"
        >
          <RefreshCw
            className={cn("size-4", loading && "animate-spin")}
            aria-hidden="true"
          />
          Refresh
        </Button>
      </div>

      <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-brand-navy-line bg-white p-4 shadow-xs sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-ink-soft"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search equipment, brand, model or location"
            aria-label="Search equipment"
            className="h-10 pr-9 pl-9"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-brand-ink-soft hover:text-brand-navy"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-2 text-xs text-brand-ink-soft">
          <PackageSearch className="size-4" aria-hidden="true" />
          {loading ? "Loading…" : `${filtered.length} item${filtered.length === 1 ? "" : "s"}`}
        </div>
      </div>

      {categories.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory("")}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2",
              !category
                ? "border-brand-navy bg-brand-navy text-white"
                : "border-brand-navy-line bg-white text-brand-navy hover:border-brand-navy/30"
            )}
          >
            All categories
          </button>
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2",
                category === item
                  ? "border-brand-navy bg-brand-navy text-white"
                  : "border-brand-navy-line bg-white text-brand-navy hover:border-brand-navy/30"
              )}
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-6">
        {error ? (
          <Alert variant="error">
            <div className="flex flex-wrap items-center gap-3">
              <span>{error}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => void load()}
                className="h-7 border-red-200 bg-white text-red-700 hover:bg-red-50"
              >
                Try again
              </Button>
            </div>
          </Alert>
        ) : loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-brand-navy-line bg-white"
              >
                <Skeleton className="aspect-[16/10] w-full rounded-none" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-brand-navy-line bg-white px-6 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-navy-tint text-brand-navy">
              <PackageSearch className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-display text-lg font-semibold text-brand-navy">
              No equipment found
            </h2>
            <p className="mt-1 max-w-sm text-sm leading-6 text-brand-ink-soft">
              Try a different search term or category. New equipment is added
              as owners list it.
            </p>
            {(search || category) && (
              <Button
                variant="outline"
                className="mt-5 gap-2"
                onClick={() => {
                  setSearch("")
                  setCategory("")
                }}
              >
                <X className="size-4" aria-hidden="true" />
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((equipment) => (
              <EquipmentCard
                key={equipment.id}
                equipment={equipment}
                isFavorite={visibleFavoriteIds.has(equipment.id)}
                onFavoriteChange={(favorite) =>
                  handleFavoriteChange(equipment.id, favorite)
                }
              />
            ))}
          </div>
        )}
      </div>

      {!loading && !error && filtered.length > 0 ? (
        <p className="mt-6 flex items-center gap-2 text-xs text-brand-ink-soft">
          <Loader2 className="hidden" aria-hidden="true" />
          Showing equipment approved by the RentPro admin team. Sign in as a
          customer to save favorites and book.
        </p>
      ) : null}

      {session?.user && session.user.role !== "customer" ? (
        <p className="mt-4 rounded-xl border border-brand-navy-line bg-brand-navy-tint px-4 py-3 text-xs text-brand-navy">
          You are signed in as {session.user.role}. Equipment booking is only
          available to customer accounts.{" "}
          <button
            type="button"
            onClick={() => router.push(`/dashboard/${session.user.role}`)}
            className="font-semibold underline underline-offset-4"
          >
            Go to your dashboard
          </button>
        </p>
      ) : null}
    </div>
  )
}
