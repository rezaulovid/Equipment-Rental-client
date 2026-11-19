"use client"

import { Alert } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ownerApi } from "@/lib/api/owner"
import { useApiQuery } from "@/hooks/use-api-query"
import type { OwnerProfile } from "@/lib/types/owner"
import { OwnerProfileForm } from "../_components/owner-profile-form"
import { ErrorPanel } from "../../admin/_components/state-panels"
import { AdminPageHeader } from "../../admin/_components/admin-page-header"

export default function OwnerProfilePage() {
  const { data, loading, error, refetch, setData } = useApiQuery(() =>
    ownerApi.getProfile()
  )

  const profile: OwnerProfile | null = data ?? null

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-5 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="Profile"
        description="Manage the contact details your business uses across the platform."
      />

      {error ? <ErrorPanel message={error} onRetry={() => void refetch()} /> : null}

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-[28rem] rounded-2xl" />
        </div>
      ) : profile ? (
        <>
          <OwnerProfileForm profile={profile} onSaved={setData} />
          <Card className="p-4">
            <Alert variant="info">
              Your name, phone and address are used for rental requests, and your
              image appears in the dashboard sidebar and rental conversations.
            </Alert>
          </Card>
        </>
      ) : null}
    </div>
  )
}
