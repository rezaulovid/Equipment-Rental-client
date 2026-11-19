"use client"

import Link from "next/link"
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Clock,
  CreditCard,
  Heart,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  UserRound,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { customerApi } from "@/lib/api/customer"
import { useSession } from "@/lib/auth-client"
import { formatCurrency, formatDate } from "@/lib/rental"
import { useApiQuery } from "@/hooks/use-api-query"
import { CustomerPageHeader } from "./_components/customer-page-header"
import { CustomerStatCard } from "./_components/customer-stat-card"
import { ErrorPanel } from "./_components/state-panels"
import {
  CustomerBookingStatusBadge,
  CustomerPaymentStatusBadge,
} from "./_components/status-badges"

function initials(name?: string | null) {
  if (!name?.trim()) return "C"
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export default function CustomerDashboardPage() {
  const { data: session } = useSession()
  const { data, loading, error, refetch } = useApiQuery(() =>
    customerApi.getOverview()
  )

  const stats = data?.stats
  const profile = data?.profile

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
      <CustomerPageHeader
        title={`Welcome back${session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}`}
        description="Your rentals, payments and saved equipment in one place. Bookings confirmed by Stripe appear here immediately."
        actions={
          <>
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
            <Button
              className="gap-2 bg-brand-orange text-white hover:bg-brand-orange-strong"
              render={<Link href="/equipment" />}
              nativeButton={false}
            >
              <Package className="size-4" aria-hidden="true" />
              Browse equipment
            </Button>
          </>
        }
      />

      {error ? (
        <ErrorPanel message={error} onRetry={() => void refetch()} />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <CustomerStatCard
          label="Total rentals"
          value={stats?.totalRentals ?? 0}
          hint="Every booking on your account"
          icon={ClipboardList}
          loading={loading}
          href="/dashboard/customer/rentals"
        />
        <CustomerStatCard
          label="Active rentals"
          value={stats?.activeRentals ?? 0}
          hint="Paid and currently in progress"
          icon={CalendarCheck}
          tone="orange"
          loading={loading}
          href="/dashboard/customer/rentals"
        />
        <CustomerStatCard
          label="Completed rentals"
          value={stats?.completedRentals ?? 0}
          hint="Successfully returned equipment"
          icon={CheckCircle2}
          tone="green"
          loading={loading}
          href="/dashboard/customer/rentals"
        />
        <CustomerStatCard
          label="Awaiting payment"
          value={stats?.pendingPayments ?? 0}
          hint="Pending or failed payments"
          icon={Clock}
          tone="amber"
          loading={loading}
          href="/dashboard/customer/rentals"
        />
        <CustomerStatCard
          label="Total spent"
          value={formatCurrency(stats?.totalSpent ?? 0)}
          hint="Captured Stripe payments"
          icon={CreditCard}
          tone="blue"
          loading={loading}
          href="/dashboard/customer/payments"
        />
        <CustomerStatCard
          label="Saved favorites"
          value={stats?.favorites ?? 0}
          hint="Equipment you saved for later"
          icon={Heart}
          tone="orange"
          loading={loading}
          href="/dashboard/customer/favorites"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Recent rentals</CardTitle>
              <CardDescription>
                Your latest bookings, payment status and equipment.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              render={<Link href="/dashboard/customer/rentals" />}
              nativeButton={false}
            >
              View all
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-20 animate-pulse rounded-xl bg-brand-navy-tint"
                />
              ))
            ) : data && data.recentBookings.length > 0 ? (
              <ul className="divide-y divide-brand-navy-line overflow-hidden rounded-xl border border-brand-navy-line">
                {data.recentBookings.map((rental) => (
                  <li
                    key={rental.id}
                    className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-navy-tint">
                        {rental.equipmentImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={rental.equipmentImage}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : (
                          <Package
                            className="size-5 text-brand-navy/50"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-brand-navy">
                          {rental.equipmentName}
                        </p>
                        <p className="mt-0.5 text-xs text-brand-ink-soft">
                          {formatDate(rental.startDate)} →{" "}
                          {formatDate(rental.endDate)} · Qty {rental.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <CustomerPaymentStatusBadge
                        status={rental.paymentStatus}
                      />
                      <CustomerBookingStatusBadge
                        status={rental.bookingStatus}
                      />
                      <span className="text-sm font-semibold text-brand-navy">
                        {formatCurrency(rental.totalAmount)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center rounded-xl border border-dashed border-brand-navy-line px-5 py-10 text-center">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-navy-tint text-brand-navy">
                  <ClipboardList className="size-5" aria-hidden="true" />
                </span>
                <p className="mt-3 font-display text-base font-semibold text-brand-navy">
                  No rentals yet
                </p>
                <p className="mt-1 max-w-sm text-sm leading-6 text-brand-ink-soft">
                  Browse equipment, choose your dates, and your first booking
                  will appear here after checkout.
                </p>
                <Button
                  className="mt-4 gap-2 bg-brand-orange text-white hover:bg-brand-orange-strong"
                  render={<Link href="/equipment" />}
                  nativeButton={false}
                >
                  Find equipment
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              The contact details used on your bookings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-navy-tint text-lg font-semibold text-brand-navy ring-2 ring-brand-orange/30">
                {profile?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.image}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  initials(profile?.name ?? session?.user?.name)
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate font-display text-base font-semibold text-brand-navy">
                  {profile?.name ?? session?.user?.name ?? "Customer"}
                </p>
                <p className="truncate text-xs text-brand-ink-soft">
                  {profile?.email ?? session?.user?.email}
                </p>
              </div>
            </div>

            <dl className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Phone
                  className="mt-0.5 size-4 shrink-0 text-brand-orange"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-[11px] font-semibold tracking-[0.1em] text-brand-ink-soft uppercase">
                    Phone
                  </dt>
                  <dd className="text-brand-navy">
                    {profile?.phone || "Not added yet"}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-brand-orange"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-[11px] font-semibold tracking-[0.1em] text-brand-ink-soft uppercase">
                    Address
                  </dt>
                  <dd className="text-brand-navy">
                    {profile?.address || "Not added yet"}
                  </dd>
                </div>
              </div>
            </dl>

            <Button
              variant="outline"
              className="w-full gap-2"
              render={<Link href="/dashboard/customer/profile" />}
              nativeButton={false}
            >
              <UserRound className="size-4" aria-hidden="true" />
              Manage profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
