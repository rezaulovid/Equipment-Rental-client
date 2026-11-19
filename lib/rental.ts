import type { RentalType } from "@/lib/types/admin"

const MS_PER_DAY = 86_400_000

/** Parses a `YYYY-MM-DD` input value as a UTC calendar date. */
export function parseInputDate(value: string): Date | null {
  if (!value) return null

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null

  const date = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  )

  return Number.isNaN(date.getTime()) ? null : date
}

export function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function todayInputValue(): string {
  const now = new Date()
  return toDateInputValue(
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  )
}

export function rentalDurationDays(
  startDate: Date | null,
  endDate: Date | null
): number {
  if (!startDate || !endDate) return 0
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / MS_PER_DAY)
  return days > 0 ? days : 0
}

export function billableUnits(
  durationDays: number,
  rentalType: RentalType
): number {
  if (durationDays <= 0) return 0
  if (rentalType === "weekly") return Math.ceil(durationDays / 7)
  if (rentalType === "monthly") return Math.ceil(durationDays / 30)
  return durationDays
}

/** Client-side display estimate. The API recalculates the real amount. */
export function estimateRentalTotal({
  rentalPrice,
  rentalType,
  startDate,
  endDate,
  quantity,
}: {
  rentalPrice: number
  rentalType: RentalType
  startDate: Date | null
  endDate: Date | null
  quantity: number
}) {
  const durationDays = rentalDurationDays(startDate, endDate)
  const units = billableUnits(durationDays, rentalType)
  const qty = Number.isFinite(quantity) ? Math.max(0, quantity) : 0
  const total = Math.round(rentalPrice * units * qty * 100) / 100

  return { durationDays, billableUnits: units, total }
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
})

export function formatCurrency(value: number, currency = "USD") {
  if (currency.toUpperCase() === "USD") return currencyFormatter.format(value)

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return dateFormatter.format(date)
}

export function rentalPeriodLabel(rentalType: RentalType) {
  return rentalType === "weekly"
    ? "week"
    : rentalType === "monthly"
      ? "month"
      : "day"
}
