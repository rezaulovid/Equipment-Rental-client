"use client"

import {
  CheckCircle2,
  ClipboardList,
  Clock,
  DollarSign,
  Package,
  RefreshCw,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { adminApi } from "@/lib/api/admin"
import type { EquipmentStatus } from "@/lib/types/admin"
import { useApiQuery } from "@/hooks/use-api-query"
import { AdminPageHeader } from "./_components/admin-page-header"
import { MonthlyBookingsChart } from "./_components/monthly-bookings-chart"
import { StatCard } from "./_components/stat-card"
import { ErrorPanel } from "./_components/state-panels"

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const statusRows: { key: EquipmentStatus; label: string; color: string }[] = [
  { key: "approved", label: "Approved", color: "bg-emerald-500" },
  { key: "pending", label: "Pending", color: "bg-amber-500" },
  { key: "rejected", label: "Rejected", color: "bg-red-500" },
]

export default function AdminOverviewPage() {
  const { data, loading, error, refetch } = useApiQuery(() =>
    adminApi.getAnalytics()
  )

  const totalForBreakdown = data
    ? statusRows.reduce((sum, row) => sum + data.equipmentByStatus[row.key], 0)
    : 0

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="Admin overview"
        description="Platform health at a glance — users, equipment approvals, rentals and revenue."
        actions={
          <Button
            variant="outline"
            onClick={() => void refetch()}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw
              className={`size-4 ${loading ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            Refresh
          </Button>
        }
      />

      {error ? <ErrorPanel message={error} onRetry={() => void refetch()} /> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total users"
          value={data?.totalUsers ?? 0}
          hint="Registered accounts"
          icon={Users}
          loading={loading}
        />
        <StatCard
          label="Total equipment"
          value={data?.totalEquipment ?? 0}
          hint="All owner listings"
          icon={Package}
          tone="blue"
          loading={loading}
        />
        <StatCard
          label="Total bookings"
          value={data?.totalBookings ?? 0}
          hint="Every rental request"
          icon={ClipboardList}
          tone="orange"
          loading={loading}
        />
        <StatCard
          label="Pending approvals"
          value={data?.pendingApprovals ?? 0}
          hint="Waiting for review"
          icon={Clock}
          tone="amber"
          loading={loading}
        />
        <StatCard
          label="Completed rentals"
          value={data?.completedRentals ?? 0}
          hint="Successfully returned"
          icon={CheckCircle2}
          tone="green"
          loading={loading}
        />
        <StatCard
          label="Total revenue"
          value={currency.format(data?.totalRevenue ?? 0)}
          hint="Captured payments"
          icon={DollarSign}
          tone="orange"
          loading={loading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly bookings</CardTitle>
            <CardDescription>
              Booking volume over the last 12 months, straight from the
              bookings collection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyBookingsChart data={data?.monthly ?? []} loading={loading} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equipment by status</CardTitle>
            <CardDescription>
              How the catalogue is split between approved, pending and rejected.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="h-3 w-24 animate-pulse rounded bg-brand-navy-tint" />
                    <div className="h-2.5 w-full animate-pulse rounded-full bg-brand-navy-tint" />
                  </div>
                ))
              : statusRows.map((row) => {
                  const count = data?.equipmentByStatus[row.key] ?? 0
                  const percent =
                    totalForBreakdown > 0
                      ? Math.round((count / totalForBreakdown) * 100)
                      : 0

                  return (
                    <div key={row.key}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-brand-navy dark:text-foreground">
                          {row.label}
                        </span>
                        <span className="text-brand-ink-soft dark:text-muted-foreground">
                          {count} · {percent}%
                        </span>
                      </div>
                      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-brand-navy-tint dark:bg-muted">
                        <div
                          className={`h-full rounded-full ${row.color}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )
                })}

            {!loading && totalForBreakdown === 0 ? (
              <p className="rounded-xl border border-dashed border-brand-navy-line px-4 py-6 text-center text-xs leading-5 text-brand-ink-soft dark:border-border dark:text-muted-foreground">
                No equipment has been submitted yet.
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
