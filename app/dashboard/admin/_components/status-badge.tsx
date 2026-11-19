import { Badge } from "@/components/ui/badge"
import type {
  BookingStatus,
  EquipmentStatus,
  PaymentStatus,
} from "@/lib/types/admin"

const equipmentVariants: Record<EquipmentStatus, "success" | "warning" | "danger"> =
  {
    approved: "success",
    pending: "warning",
    rejected: "danger",
  }

const paymentVariants: Record<PaymentStatus, "success" | "warning" | "danger" | "neutral"> =
  {
    paid: "success",
    pending: "warning",
    unpaid: "neutral",
    refunded: "neutral",
    failed: "danger",
  }

const bookingVariants: Record<BookingStatus, "success" | "warning" | "danger" | "brand"> =
  {
    active: "brand",
    completed: "success",
    pending: "warning",
    cancelled: "danger",
  }

export function EquipmentStatusBadge({ status }: { status: EquipmentStatus }) {
  return <Badge variant={equipmentVariants[status]}>{status}</Badge>
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge variant={paymentVariants[status]}>{status}</Badge>
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <Badge variant={bookingVariants[status]}>{status}</Badge>
}
