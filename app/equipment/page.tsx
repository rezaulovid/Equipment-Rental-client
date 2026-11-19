import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { EquipmentCatalog } from "@/components/equipment/equipment-catalog"

export const metadata: Metadata = {
  title: "All Equipment | RentPro",
  description:
    "Browse approved construction, photography, event and business equipment available for rent.",
}

export default async function EquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>
}) {
  const params = await searchParams
  const category = Array.isArray(params.category)
    ? (params.category[0] ?? "")
    : (params.category ?? "")

  return (
    <div className="flex min-h-svh flex-col bg-brand-surface">
      <SiteHeader />
      <main className="flex-1">
        <EquipmentCatalog initialCategory={category} />
      </main>
    </div>
  )
}
