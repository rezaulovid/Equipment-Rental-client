"use client"

import Link from "next/link"
import {
  CircleCheck,
  Clock,
  CreditCard,
  ExternalLink,
  Package,
  RefreshCw,
  ReceiptText,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { customerApi } from "@/lib/api/customer"
import { formatCurrency, formatDate } from "@/lib/rental"
import { useApiQuery } from "@/hooks/use-api-query"
import { CustomerPageHeader } from "../_components/customer-page-header"
import { CustomerStatCard } from "../_components/customer-stat-card"
import {
  ErrorPanel,
  TableEmpty,
  TableLoading,
} from "../_components/state-panels"
import { CustomerPaymentStatusBadge } from "../_components/status-badges"

function shortId(value: string) {
  if (!value) return "—"
  return value.length > 18 ? `${value.slice(0, 10)}…${value.slice(-4)}` : value
}

export default function CustomerPaymentsPage() {
  const { data, loading, error, refetch } = useApiQuery(() =>
    customerApi.getPayments()
  )

  const payments = data ?? []
  const paidPayments = payments.filter((payment) => payment.status === "paid")
  const totalPaid = paidPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  )
  const pendingPayments = payments.filter((payment) =>
    ["pending", "unpaid"].includes(payment.status)
  ).length
  const failedPayments = payments.filter(
    (payment) => payment.status === "failed"
  ).length

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-5 p-4 sm:p-6 lg:p-8">
      <CustomerPageHeader
        title="Payment history"
        description="Every Stripe attempt on your account. Successful payments are confirmed by Stripe and update the matching rental automatically."
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
              Rent equipment
            </Button>
          </>
        }
      />

      {error ? (
        <ErrorPanel message={error} onRetry={() => void refetch()} />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CustomerStatCard
          label="Total paid"
          value={formatCurrency(totalPaid)}
          hint="Captured Stripe payments"
          icon={CreditCard}
          tone="green"
          loading={loading}
        />
        <CustomerStatCard
          label="Successful payments"
          value={paidPayments.length}
          hint="Confirmed by Stripe"
          icon={CircleCheck}
          tone="blue"
          loading={loading}
        />
        <CustomerStatCard
          label="Awaiting payment"
          value={pendingPayments}
          hint="Open checkout attempts"
          icon={Clock}
          tone="amber"
          loading={loading}
        />
        <CustomerStatCard
          label="Failed attempts"
          value={failedPayments}
          hint="Cancelled, expired or declined"
          icon={ReceiptText}
          tone="orange"
          loading={loading}
        />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Equipment</TableHead>
              <TableHead>Booking</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Transaction</TableHead>
              <TableHead className="text-right">Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableLoading colSpan={8} rows={6} />
            ) : payments.length === 0 ? (
              <TableEmpty
                colSpan={8}
                icon={CreditCard}
                title="No payments yet"
                description="Payment attempts appear here as soon as you start a rental checkout."
                action={
                  <Button
                    className="gap-2 bg-brand-orange text-white hover:bg-brand-orange-strong"
                    render={<Link href="/equipment" />}
                    nativeButton={false}
                  >
                    <Package className="size-4" aria-hidden="true" />
                    Find equipment
                  </Button>
                }
              />
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(payment.paidAt ?? payment.createdAt)}
                  </TableCell>
                  <TableCell className="min-w-[180px]">
                    <p className="font-medium text-brand-navy">
                      {payment.equipmentName || "Equipment"}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-brand-ink-soft">
                      {shortId(payment.equipmentId)}
                    </p>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className="font-mono text-xs text-brand-ink-soft">
                      {shortId(payment.bookingId)}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-semibold">
                    {formatCurrency(payment.amount, payment.currency)}
                  </TableCell>
                  <TableCell className="capitalize">
                    {payment.method || "stripe"}
                  </TableCell>
                  <TableCell>
                    <CustomerPaymentStatusBadge status={payment.status} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className="font-mono text-xs text-brand-ink-soft">
                      {shortId(payment.transactionId)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {payment.receiptUrl ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        render={
                          <a
                            href={payment.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        }
                        nativeButton={false}
                      >
                        Receipt
                        <ExternalLink
                          className="size-3.5"
                          aria-hidden="true"
                        />
                      </Button>
                    ) : (
                      <span className="text-xs text-brand-ink-soft">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <p className="text-xs text-brand-ink-soft">
        {payments.length} payment record{payments.length === 1 ? "" : "s"}.
        Failed and cancelled attempts are kept for your records and never
        overwrite a successful payment.
      </p>
    </div>
  )
}
