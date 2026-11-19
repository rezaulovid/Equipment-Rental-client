import { apiRequest } from "@/lib/api/http"
import type {
  BookingInput,
  CheckoutConfirmation,
  CheckoutResponse,
  CustomerOverview,
  CustomerPayment,
  CustomerProfile,
  CustomerRental,
  ProfileUpdateInput,
} from "@/lib/types/customer"

/**
 * Typed customer API service. The Express API derives the customer id from the
 * verified access token, so no caller ever passes someone else's id.
 */
export const customerApi = {
  getOverview: () => apiRequest<CustomerOverview>("/api/customer/overview"),

  getRentals: () => apiRequest<CustomerRental[]>("/api/customer/rentals"),

  getRental: (id: string) =>
    apiRequest<CustomerRental>(`/api/customer/rentals/${id}`),

  getPayments: () => apiRequest<CustomerPayment[]>("/api/customer/payments"),

  getProfile: () => apiRequest<CustomerProfile>("/api/customer/profile"),

  updateProfile: (input: ProfileUpdateInput) =>
    apiRequest<CustomerProfile>("/api/customer/profile", {
      method: "PATCH",
      body: JSON.stringify(input),
    }),

  createBooking: (input: BookingInput) =>
    apiRequest<CheckoutResponse>("/api/bookings", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  retryCheckout: (bookingId: string) =>
    apiRequest<CheckoutResponse>(`/api/bookings/${bookingId}/checkout`, {
      method: "POST",
      body: JSON.stringify({}),
    }),

  cancelBooking: (bookingId: string) =>
    apiRequest<{ id: string; bookingStatus: string }>(
      `/api/bookings/${bookingId}/cancel`,
      { method: "POST", body: JSON.stringify({}) }
    ),

  confirmCheckoutSession: (sessionId: string) =>
    apiRequest<CheckoutConfirmation>(
      `/api/payments/session/${encodeURIComponent(sessionId)}`
    ),
}
