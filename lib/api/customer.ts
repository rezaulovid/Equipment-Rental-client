import { ApiError, apiRequest } from "@/lib/api/http"
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

async function sameOriginRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...init,
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  })
  const payload = await response.json().catch(() => null) as
    | { success?: boolean; data?: T; message?: string }
    | null
  if (!response.ok || !payload || payload.success === false) {
    throw new ApiError(
      response.status,
      payload?.message ?? "Unable to complete the request."
    )
  }
  return payload.data as T
}

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
    sameOriginRequest<CheckoutResponse>("/api/bookings", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  retryCheckout: (bookingId: string) =>
    sameOriginRequest<CheckoutResponse>(`/api/bookings/${bookingId}/checkout`, {
      method: "POST",
      body: JSON.stringify({}),
    }),

  cancelBooking: (bookingId: string) =>
    sameOriginRequest<{ id: string; bookingStatus: string }>(
      `/api/bookings/${bookingId}/cancel`,
      { method: "POST", body: JSON.stringify({}) }
    ),

  confirmCheckoutSession: (sessionId: string) =>
    sameOriginRequest<CheckoutConfirmation>(
      `/api/payments/session/${encodeURIComponent(sessionId)}`
    ),
}
