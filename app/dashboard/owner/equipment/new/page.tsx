"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ownerApi } from "@/lib/api/owner"
import { AdminPageHeader } from "../../../admin/_components/admin-page-header"
import { OwnerEquipmentForm } from "../../_components/owner-equipment-form"

export default function OwnerAddEquipmentPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(input: {
    name: string
    description: string
    category: string
    location: string
    rentalPrice: number
    rentalType: "daily" | "weekly" | "monthly"
    availableQuantity: number
    condition: string
    brand: string
    model: string
    image: string
    terms: string
  }) {
    setError(null)
    setSaved(false)
    setSaving(true)

    try {
      await ownerApi.createEquipment(input)

      // The listing is created with a pending status; the RentPro team reviews
      // it before it becomes visible in the public catalogue.
      setSaved(true)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "The equipment could not be created."
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-5 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="Add equipment"
        description="Submit a new rental listing for your business. New listings always start as pending and are reviewed before they are rented publicly."
      />

      {error ? <Alert variant="error">{error}</Alert> : null}
      {saved ? (
        <Alert variant="success">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-semibold">Your equipment was saved.</p>
              <p className="mt-0.5">
                The listing is now pending owner approval and will appear in the
                public catalogue once approved.
              </p>
            </div>
            <Button
              className="gap-2 bg-brand-orange text-white hover:bg-brand-orange-strong"
              onClick={() => router.push("/dashboard/owner/equipment")}
            >
              View my equipment
            </Button>
          </div>
        </Alert>
      ) : null}

      <Card>
        <CardContent className="p-5 sm:p-6">
          <OwnerEquipmentForm
            submitLabel="Add equipment"
            busy={saving}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/dashboard/owner/equipment")}
          />
        </CardContent>
      </Card>
    </div>
  )
}
