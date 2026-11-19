"use client"

import type { MonthlyBookingPoint } from "@/lib/types/admin"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "cn"

/**
 * Dependency-free bar chart. Bars scale to the busiest month so the shape of
 * the year stays readable even with small counts.
 */
export function MonthlyBookingsChart({
  data,
  loading,
}: {
  data: MonthlyBookingPoint[]
  loading?: boolean
}) {
  if (loading) {
    return (
      <div className="flex h-60 items-end gap-2">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton
            key={index}
            className="flex-1 rounded-t-md"
            style={{ height: `${25 + ((index * 37) % 65)}%` }}
          />
        ))}
      </div>
    )
  }

  const max = Math.max(...data.map((point) => point.bookings), 1)
  const total = data.reduce((sum, point) => sum + point.bookings, 0)

  if (total === 0) {
    return (
      <div className="flex h-60 flex-col items-center justify-center rounded-xl border border-dashed border-brand-navy-line px-6 text-center dark:border-border">
        <p className="font-display text-sm font-semibold text-brand-navy dark:text-foreground">
          No bookings recorded yet
        </p>
        <p className="mt-1 max-w-xs text-xs leading-5 text-brand-ink-soft dark:text-muted-foreground">
          Monthly booking activity will appear here as soon as customers start
          renting equipment.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div
        className="flex h-60 items-end gap-1.5 sm:gap-2"
        role="img"
        aria-label={`Monthly bookings for the last 12 months. ${total} bookings in total.`}
      >
        {data.map((point) => {
          const height = Math.max((point.bookings / max) * 100, point.bookings > 0 ? 6 : 2)

          return (
            <div
              key={point.month}
              className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5"
              title={`${point.label}: ${point.bookings} booking${point.bookings === 1 ? "" : "s"}`}
            >
              <span
                className={cn(
                  "text-[10px] font-semibold tabular-nums",
                  point.bookings > 0
                    ? "text-brand-navy dark:text-foreground"
                    : "text-brand-ink-soft/60 dark:text-muted-foreground/60"
                )}
              >
                {point.bookings}
              </span>
              <div
                className={cn(
                  "w-full rounded-t-md transition-colors",
                  point.bookings > 0
                    ? "bg-brand-orange/25 group-hover:bg-brand-orange"
                    : "bg-brand-navy-line dark:bg-border"
                )}
                style={{ height: `${height}%` }}
              />
            </div>
          )
        })}
      </div>

      <div className="mt-2 flex gap-1.5 border-t border-brand-navy-line pt-2 sm:gap-2 dark:border-border">
        {data.map((point) => (
          <span
            key={point.month}
            className="min-w-0 flex-1 truncate text-center text-[9px] font-medium tracking-[-0.01em] text-brand-ink-soft sm:text-[10px] dark:text-muted-foreground"
          >
            {point.label.split(" ")[0]}
          </span>
        ))}
      </div>
    </div>
  )
}
