import * as React from "react"
import { AlertTriangle, CheckCircle2, Info } from "lucide-react"

import { cn } from "cn"

type AlertVariant = "error" | "success" | "info"

const styles: Record<AlertVariant, string> = {
  error:
    "border-red-200 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200",
  info: "border-brand-navy-line bg-brand-navy-tint text-brand-navy dark:border-border dark:bg-muted dark:text-foreground",
}

const icons: Record<AlertVariant, React.ElementType> = {
  error: AlertTriangle,
  success: CheckCircle2,
  info: Info,
}

function Alert({
  className,
  variant = "info",
  children,
  ...props
}: React.ComponentProps<"div"> & { variant?: AlertVariant }) {
  const Icon = icons[variant]

  return (
    <div
      data-slot="alert"
      role="status"
      className={cn(
        "flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm leading-6",
        styles[variant],
        className
      )}
      {...props}
    >
      <Icon className="mt-1 size-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0">{children}</div>
    </div>
  )
}

export { Alert }
