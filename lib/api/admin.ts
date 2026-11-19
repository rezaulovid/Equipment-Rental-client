import { apiRequest } from "@/lib/api/http"
import type {
  AdminAnalytics,
  AdminEquipment,
  AdminProfile,
  AdminRental,
  AdminUser,
  BookingStatus,
  EquipmentStatus,
  EquipmentUpdateInput,
  ProfileUpdateInput,
} from "@/lib/types/admin"
import type { UserRole } from "@/lib/user-role"

/**
 * Typed admin API service. Every call goes through `apiRequest`, which adds the
 * Bearer token — components never talk to Express directly.
 */

export const adminApi = {
  getAnalytics: () => apiRequest<AdminAnalytics>("/api/admin/analytics"),

  getUsers: () => apiRequest<AdminUser[]>("/api/admin/users"),

  updateUserRole: (id: string, role: UserRole) =>
    apiRequest<AdminUser>(`/api/admin/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),

  updateUser: (
    id: string,
    input: Partial<Pick<AdminUser, "name" | "phone" | "address" | "image">>
  ) =>
    apiRequest<AdminUser>(`/api/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),

  getEquipment: (status?: EquipmentStatus | "all") =>
    apiRequest<AdminEquipment[]>(
      `/api/admin/equipment${status && status !== "all" ? `?status=${status}` : ""}`
    ),

  updateEquipmentStatus: (id: string, status: EquipmentStatus) =>
    apiRequest<AdminEquipment>(`/api/admin/equipment/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  updateEquipment: (id: string, input: EquipmentUpdateInput) =>
    apiRequest<AdminEquipment>(`/api/admin/equipment/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),

  deleteEquipment: (id: string) =>
    apiRequest<{ id: string }>(`/api/admin/equipment/${id}`, {
      method: "DELETE",
    }),

  getRentals: () => apiRequest<AdminRental[]>("/api/admin/rentals"),

  updateRentalStatus: (id: string, bookingStatus: BookingStatus) =>
    apiRequest<AdminRental>(`/api/admin/rentals/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ bookingStatus }),
    }),

  getProfile: () => apiRequest<AdminProfile>("/api/admin/profile"),

  updateProfile: (input: ProfileUpdateInput) =>
    apiRequest<AdminProfile>("/api/admin/profile", {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
}
