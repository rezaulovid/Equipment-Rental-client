import type { LucideIcon } from "lucide-react"

import { cn } from "cn"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "navy",
  loading,
}: {
  label: string
  value: string | number
  hint?: string
  icon: LucideIcon
  tone?: "navy" | "orange" | "amber" | "green" | "blue"
  loading?: boolean
}) {
  const tones = {
    navy: "bg-brand-navy-tint text-brand-navy dark:bg-muted dark:text-foreground",
    orange: "bg-brand-orange-soft text-brand-orange-deep",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
  } as const

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-brand-ink-soft uppercase dark:text-muted-foreground">
            {label}
          </p>
          {loading ? (
            <Skeleton className="mt-2.5 h-8 w-20" />
          ) : (
            <p className="mt-2 font-display text-[26px] leading-none font-bold tracking-[-0.02em] text-brand-navy dark:text-foreground">
              {value}
            </p>
          )}
          {hint ? (
            <p className="mt-2 text-xs text-brand-ink-soft dark:text-muted-foreground">
              {hint}
            </p>
          ) : null}
        </div>
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            tones[tone]
          )}
          aria-hidden="true"
        >
          <Icon className="size-[18px]" strokeWidth={2.1} />
        </span>
      </div>
    </Card>
  )
}
