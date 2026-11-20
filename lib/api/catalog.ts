import { apiRequest, publicApiRequest } from "@/lib/api/http"
import type {
  CatalogEquipment,
  EquipmentAvailability,
  FavoriteEquipment,
} from "@/lib/types/customer"
import type { RentalType } from "@/lib/types/admin"

export type CatalogFilters = {
  q?: string
  category?: string
  location?: string
  rentalType?: RentalType
  minPrice?: string
  maxPrice?: string
  availability?: "available" | "unavailable"
  sort?: "price-asc" | "price-desc" | "recent"
  limit?: string
}

function queryString(params: Record<string, string | undefined>) {
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value)
  }

  const result = search.toString()
  return result ? `?${result}` : ""
}

/** Public catalogue reads — no token required. */
export const catalogApi = {
  list: (filters: CatalogFilters = {}) =>
    publicApiRequest<CatalogEquipment[]>(
      `/api/equipment${queryString(filters)}`
    ),

  categories: () =>
    publicApiRequest<string[]>("/api/equipment/categories"),

  get: (id: string) =>
    publicApiRequest<CatalogEquipment>(`/api/equipment/${encodeURIComponent(id)}`),

  availability: (id: string, startDate: string, endDate: string) =>
    publicApiRequest<EquipmentAvailability>(
      `/api/equipment/${encodeURIComponent(id)}/availability${queryString({
        startDate,
        endDate,
      })}`
    ),
}

/** Favorites are scoped to the signed-in customer by the API. */
export const favoritesApi = {
  list: () => apiRequest<FavoriteEquipment[]>("/api/favorites"),

  ids: () => apiRequest<string[]>("/api/favorites/ids"),

  add: (equipmentId: string) =>
    apiRequest<{ equipmentId: string; favoritedAt: string }>("/api/favorites", {
      method: "POST",
      body: JSON.stringify({ equipmentId }),
    }),

  remove: (equipmentId: string) =>
    apiRequest<{ equipmentId: string; removed: boolean }>(
      `/api/favorites/${encodeURIComponent(equipmentId)}`,
      { method: "DELETE" }
    ),
}
