import { apiRequest } from "@/lib/api/http"
import type {
  BookingStatus,
  EquipmentStatus,
  ProfileUpdateInput,
  RentalType,
} from "@/lib/types/admin"
import type {
  OwnerAnalytics,
  OwnerEarnings,
  OwnerEquipment,
  OwnerEquipmentInput,
  OwnerProfile,
  OwnerRental,
} from "@/lib/types/owner"

/**
 * Typed owner API service. Every call goes through `apiRequest`, which adds
 * the Bearer token — components never talk to Express directly. The server
 * scopes every query to the owner inside the verified token.
 */
export const ownerApi = {
  getAnalytics: () => apiRequest<OwnerAnalytics>("/api/owner/analytics"),

  getEarnings: () => apiRequest<OwnerEarnings>("/api/owner/earnings"),

  getEquipment: (status?: EquipmentStatus | "all") =>
    apiRequest<OwnerEquipment[]>(
      `/api/owner/equipment${status && status !== "all" ? `?status=${status}` : ""}`
    ),

  getEquipmentById: (id: string) =>
    apiRequest<OwnerEquipment>(
      `/api/owner/equipment/${encodeURIComponent(id)}`
    ),

  createEquipment: (input: OwnerEquipmentInput) =>
    apiRequest<OwnerEquipment>("/api/owner/equipment", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  updateEquipment: (id: string, input: Partial<OwnerEquipmentInput>) =>
    apiRequest<OwnerEquipment>(`/api/owner/equipment/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),

  deleteEquipment: (id: string) =>
    apiRequest<{ id: string }>(`/api/owner/equipment/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),

  getRentals: () => apiRequest<OwnerRental[]>("/api/owner/rentals"),

  updateRentalStatus: (id: string, bookingStatus: BookingStatus) =>
    apiRequest<OwnerRental>(
      `/api/owner/rentals/${encodeURIComponent(id)}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ bookingStatus }),
      }
    ),

  getProfile: () => apiRequest<OwnerProfile>("/api/owner/profile"),

  updateProfile: (input: ProfileUpdateInput) =>
    apiRequest<OwnerProfile>("/api/owner/profile", {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
}

export type { EquipmentStatus, RentalType }
