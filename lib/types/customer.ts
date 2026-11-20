import type {
  BookingStatus,
  PaymentStatus,
  RentalType,
} from "@/lib/types/admin"
import type { UserRole } from "@/lib/user-role"

/** Approved catalogue item returned by the public equipment API. */
export type CatalogEquipment = {
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
  status: "approved"
  ownerId: string
  ownerName: string
  ownerEmail: string
  createdAt: string | null
  updatedAt: string | null
}

export type FavoriteEquipment = CatalogEquipment & {
  favoritedAt: string | null
}

export type EquipmentAvailability = {
  equipmentId: string
  totalQuantity: number
  bookedQuantity: number
  availableQuantity: number
  startDate: string
  endDate: string
}

export type CustomerRental = {
  id: string
  equipmentId: string
  equipmentName: string
  equipmentImage: string
  equipmentCategory: string
  customerId: string
  customerName: string
  customerEmail: string
  ownerId: string
  ownerName: string
  ownerEmail: string
  startDate: string | null
  endDate: string | null
  durationDays: number
  billableUnits: number
  rentalType: RentalType
  unitPrice: number
  quantity: number
  contactNumber: string
  deliveryAddress: string
  notes: string
  totalAmount: number
  paymentStatus: PaymentStatus
  bookingStatus: BookingStatus
  createdAt: string | null
  canPay: boolean
}

export type CustomerProfile = {
  id: string
  name: string
  email: string
  image: string | null
  phone: string
  address: string
  role: UserRole
}

export type CustomerPayment = {
  id: string
  bookingId: string
  equipmentId: string
  equipmentName: string
  customerId: string
  amount: number
  currency: string
  status: PaymentStatus
  method: string
  transactionId: string
  receiptUrl: string
  paidAt: string | null
  createdAt: string | null
}

export type CustomerOverview = {
  profile: CustomerProfile
  stats: {
    totalRentals: number
    activeRentals: number
    completedRentals: number
    pendingPayments: number
    totalSpent: number
    favorites: number
  }
  recentBookings: CustomerRental[]
}

export type BookingInput = {
  equipmentId: string
  startDate: string
  endDate: string
  quantity: number
  contactNumber: string
  deliveryAddress: string
  notes?: string
}

export type CheckoutResponse = {
  bookingId: string
  paymentId: string
  checkoutUrl: string
  amount: number
  currency: string
}

export type CheckoutConfirmation = {
  status: string
  sessionStatus: string
  amount: number
  currency: string
  bookingId: string
  paymentStatus: PaymentStatus
  updated: boolean
  equipmentName?: string
  equipmentImage?: string
  startDate?: string | null
  endDate?: string | null
  durationDays?: number
  billableUnits?: number
  rentalType?: RentalType
  quantity?: number
  paidAt?: string | null
  transactionId?: string | null
}

export type ProfileUpdateInput = {
  name?: string
  phone?: string
  address?: string
  image?: string
}
