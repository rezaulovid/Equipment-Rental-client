import { Badge } from "@/components/ui/badge"
import type { BookingStatus, PaymentStatus } from "@/lib/types/admin"

const paymentVariants: Record<
  PaymentStatus,
  "success" | "warning" | "danger" | "neutral"
> = {
  paid: "success",
  pending: "warning",
  unpaid: "neutral",
  refunded: "neutral",
  failed: "danger",
}

const bookingVariants: Record<
  BookingStatus,
  "success" | "warning" | "danger" | "brand"
> = {
  active: "brand",
  completed: "success",
  pending: "warning",
  cancelled: "danger",
}

const paymentLabels: Record<PaymentStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  unpaid: "Unpaid",
  refunded: "Refunded",
  failed: "Failed",
}

const bookingLabels: Record<BookingStatus, string> = {
  active: "Active",
  completed: "Completed",
  pending: "Pending",
  cancelled: "Cancelled",
}

export function CustomerPaymentStatusBadge({
  status,
}: {
  status: PaymentStatus
}) {
  return (
    <Badge variant={paymentVariants[status]}>{paymentLabels[status]}</Badge>
  )
}

export function CustomerBookingStatusBadge({
  status,
}: {
  status: BookingStatus
}) {
  return (
    <Badge variant={bookingVariants[status]}>{bookingLabels[status]}</Badge>
  )
}
