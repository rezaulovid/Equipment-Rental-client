"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "@/lib/auth-client"
import { DEFAULT_USER_ROLE, isUserRole } from "@/lib/user-role"

/**
 * Role-aware dashboard entry point. Header links target `/dashboard`, and this
 * page forwards the signed-in user to the dashboard for their role. Every API
 * request is still authorized by the Express server.
 */
export default function DashboardRedirectPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (isPending) return

    if (!session?.user) {
      router.replace("/sign-in?redirectTo=%2Fdashboard")
      return
    }

    const role = isUserRole(session.user.role)
      ? session.user.role
      : DEFAULT_USER_ROLE

    router.replace(`/dashboard/${role}`)
  }, [isPending, session, router])

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-4 p-4 sm:p-6 lg:p-8">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-80" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
