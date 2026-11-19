import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "cn"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.04em] whitespace-nowrap uppercase",
  {
    variants: {
      variant: {
        neutral:
          "border-brand-navy-line bg-brand-navy-tint text-brand-ink-soft dark:border-border dark:bg-muted dark:text-muted-foreground",
        success:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
        warning:
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
        danger:
          "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300",
        brand:
          "border-brand-orange/30 bg-brand-orange-soft text-brand-orange-deep dark:border-brand-orange/30 dark:bg-brand-orange/10 dark:text-brand-orange-muted",
        navy:
          "border-brand-navy/15 bg-brand-navy text-white dark:border-transparent",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
