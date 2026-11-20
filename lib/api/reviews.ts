import { apiRequest, publicApiRequest } from "@/lib/api/http"

export type CustomerReview = {
  id: string
  bookingId: string
  customerName: string
  rating: number
  message: string
  createdAt: string | null
}

export const reviewsApi = {
  list: () => publicApiRequest<CustomerReview[]>("/api/reviews"),

  getForBooking: (bookingId: string) =>
    apiRequest<CustomerReview | null>(
      `/api/reviews/mine/${encodeURIComponent(bookingId)}`
    ),

  create: (input: { bookingId: string; rating: number; message: string }) =>
    apiRequest<CustomerReview>("/api/reviews", {
      method: "POST",
      body: JSON.stringify(input),
    }),
}
