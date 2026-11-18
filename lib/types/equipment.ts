export type RentalPeriod = "day" | "week" | "month"

export type EquipmentAvailability = "available" | "unavailable"

export interface EquipmentCategory {
  id: string
  slug: string
  name: string
  description: string
  itemCount: number
  image: string
  imageAlt: string
}

export interface Equipment {
  id: string
  slug: string
  name: string
  category: string
  image: string
  imageAlt: string
  rating: number
  reviewCount: number
  location: string
  price: number
  rentalPeriod: RentalPeriod
  availability: EquipmentAvailability
}
