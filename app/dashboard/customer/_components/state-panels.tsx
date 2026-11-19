import type { LucideIcon } from "lucide-react"

import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"

export function TableLoading({
  colSpan,
  rows = 5,
}: {
  colSpan: number
  rows?: number
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index}>
          <TableCell colSpan={colSpan} className="py-3">
            <Skeleton className="h-9 w-full rounded-lg" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export function TableEmpty({
  colSpan,
  icon: Icon,
  title,
  description,
  action,
}: {
  colSpan: number
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="py-14">
        <div className="mx-auto flex max-w-sm flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-navy-tint text-brand-navy dark:bg-muted dark:text-foreground">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-3 font-display text-base font-semibold text-brand-navy dark:text-foreground">
            {title}
          </p>
          <p className="mt-1 text-sm leading-6 text-brand-ink-soft dark:text-muted-foreground">
            {description}
          </p>
          {action ? <div className="mt-4">{action}</div> : null}
        </div>
      </TableCell>
    </TableRow>
  )
}

export function ErrorPanel({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <Alert variant="error">
      <div className="flex flex-wrap items-center gap-3">
        <span>{message}</span>
        {onRetry ? (
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            className="h-7 border-red-200 bg-white text-red-700 hover:bg-red-50"
          >
            Try again
          </Button>
        ) : null}
      </div>
    </Alert>
  )
}

export function InlineNotice({
  variant,
  message,
  onDismiss,
}: {
  variant: "success" | "error" | "info"
  message: string
  onDismiss?: () => void
}) {
  return (
    <Alert variant={variant}>
      <div className="flex items-center justify-between gap-3">
        <span>{message}</span>
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            className="text-xs font-semibold underline underline-offset-4 opacity-80 hover:opacity-100"
          >
            Dismiss
          </button>
        ) : null}
      </div>
    </Alert>
  )
}
