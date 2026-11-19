import type { UserRole } from "@/lib/user-role"

/** Shapes returned by the Express admin API (`/api/admin/*`). */

export type EquipmentStatus = "pending" | "approved" | "rejected"
export type RentalType = "daily" | "weekly" | "monthly"
export type PaymentStatus = "unpaid" | "pending" | "paid" | "refunded" | "failed"
export type BookingStatus = "pending" | "active" | "completed" | "cancelled"

export type AdminUser = {
  id: string
  name: string
  email: string
  role: UserRole
  image: string | null
  phone: string
  address: string
  banned: boolean
  createdAt: string | null
}

export type AdminProfile = Pick<
  AdminUser,
  "id" | "name" | "email" | "image" | "phone" | "address"
> & { role: UserRole }

export type AdminEquipment = {
  id: string
  name: string
  description: string
  category: string
  location: string
  rentalPrice: number
  rentalType: RentalType
  availableQuantity: number
  condition: string
  brand: string
  model: string
  image: string
  terms: string
  status: EquipmentStatus
  ownerId: string
  ownerName: string
  ownerEmail: string
  createdAt: string | null
  updatedAt: string | null
}

export type AdminRental = {
  id: string
  equipmentId: string
  equipmentName: string
  customerId: string
  customerName: string
  customerEmail: string
  ownerId: string
  ownerName: string
  ownerEmail: string
  startDate: string | null
  endDate: string | null
  durationDays: number
  quantity: number
  contactNumber: string
  totalAmount: number
  paymentStatus: PaymentStatus
  bookingStatus: BookingStatus
  createdAt: string | null
}

export type MonthlyBookingPoint = {
  month: string
  label: string
  bookings: number
  revenue: number
}

export type AdminAnalytics = {
  totalUsers: number
  totalEquipment: number
  totalBookings: number
  pendingApprovals: number
  completedRentals: number
  totalRevenue: number
  equipmentByStatus: Record<EquipmentStatus, number>
  monthly: MonthlyBookingPoint[]
}

/** Fields the admin edit dialog is allowed to change. */
export type EquipmentUpdateInput = Partial<
  Pick<
    AdminEquipment,
    | "name"
    | "description"
    | "category"
    | "location"
    | "rentalPrice"
    | "rentalType"
    | "availableQuantity"
    | "condition"
    | "brand"
    | "model"
    | "image"
    | "terms"
    | "status"
  >
>

export type ProfileUpdateInput = {
  name?: string
  phone?: string
  address?: string
  image?: string
}
