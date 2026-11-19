"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShieldAlert, ShieldCheck } from "lucide-react"

import { useSession } from "@/lib/auth-client"
import { isUserRole } from "@/lib/user-role"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Client-side guard for the admin section. The API is the real security
 * boundary (verifyToken + verifyAdmin); this only keeps non-admins from
 * rendering an empty dashboard.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const role = session?.user?.role

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/sign-in")
    }
  }, [isPending, session, router])

  if (isPending) {
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

  if (!session?.user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <p className="text-sm text-brand-ink-soft">Redirecting to sign in…</p>
      </div>
    )
  }

  if (!isUserRole(role) || role !== "admin") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-brand-navy-line bg-white p-8 text-center shadow-sm dark:border-border dark:bg-card">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <ShieldAlert className="size-5" aria-hidden="true" />
          </span>
          <h1 className="mt-4 font-display text-xl font-semibold text-brand-navy dark:text-foreground">
            Admin access required
          </h1>
          <p className="mt-2 text-sm leading-6 text-brand-ink-soft dark:text-muted-foreground">
            This area is restricted to administrator accounts. If you believe
            this is a mistake, contact a platform admin.
          </p>
          <Button
            className="mt-5 gap-2 bg-brand-orange text-white hover:bg-brand-orange-strong"
            render={<Link href="/" />}
            nativeButton={false}
          >
            <ShieldCheck className="size-4" aria-hidden="true" />
            Back to home
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
