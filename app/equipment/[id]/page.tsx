import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { EquipmentDetails } from "@/components/equipment/equipment-details"

export const metadata: Metadata = {
  title: "Equipment Details | RentPro",
  description:
    "View rental details, live availability and book equipment securely on RentPro.",
}

export default async function EquipmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="flex min-h-svh flex-col bg-brand-surface">
      <SiteHeader />
      <main className="flex-1">
        <EquipmentDetails equipmentId={id} />
      </main>
    </div>
  )
}
