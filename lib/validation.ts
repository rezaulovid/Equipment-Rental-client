import type { RentalType } from "@/lib/types/admin"
import type { BookingInput } from "@/lib/types/customer"
import { parseInputDate, rentalDurationDays, todayInputValue } from "@/lib/rental"

export type FieldErrors = Record<string, string>

const PHONE_PATTERN = /^[+\d()\s.-]{6,30}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_PATTERN = /^https?:\/\/\S+$/i

export type ContactFormValues = {
  fullName: string
  email: string
  phone: string
  subject: string
  message: string
}

export const CONTACT_MESSAGE_MAX_LENGTH = 2000

/**
 * Shared by the contact form (client) and the contact route handler (server),
 * so the browser and the API always agree on what a valid message looks like.
 */
export function validateContactForm(values: ContactFormValues): FieldErrors {
  const errors: FieldErrors = {}
  const fullName = values.fullName.trim()

  if (fullName.length < 2 || fullName.length > 80) {
    errors.fullName = "Full name must be between 2 and 80 characters."
  }

  const email = values.email.trim()
  if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address."
  }

  const phone = values.phone.trim()
  if (phone && !PHONE_PATTERN.test(phone)) {
    errors.phone = "Enter a valid phone number, or leave this blank."
  }

  const subject = values.subject.trim()
  if (subject.length < 3 || subject.length > 120) {
    errors.subject = "Subject must be between 3 and 120 characters."
  }

  const message = values.message.trim()
  if (message.length < 10 || message.length > CONTACT_MESSAGE_MAX_LENGTH) {
    errors.message = `Message must be between 10 and ${CONTACT_MESSAGE_MAX_LENGTH} characters.`
  }

  return errors
}

export function validateProfileForm(values: {
  name: string
  phone: string
  address: string
  image: string
}): FieldErrors {
  const errors: FieldErrors = {}
  const name = values.name.trim()

  if (name.length < 2 || name.length > 80) {
    errors.name = "Name must be between 2 and 80 characters."
  }

  const phone = values.phone.trim()
  if (phone && !PHONE_PATTERN.test(phone)) {
    errors.phone = "Enter a valid phone number."
  }

  if (values.address.trim().length > 200) {
    errors.address = "Address must be at most 200 characters."
  }

  const image = values.image.trim()
  if (image && !URL_PATTERN.test(image)) {
    errors.image = "Profile image must be an http(s) URL."
  }

  return errors
}

export function validateBookingForm(
  input: {
    startDate: string
    endDate: string
    quantity: number
    contactNumber: string
    deliveryAddress: string
    notes: string
  },
  availableQuantity: number
): FieldErrors {
  const errors: FieldErrors = {}
  const start = parseInputDate(input.startDate)
  const end = parseInputDate(input.endDate)

  if (!start) {
    errors.startDate = "Choose a rental start date."
  } else if (input.startDate < todayInputValue()) {
    errors.startDate = "Rental start date cannot be in the past."
  }

  if (!end) {
    errors.endDate = "Choose a rental end date."
  } else if (start && end.getTime() <= start.getTime()) {
    errors.endDate = "End date must be after the start date."
  }

  if (start && end && rentalDurationDays(start, end) === 0) {
    errors.endDate = "Choose a rental period of at least one day."
  }

  if (!Number.isInteger(input.quantity) || input.quantity < 1) {
    errors.quantity = "Quantity must be a whole number of at least 1."
  } else if (input.quantity > availableQuantity) {
    errors.quantity = `Only ${availableQuantity} unit${
      availableQuantity === 1 ? "" : "s"
    } available.`
  }

  const contact = input.contactNumber.trim()
  if (!PHONE_PATTERN.test(contact)) {
    errors.contactNumber = "Enter a valid contact number."
  }

  const address = input.deliveryAddress.trim()
  if (address.length < 5 || address.length > 200) {
    errors.deliveryAddress = "Address must be between 5 and 200 characters."
  }

  if (input.notes.trim().length > 500) {
    errors.notes = "Notes must be at most 500 characters."
  }

  return errors
}

export function buildBookingInput(
  equipmentId: string,
  values: {
    startDate: string
    endDate: string
    quantity: number
    contactNumber: string
    deliveryAddress: string
    notes: string
  }
): BookingInput {
  return {
    equipmentId,
    startDate: values.startDate,
    endDate: values.endDate,
    quantity: values.quantity,
    contactNumber: values.contactNumber.trim(),
    deliveryAddress: values.deliveryAddress.trim(),
    notes: values.notes.trim(),
  }
}

export function validateRentalType(value: unknown): RentalType {
  return value === "weekly" || value === "monthly" ? value : "daily"
}

export const EQUIPMENT_IMAGE_PATTERN = /^https?:\/\/\S+$/i

export function validateOwnerEquipmentForm(
  values: {
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
): FieldErrors {
  const errors: FieldErrors = {}
  const name = values.name.trim()

  if (name.length < 2 || name.length > 120) {
    errors.name = "Equipment name must be between 2 and 120 characters."
  }

  if (values.description.trim().length > 2000) {
    errors.description = "Description must be at most 2000 characters."
  }

  if (values.category.trim().length > 60) {
    errors.category = "Category must be at most 60 characters."
  }

  if (values.location.trim().length > 120) {
    errors.location = "Location must be at most 120 characters."
  }

  const rentalPrice = Number(values.rentalPrice)
  if (!Number.isFinite(rentalPrice) || rentalPrice <= 0) {
    errors.rentalPrice = "Rental price must be a positive number."
  }

  const rentalType = values.rentalType
  if (rentalType !== "daily" && rentalType !== "weekly" && rentalType !== "monthly") {
    errors.rentalType = "Select a valid rental period."
  }

  const availableQuantity = Number(values.availableQuantity)
  if (!Number.isInteger(availableQuantity) || availableQuantity < 1) {
    errors.availableQuantity =
      "Available quantity must be a whole number of at least 1."
  }

  if (values.condition.trim().length > 60) {
    errors.condition = "Equipment condition must be at most 60 characters."
  }

  if (values.brand.trim().length > 60) {
    errors.brand = "Brand must be at most 60 characters."
  }

  if (values.model.trim().length > 60) {
    errors.model = "Model must be at most 60 characters."
  }

  const image = values.image.trim()
  if (!EQUIPMENT_IMAGE_PATTERN.test(image)) {
    errors.image = "Equipment image must be a valid image URL."
  }

  if (values.terms.trim().length > 2000) {
    errors.terms = "Rental terms must be at most 2000 characters."
  }

  return errors
}
