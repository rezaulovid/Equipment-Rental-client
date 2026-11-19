"use client"

import { Alert } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { adminApi } from "@/lib/api/admin"
import { useSession } from "@/lib/auth-client"
import { useApiQuery } from "@/hooks/use-api-query"
import { AdminPageHeader } from "../_components/admin-page-header"
import { ProfileForm } from "../_components/profile-form"
import { ErrorPanel } from "../_components/state-panels"

export default function AdminProfilePage() {
  const { refetch: refetchSession } = useSession()
  const { data, loading, error, refetch, setData } = useApiQuery(() =>
    adminApi.getProfile()
  )

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-5 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="My profile"
        description="Keep your admin contact details up to date. Email changes are handled by the account owner."
      />

      {error ? <ErrorPanel message={error} onRetry={() => void refetch()} /> : null}

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      ) : data ? (
        <>
          <ProfileForm
            profile={data}
            onSaved={(profile) => {
              setData(profile)
              void refetchSession()
            }}
          />
          <Card className="p-4">
            <Alert variant="info">
              Your name and image also appear in the dashboard sidebar and on
              rental receipts.
            </Alert>
          </Card>
        </>
      ) : null}
    </div>
  )
}
