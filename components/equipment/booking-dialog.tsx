"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CalendarDays,
  Info,
  Loader2,
  Lock,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  ShoppingCart,
} from "lucide-react"

import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { catalogApi } from "@/lib/api/catalog"
import { customerApi } from "@/lib/api/customer"
import { useSession } from "@/lib/auth-client"
import {
  estimateRentalTotal,
  formatCurrency,
  parseInputDate,
  rentalPeriodLabel,
  todayInputValue,
} from "@/lib/rental"
import type {
  CatalogEquipment,
  EquipmentAvailability,
} from "@/lib/types/customer"
import {
  buildBookingInput,
  validateBookingForm,
  type FieldErrors,
} from "@/lib/validation"

type BookingValues = {
  startDate: string
  endDate: string
  quantity: number
  contactNumber: string
  deliveryAddress: string
  notes: string
}

const INITIAL_VALUES: BookingValues = {
  startDate: "",
  endDate: "",
  quantity: 1,
  contactNumber: "",
  deliveryAddress: "",
  notes: "",
}

export function BookingDialog({
  equipment,
  open,
  onOpenChange,
}: {
  equipment: CatalogEquipment
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const { data: session } = useSession()
  const [values, setValues] = useState<BookingValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [availability, setAvailability] =
    useState<EquipmentAvailability | null>(null)
  const [checking, setChecking] = useState(false)

  const isCustomer = session?.user?.role === "customer"
  const customerId = isCustomer ? session?.user?.id : undefined

  // Prefill the delivery details from the customer profile stored by the API.
  useEffect(() => {
    if (!open || !customerId) return

    let active = true

    customerApi
      .getProfile()
      .then((profile) => {
        if (!active) return

        setValues((current) => ({
          ...current,
          contactNumber: current.contactNumber || profile.phone,
          deliveryAddress: current.deliveryAddress || profile.address,
        }))
      })
      .catch(() => {
        // Prefilling is optional; the customer can still type the details.
      })

    return () => {
      active = false
    }
  }, [open, customerId])

  // Ask the API how much stock is left for the chosen dates.
  useEffect(() => {
    if (!open) return
    if (!values.startDate || !values.endDate) {
      return
    }

    const start = parseInputDate(values.startDate)
    const end = parseInputDate(values.endDate)
    if (!start || !end || end.getTime() <= start.getTime()) {
      return
    }

    let active = true

    const timer = setTimeout(() => {
      setChecking(true)
      catalogApi
        .availability(equipment.id, values.startDate, values.endDate)
        .then((result) => {
          if (active) setAvailability(result)
        })
        .catch(() => {
          if (active) setAvailability(null)
        })
        .finally(() => {
          if (active) setChecking(false)
        })
    }, 250)

    return () => {
      active = false
      clearTimeout(timer)
      setChecking(false)
    }
  }, [open, equipment.id, values.startDate, values.endDate])

  const selectedStart = parseInputDate(values.startDate)
  const selectedEnd = parseInputDate(values.endDate)
  const hasValidRange = Boolean(
    selectedStart && selectedEnd && selectedEnd.getTime() > selectedStart.getTime()
  )
  const activeAvailability = hasValidRange ? availability : null

  const maxQuantity = activeAvailability
    ? Math.max(activeAvailability.availableQuantity, 0)
    : equipment.availableQuantity

  const estimate = useMemo(
    () =>
      estimateRentalTotal({
        rentalPrice: equipment.rentalPrice,
        rentalType: equipment.rentalType,
        startDate: parseInputDate(values.startDate),
        endDate: parseInputDate(values.endDate),
        quantity: values.quantity,
      }),
    [
      equipment.rentalPrice,
      equipment.rentalType,
      values.startDate,
      values.endDate,
      values.quantity,
    ]
  )

  function update<Key extends keyof BookingValues>(
    key: Key,
    value: BookingValues[Key]
  ) {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      const next = { ...current }
      delete next[key]
      return next
    })
    setFormError(null)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    if (!session?.user) {
      router.push(
        `/sign-in?redirectTo=${encodeURIComponent(`/equipment/${equipment.id}`)}`
      )
      return
    }

    if (!isCustomer) {
      setFormError("Only customer accounts can rent equipment.")
      return
    }

    const nextErrors = validateBookingForm(values, maxQuantity)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    try {
      setSubmitting(true)
      setFormError(null)

      const result = await customerApi.createBooking(
        buildBookingInput(equipment.id, values)
      )

      if (!result.checkoutUrl) {
        throw new Error("Stripe did not return a checkout link.")
      }

      // Redirect to Stripe Checkout. The API verifies the amount again before
      // creating the session, and the webhook confirms the payment later.
      window.location.assign(result.checkoutUrl)
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Your booking could not be created."
      )
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart
              className="size-4 text-brand-orange"
              aria-hidden="true"
            />
            Book {equipment.name}
          </DialogTitle>
          <DialogDescription>
            Choose your rental period and delivery details. You will be taken
            to Stripe Checkout to pay securely.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {formError ? <Alert variant="error">{formError}</Alert> : null}

          {!session?.user ? (
            <Alert variant="info">
              <span className="flex flex-wrap items-center gap-2">
                <Lock className="size-3.5" aria-hidden="true" />
                Sign in to complete this booking.
                <Link
                  href={`/sign-in?redirectTo=${encodeURIComponent(
                    `/equipment/${equipment.id}`
                  )}`}
                  className="font-semibold underline underline-offset-4"
                >
                  Sign in
                </Link>
              </span>
            </Alert>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="booking-start">Rental start date</Label>
              <Input
                id="booking-start"
                type="date"
                min={todayInputValue()}
                value={values.startDate}
                onChange={(event) => update("startDate", event.target.value)}
                aria-invalid={Boolean(errors.startDate)}
                required
              />
              {errors.startDate ? (
                <p className="text-xs text-red-600">{errors.startDate}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="booking-end">Rental end date</Label>
              <Input
                id="booking-end"
                type="date"
                min={values.startDate || todayInputValue()}
                value={values.endDate}
                onChange={(event) => update("endDate", event.target.value)}
                aria-invalid={Boolean(errors.endDate)}
                required
              />
              {errors.endDate ? (
                <p className="text-xs text-red-600">{errors.endDate}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="booking-quantity">Quantity</Label>
              <Input
                id="booking-quantity"
                type="number"
                min={1}
                max={Math.max(maxQuantity, 1)}
                step={1}
                value={values.quantity}
                onChange={(event) =>
                  update("quantity", Number(event.target.value))
                }
                aria-invalid={Boolean(errors.quantity)}
                required
              />
              <p className="flex items-center gap-1 text-xs text-brand-ink-soft">
                <Package className="size-3" aria-hidden="true" />
                {checking
                  ? "Checking availability…"
                  : activeAvailability
                    ? `${activeAvailability.availableQuantity} available for these dates`
                    : `${equipment.availableQuantity} total units`}
              </p>
              {errors.quantity ? (
                <p className="text-xs text-red-600">{errors.quantity}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="booking-contact">Contact number</Label>
              <div className="relative">
                <Phone
                  className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-brand-ink-soft"
                  aria-hidden="true"
                />
                <Input
                  id="booking-contact"
                  type="tel"
                  value={values.contactNumber}
                  onChange={(event) =>
                    update("contactNumber", event.target.value)
                  }
                  placeholder="+880 1XXX XXXXXX"
                  className="pl-9"
                  aria-invalid={Boolean(errors.contactNumber)}
                  required
                />
              </div>
              {errors.contactNumber ? (
                <p className="text-xs text-red-600">{errors.contactNumber}</p>
              ) : null}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="booking-address">Delivery address</Label>
              <div className="relative">
                <MapPin
                  className="pointer-events-none absolute top-3 left-3 size-3.5 text-brand-ink-soft"
                  aria-hidden="true"
                />
                <Textarea
                  id="booking-address"
                  value={values.deliveryAddress}
                  onChange={(event) =>
                    update("deliveryAddress", event.target.value)
                  }
                  placeholder="Street, area, city"
                  className="min-h-20 pl-9"
                  aria-invalid={Boolean(errors.deliveryAddress)}
                  required
                />
              </div>
              {errors.deliveryAddress ? (
                <p className="text-xs text-red-600">
                  {errors.deliveryAddress}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="booking-notes">Additional notes (optional)</Label>
              <div className="relative">
                <MessageSquare
                  className="pointer-events-none absolute top-3 left-3 size-3.5 text-brand-ink-soft"
                  aria-hidden="true"
                />
                <Textarea
                  id="booking-notes"
                  value={values.notes}
                  onChange={(event) => update("notes", event.target.value)}
                  placeholder="Access instructions, operator needs, etc."
                  className="min-h-20 pl-9"
                  maxLength={500}
                />
              </div>
              {errors.notes ? (
                <p className="text-xs text-red-600">{errors.notes}</p>
              ) : null}
            </div>
          </div>

          <div className="rounded-xl border border-brand-navy-line bg-brand-navy-tint/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-1.5 text-brand-ink-soft">
                <CalendarDays className="size-4" aria-hidden="true" />
                {estimate.durationDays > 0
                  ? `${estimate.durationDays} day${
                      estimate.durationDays === 1 ? "" : "s"
                    } · ${estimate.billableUnits} ${rentalPeriodLabel(
                      equipment.rentalType
                    )} rate${estimate.billableUnits === 1 ? "" : "s"}`
                  : "Select your rental dates"}
              </span>
              <span className="font-display text-lg font-bold text-brand-navy">
                {formatCurrency(estimate.total)}
              </span>
            </div>
            <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-5 text-brand-ink-soft">
              <Info className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
              This is an estimate. The server recalculates the final amount from
              the live equipment price before Stripe Checkout opens.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !isCustomer}
              className="gap-2 bg-brand-orange text-white hover:bg-brand-orange-strong"
            >
              {submitting ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Lock className="size-4" aria-hidden="true" />
              )}
              {submitting ? "Opening Stripe…" : "Continue to payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
