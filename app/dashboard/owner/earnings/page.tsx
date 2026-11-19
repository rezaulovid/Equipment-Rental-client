"use client"

import { CircleCheck, DollarSign, ReceiptText, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ownerApi } from "@/lib/api/owner"
import { formatCurrency, formatDate } from "@/lib/rental"
import { useApiQuery } from "@/hooks/use-api-query"
import type { MonthlyBookingPoint } from "@/lib/types/admin"
import { AdminPageHeader } from "../../admin/_components/admin-page-header"
import { MonthlyBookingsChart } from "../../admin/_components/monthly-bookings-chart"
import { StatCard } from "../../admin/_components/stat-card"
import { ErrorPanel, TableEmpty } from "../../admin/_components/state-panels"
import { PaymentStatusBadge } from "../../admin/_components/status-badge"

function shortId(value: string) {
  if (!value) return "—"
  return value.length > 18 ? `${value.slice(0, 10)}…${value.slice(-4)}` : value
}

export default function OwnerEarningsPage() {
  const { data, loading, error, refetch } = useApiQuery(() => ownerApi.getEarnings())

  const earnings = data

  const monthly: MonthlyBookingPoint[] = (earnings?.monthly ?? []).map(
    (point) => ({
      month: point.month,
      label: point.label,
      bookings: 0,
      revenue: point.revenue,
    })
  )

  const paidRentals = earnings?.rentals ?? []

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-5 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="Earnings"
        description="Revenue from your equipment, calculated from verified Stripe payment records."
        actions={
          <Button
            variant="outline"
            onClick={() => void refetch()}
            disabled={loading}
            className="gap-2"
          >
            Refresh
          </Button>
        }
      />

      {error ? <ErrorPanel message={error} onRetry={() => void refetch()} /> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total earnings"
          value={formatCurrency(earnings?.totalEarnings ?? 0)}
          hint="Verified paid rentals"
          icon={DollarSign}
          tone="orange"
          loading={loading}
        />
        <StatCard
          label="Earnings this month"
          value={formatCurrency(earnings?.earningsThisMonth ?? 0)}
          hint="Paid in the current month"
          icon={Wallet}
          tone="green"
          loading={loading}
        />
        <StatCard
          label="Paid rentals"
          value={earnings?.paidRentals ?? 0}
          hint="Completed Stripe payments"
          icon={CircleCheck}
          tone="green"
          loading={loading}
        />
        <StatCard
          label="Payment records"
          value={paidRentals.length}
          hint="Collected in the period"
          icon={ReceiptText}
          tone="blue"
          loading={loading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly earnings</CardTitle>
            <CardDescription>
              Revenue from verified payments over the last 12 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-60 items-end gap-2">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex h-full flex-1 items-end rounded-t-md bg-brand-navy-tint"
                    style={{ height: `${20 + ((index * 37) % 60)}%` }}
                  />
                ))}
              </div>
            ) : (
              <MonthlyBookingsChart data={monthly} loading={loading} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paid rentals</CardTitle>
            <CardDescription>
              Every rental that reached a verified paid state.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-14 animate-pulse rounded-xl bg-brand-navy-tint" />
                ))}
              </div>
            ) : paidRentals.length === 0 ? (
              <TableEmpty
                colSpan={1}
                icon={ReceiptText}
                title="No paid rentals yet"
                description="Earnings will be listed here once a customer completes a payment for your equipment."
              />
            ) : (
              <ul className="divide-y divide-brand-navy-line rounded-xl border border-brand-navy-line">
                {paidRentals.slice(0, 5).map((rental) => (
                  <li
                    key={rental.id}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-brand-navy">
                        {rental.equipmentName || "Equipment"}
                      </p>
                      <p className="mt-0.5 text-xs text-brand-ink-soft">
                        {formatDate(rental.paidAt ?? rental.createdAt)} · Booking{" "}
                        {shortId(rental.bookingId)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-brand-navy">
                        {formatCurrency(rental.amount, rental.currency)}
                      </span>
                      <PaymentStatusBadge status={rental.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <p className="flex items-center gap-2 text-xs text-brand-ink-soft">
        Earnings only include payments confirmed by Stripe. Owners cannot modify
        payment records — those changes belong to the payment flow.
      </p>
    </div>
  )
}
