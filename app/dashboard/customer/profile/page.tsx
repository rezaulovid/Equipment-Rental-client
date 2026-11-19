"use client"

import { Alert } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { customerApi } from "@/lib/api/customer"
import { useApiQuery } from "@/hooks/use-api-query"
import { CustomerPageHeader } from "../_components/customer-page-header"
import { CustomerProfileForm } from "../_components/customer-profile-form"
import { ErrorPanel } from "../_components/state-panels"

export default function CustomerProfilePage() {
  const { data, loading, error, refetch, setData } = useApiQuery(() =>
    customerApi.getProfile()
  )

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-5 p-4 sm:p-6 lg:p-8">
      <CustomerPageHeader
        title="Profile"
        description="Keep the contact details used on your bookings up to date. Your email is tied to your sign-in and stays read only."
      />

      {error ? (
        <ErrorPanel message={error} onRetry={() => void refetch()} />
      ) : null}

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-[28rem] rounded-2xl" />
        </div>
      ) : data ? (
        <>
          <CustomerProfileForm profile={data} onSaved={setData} />
          <Card className="p-4">
            <Alert variant="info">
              Your name, phone and address are prefilled when you book, and your
              name and image also appear in the dashboard sidebar.
            </Alert>
          </Card>
        </>
      ) : null}
    </div>
  )
}
