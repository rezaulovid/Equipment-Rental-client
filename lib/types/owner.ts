import type {
  AdminEquipment,
  AdminProfile,
  AdminRental,
  BookingStatus,
  EquipmentStatus,
  RentalType,
} from "@/lib/types/admin"
import type { CustomerPayment } from "@/lib/types/customer"
import type { UserRole } from "@/lib/user-role"

/** Equipment documents that belong to the signed-in owner. */
export type OwnerEquipment = AdminEquipment

/** A rental booked through the owner's equipment. */
export type OwnerRental = AdminRental & {
  equipmentImage: string
  equipmentCategory: string
  deliveryAddress?: string
  notes?: string
  billableUnits?: number
  unitPrice?: number
  rentalType?: RentalType
}

export type OwnerProfile = AdminProfile

export type OwnerPayment = CustomerPayment

export type OwnerMonthlyPoint = {
  month: string
  label: string
  revenue: number
  bookings?: number
}

export type OwnerAnalytics = {
  equipmentByStatus: Record<EquipmentStatus, number>
  totalListings: number
  pendingEquipment: number
  approvedEquipment: number
  rejectedEquipment: number
  completedRentals: number
  totalEarnings: number
  monthly: OwnerMonthlyPoint[]
}

export type OwnerEarnings = {
  totalEarnings: number
  earningsThisMonth: number
  paidRentals: number
  monthly: OwnerMonthlyPoint[]
  rentals: OwnerPayment[]
}

/** Fields submitted when an owner lists or updates equipment. */
export type OwnerEquipmentInput = {
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
}

/** Raw string values used by the owner equipment form before submission. */
export type OwnerEquipmentFormValues = {
  name: string
  description: string
  category: string
  location: string
  rentalPrice: string
  rentalType: RentalType
  availableQuantity: string
  condition: string
  brand: string
  model: string
  image: string
  terms: string
}

export type { BookingStatus, UserRole }
