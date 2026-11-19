import Link from "next/link"
import type { LucideIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function CustomerStatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "navy",
  href,
  loading,
}: {
  label: string
  value: string | number
  hint?: string
  icon: LucideIcon
  tone?: "navy" | "orange" | "amber" | "green" | "blue"
  href?: string
  loading?: boolean
}) {
  const tones = {
    navy: "bg-brand-navy-tint text-brand-navy dark:bg-muted dark:text-foreground",
    orange: "bg-brand-orange-soft text-brand-orange-deep",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
  } as const

  const content = (
    <Card
      className={cn(
        "h-full p-5 transition-colors",
        href && "hover:border-brand-orange/40 hover:bg-brand-orange-soft/30"
      )}
    >
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

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
      >
        {content}
      </Link>
    )
  }

  return content
}
