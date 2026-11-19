"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  CalendarCheck,
  Check,
  CircleAlert,
  Loader2,
  MapPin,
  Package,
  RefreshCw,
  ShieldCheck,
  Tag,
  UserRound,
  Wrench,
} from "lucide-react"

import { BookingDialog } from "@/components/equipment/booking-dialog"
import { FavoriteToggle } from "@/components/equipment/favorite-toggle"
import { Alert } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { catalogApi, favoritesApi } from "@/lib/api/catalog"
import { useSession } from "@/lib/auth-client"
import { formatCurrency, rentalPeriodLabel } from "@/lib/rental"
import type { CatalogEquipment } from "@/lib/types/customer"
import { cn } from "@/lib/utils"

export function EquipmentDetails({ equipmentId }: { equipmentId: string }) {
  const router = useRouter()
  const { data: session, isPending: sessionPending } = useSession()
  const [equipment, setEquipment] = useState<CatalogEquipment | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)

    try {
      const data = await catalogApi.get(equipmentId)
      setEquipment(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "This equipment could not be loaded."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    catalogApi
      .get(equipmentId)
      .then((data) => {
        if (active) setEquipment(data)
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "This equipment could not be loaded."
          )
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [equipmentId])

  useEffect(() => {
    if (sessionPending) return

    if (!session?.user || session.user.role !== "customer") {
      return
    }

    let active = true

    favoritesApi
      .ids()
      .then((ids) => {
        if (active) setIsFavorite(ids.includes(equipmentId))
      })
      .catch(() => {
        if (active) setIsFavorite(false)
      })

    return () => {
      active = false
    }
  }, [sessionPending, session?.user, equipmentId])

  function handleBook() {
    if (!session?.user) {
      router.push(
        `/sign-in?redirectTo=${encodeURIComponent(`/equipment/${equipmentId}`)}`
      )
      return
    }

    setBookingOpen(true)
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-6 px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        <Skeleton className="h-9 w-56" />
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !equipment) {
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-20 text-center sm:px-8">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-navy-tint text-brand-navy">
          <CircleAlert className="size-6" aria-hidden="true" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold text-brand-navy">
          Equipment unavailable
        </h1>
        <p className="mt-2 text-sm leading-6 text-brand-ink-soft">
          {error ?? "This equipment is no longer available in the catalogue."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button variant="outline" onClick={() => void load()} className="gap-2">
            <RefreshCw className="size-4" aria-hidden="true" />
            Try again
          </Button>
          <Button
            className="gap-2 bg-brand-navy text-white hover:bg-brand-navy-soft"
            render={<Link href="/equipment" />}
            nativeButton={false}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to equipment
          </Button>
        </div>
      </div>
    )
  }

  const available = equipment.availableQuantity > 0
  const isCustomer = session?.user?.role === "customer"
  const signedOut = !sessionPending && !session?.user

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <Link
        href="/equipment"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy transition-colors outline-none hover:text-brand-orange focus-visible:rounded focus-visible:ring-2 focus-visible:ring-brand-orange"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to all equipment
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <div className="min-w-0">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-brand-navy-line bg-brand-navy-tint">
            {equipment.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={equipment.image}
                alt={equipment.name}
                className="size-full object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center text-brand-navy/40">
                <Package className="size-14" aria-hidden="true" />
              </span>
            )}

            <span
              className={cn(
                "absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow-sm",
                available ? "bg-emerald-600" : "bg-slate-500"
              )}
            >
              {available ? (
                <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
              ) : null}
              {available
                ? `${equipment.availableQuantity} unit${
                    equipment.availableQuantity === 1 ? "" : "s"
                  } available`
                : "Currently unavailable"}
            </span>
          </div>

          <div className="mt-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl font-bold tracking-[-0.02em] text-brand-navy sm:text-4xl">
                  {equipment.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge variant="brand">{equipment.category}</Badge>
                  <span className="inline-flex items-center gap-1.5 text-sm text-brand-ink-soft">
                    <MapPin className="size-4 text-brand-orange" aria-hidden="true" />
                    {equipment.location || "Location not specified"}
                  </span>
                </div>
              </div>

              <FavoriteToggle
                equipmentId={equipment.id}
                equipmentName={equipment.name}
                initialFavorite={isCustomer ? isFavorite : false}
                onChange={setIsFavorite}
                variant="button"
              />
            </div>

            <div className="mt-6 prose-sm max-w-none">
              <h2 className="font-display text-lg font-semibold text-brand-navy">
                Description
              </h2>
              <p className="mt-2 text-sm leading-7 whitespace-pre-line text-brand-ink-soft">
                {equipment.description || "No description has been provided."}
              </p>
            </div>

            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Brand", equipment.brand || "—"],
                ["Model", equipment.model || "—"],
                ["Condition", equipment.condition || "—"],
                ["Rental rate", `${formatCurrency(equipment.rentalPrice)} / ${rentalPeriodLabel(equipment.rentalType)}`],
                ["Owner", equipment.ownerName || "RentPro owner"],
                ["Total quantity", `${equipment.availableQuantity} unit${equipment.availableQuantity === 1 ? "" : "s"}`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-brand-navy-line bg-white px-4 py-3"
                >
                  <dt className="text-[11px] font-semibold tracking-[0.1em] text-brand-ink-soft uppercase">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-brand-navy">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            {equipment.terms ? (
              <div className="mt-6 rounded-2xl border border-brand-navy-line bg-brand-navy-tint/60 p-5">
                <h2 className="flex items-center gap-2 font-display text-sm font-semibold text-brand-navy">
                  <ShieldCheck className="size-4 text-brand-orange" aria-hidden="true" />
                  Rental terms
                </h2>
                <p className="mt-2 text-sm leading-6 whitespace-pre-line text-brand-ink-soft">
                  {equipment.terms}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <Card className="overflow-hidden">
            <div className="border-b border-brand-navy-line bg-brand-navy px-6 py-5 text-white">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-white/60 uppercase">
                Rental price
              </p>
              <p className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold">
                  {formatCurrency(equipment.rentalPrice)}
                </span>
                <span className="text-sm text-white/70">
                  / {rentalPeriodLabel(equipment.rentalType)}
                </span>
              </p>
            </div>

            <div className="space-y-4 p-6">
              <div className="flex items-center gap-2 text-sm text-brand-navy">
                <Tag className="size-4 text-brand-orange" aria-hidden="true" />
                <span className="font-medium">{equipment.category}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-navy">
                <Wrench className="size-4 text-brand-orange" aria-hidden="true" />
                <span>{equipment.brand || "Verified"} {equipment.model}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-navy">
                <UserRound className="size-4 text-brand-orange" aria-hidden="true" />
                <span className="truncate">{equipment.ownerName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-navy">
                <CalendarCheck className="size-4 text-brand-orange" aria-hidden="true" />
                <span>Live availability at checkout</span>
              </div>

              {signedOut ? (
                <Alert variant="info">
                  Sign in as a customer to book this equipment. You can browse
                  the full catalogue without an account.
                </Alert>
              ) : null}

              {session?.user && !isCustomer ? (
                <Alert variant="info">
                  You are signed in as {session.user.role}. Only customer
                  accounts can create rental bookings.
                </Alert>
              ) : null}

              <Button
                type="button"
                onClick={handleBook}
                disabled={!available || sessionPending}
                className="h-12 w-full gap-2 rounded-full bg-brand-orange text-base font-semibold text-white shadow-sm hover:bg-brand-orange-strong disabled:opacity-60"
              >
                {available ? (
                  signedOut ? (
                    <>
                      Sign in to book
                      <ArrowLeft className="size-4 rotate-180" aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      <CalendarCheck className="size-4" aria-hidden="true" />
                      Book this equipment
                    </>
                  )
                ) : (
                  "Currently unavailable"
                )}
              </Button>

              <p className="text-center text-[11px] leading-5 text-brand-ink-soft">
                Payment is processed securely by Stripe. Your booking is
                confirmed only after the server verifies the payment.
              </p>
            </div>
          </Card>

          {isCustomer ? (
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-brand-ink-soft">
              <Loader2 className="hidden" aria-hidden="true" />
              Your saved contact details are used to prefill the booking form.
            </p>
          ) : null}
        </aside>
      </div>

      {bookingOpen ? (
        <BookingDialog
          equipment={equipment}
          open={bookingOpen}
          onOpenChange={setBookingOpen}
        />
      ) : null}
    </div>
  )
}
