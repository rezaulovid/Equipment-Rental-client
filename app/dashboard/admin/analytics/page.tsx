"use client"

import Link from "next/link"
import {
  ArrowLeft,
  Boxes,
  CalendarDays,
  DollarSign,
  Users,
} from "lucide-react"

import { useApiQuery } from "@/hooks/use-api-query"
import { adminApi } from "@/lib/api/admin"
import type { MonthlyBookingPoint } from "@/lib/types/admin"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorPanel } from "../_components/state-panels"

const chartWidth = 520
const chartHeight = 230
const plot = { left: 54, right: 506, top: 16, bottom: 190 }
const plotWidth = plot.right - plot.left
const plotHeight = plot.bottom - plot.top

type ChartPoint = {
  label: string
  revenue: number
  bookings: number
}

function getChartPoints(data: MonthlyBookingPoint[] = []): ChartPoint[] {
  const referenceMonths = ["Mar", "Oct", "Nov"]
  const matchingMonths = data.filter((point) =>
    referenceMonths.includes(point.label.split(" ")[0] ?? point.month)
  )
  const visibleMonths = matchingMonths.length === referenceMonths.length
    ? matchingMonths
    : data.slice(-3)

  return visibleMonths.map((point) => ({
    label: point.label.split(" ")[0] ?? point.month,
    revenue: point.revenue,
    bookings: point.bookings,
  }))
}

function getAxisTicks(values: number[]) {
  const maxValue = Math.max(...values, 1)
  const roughStep = maxValue / 4
  const magnitude = 10 ** Math.floor(Math.log10(roughStep))
  const normalizedStep = roughStep / magnitude
  const step =
    (normalizedStep <= 1
      ? 1
      : normalizedStep <= 2
        ? 2
        : normalizedStep <= 2.5
          ? 2.5
          : normalizedStep <= 5
            ? 5
            : 10) * magnitude
  const max = step * 4

  return Array.from({ length: 5 }, (_, index) => index * step).map((value) => ({
    value,
    y: plot.bottom - (value / max) * plotHeight,
  }))
}

function formatAxisValue(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: value >= 1_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value)
}

function ChartLoadingState() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[210px] w-full rounded-xl" />
      <div className="flex justify-around">
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-8" />
      </div>
    </div>
  )
}

function RevenueChart({ points }: { points: ChartPoint[] }) {
  const ticks = getAxisTicks(points.map((point) => point.revenue))
  const maxValue = ticks[ticks.length - 1]?.value || 1
  const barWidth = Math.min(78, plotWidth / Math.max(points.length * 1.8, 1))

  return (
    <svg
      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      className="block h-auto w-full"
      role="img"
      aria-label={`Monthly platform revenue: ${points.map((point) => `${point.label} $${point.revenue.toLocaleString()}`).join(", ") || "no recorded revenue"}`}
    >
      {ticks.map(({ value, y }) => (
        <g key={value}>
          <line
            x1={plot.left}
            x2={plot.right}
            y1={y}
            y2={y}
            stroke="#eee7df"
            strokeDasharray="2 4"
          />
          <text
            x={plot.left - 9}
            y={y + 3}
            textAnchor="end"
            fill="#9b9188"
            fontSize="9"
          >
            {formatAxisValue(value)}
          </text>
        </g>
      ))}

      <line
        x1={plot.left}
        x2={plot.left}
        y1={plot.top}
        y2={plot.bottom}
        stroke="#d8cec4"
      />
      <line
        x1={plot.left}
        x2={plot.right}
        y1={plot.bottom}
        y2={plot.bottom}
        stroke="#d8cec4"
      />

      {points.map((point, index) => {
        const x =
          points.length === 1
            ? plot.left + plotWidth / 2
            : plot.left + (index * plotWidth) / (points.length - 1)
        const barHeight = (point.revenue / maxValue) * plotHeight
        const y = plot.bottom - barHeight

        return (
          <g key={`${point.label}-${index}`}>
            <line
              x1={x}
              x2={x}
              y1={plot.top}
              y2={plot.bottom}
              stroke="#f1ebe5"
              strokeDasharray="2 4"
            />
            <rect
              x={x - barWidth / 2}
              y={y}
              width={barWidth}
              height={Math.max(barHeight, 0)}
              rx="5"
              fill="#10b981"
            >
              <title>{`${point.label}: $${point.revenue.toLocaleString()}`}</title>
            </rect>
            <text
              x={x}
              y={plot.bottom + 17}
              textAnchor="middle"
              fill="#8f857d"
              fontSize="10"
            >
              {point.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function BookingChart({ points }: { points: ChartPoint[] }) {
  const ticks = getAxisTicks(points.map((point) => point.bookings))
  const maxValue = ticks[ticks.length - 1]?.value || 1
  const coordinates = points.map((point, index) => ({
    x:
      points.length === 1
        ? plot.left + plotWidth / 2
        : plot.left + (index * plotWidth) / (points.length - 1),
    y: plot.bottom - (point.bookings / maxValue) * plotHeight,
    point,
  }))
  const path = coordinates.reduce((result, current, index) => {
    if (index === 0) return `M ${current.x} ${current.y}`
    const previous = coordinates[index - 1]
    const midpoint = (previous.x + current.x) / 2
    return `${result} Q ${midpoint} ${previous.y}, ${current.x} ${current.y}`
  }, "")

  return (
    <svg
      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      className="block h-auto w-full"
      role="img"
      aria-label={`Monthly booking volume: ${points.map((point) => `${point.label} ${point.bookings} bookings`).join(", ") || "no recorded bookings"}`}
    >
      {ticks.map(({ value, y }) => (
        <g key={value}>
          <line
            x1={plot.left}
            x2={plot.right}
            y1={y}
            y2={y}
            stroke="#eee7df"
            strokeDasharray="2 4"
          />
          <text
            x={plot.left - 9}
            y={y + 3}
            textAnchor="end"
            fill="#9b9188"
            fontSize="9"
          >
            {formatAxisValue(value)}
          </text>
        </g>
      ))}

      <line
        x1={plot.left}
        x2={plot.left}
        y1={plot.top}
        y2={plot.bottom}
        stroke="#d8cec4"
      />
      <line
        x1={plot.left}
        x2={plot.right}
        y1={plot.bottom}
        y2={plot.bottom}
        stroke="#d8cec4"
      />

      {path ? (
        <path
          d={path}
          fill="none"
          stroke="#f97316"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
      ) : null}
      {coordinates.map(({ x }, index) => (
        <line
          key={`grid-${index}`}
          x1={x}
          x2={x}
          y1={plot.top}
          y2={plot.bottom}
          stroke="#f1ebe5"
          strokeDasharray="2 4"
        />
      ))}
      {coordinates.map(({ x, y, point }, index) => (
        <g key={`${point.label}-${index}`}>
          <circle cx={x} cy={y} r="4.5" fill="#f97316">
            <title>{`${point.label}: ${point.bookings} bookings`}</title>
          </circle>
          <text
            x={x}
            y={plot.bottom + 17}
            textAnchor="middle"
            fill="#8f857d"
            fontSize="10"
          >
            {point.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function AdminAnalyticsPage() {
  const { data, loading, error, refetch } = useApiQuery(() =>
    adminApi.getAnalytics()
  )
  const points = getChartPoints(data?.monthly)

  const stats = [
    {
      label: "Platform Revenue",
      value:
        data?.totalRevenue.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }) ?? "$0",
      description: "Total paid rentals",
      icon: DollarSign,
      accent: "text-emerald-600",
    },
    {
      label: "Total Bookings",
      value: data?.totalBookings ?? 0,
      description: "Across all categories",
      icon: CalendarDays,
      accent: "text-orange-600",
    },
    {
      label: "Total Users",
      value: data?.totalUsers ?? 0,
      description: "Registered platform accounts",
      icon: Users,
      accent: "text-purple-600",
    },
    {
      label: "Total Listed Machinery",
      value: data?.totalEquipment ?? 0,
      description: `${data?.pendingApprovals ?? 0} pending review`,
      icon: Boxes,
      accent: "text-blue-600",
    },
  ]

  return (
    <div className="min-h-full bg-[#fbf8f3] px-4 py-5 text-[#3d3028] sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto w-full max-w-[1400px] space-y-4 sm:space-y-5">
        <Link
          href="/dashboard/admin"
          className="inline-flex items-center gap-2 rounded-md text-xs font-semibold text-[#71645b] transition-colors hover:text-[#35271f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to Admin Console
        </Link>

        <Card className="border-[#eee5dc] p-4 shadow-[0_2px_8px_rgba(74,49,29,0.04)] sm:p-5">
          <h1 className="font-display text-xl font-bold tracking-[-0.02em] text-[#3d3028] sm:text-2xl">
            Global Platform Performance Overview
          </h1>
          <p className="mt-1 text-xs leading-5 text-[#877b72] sm:text-sm">
            Comprehensive financial metrics, rental confirmation rates, and
            platform booking velocities.
          </p>
        </Card>

        {error ? <ErrorPanel message={error} onRetry={() => void refetch()} /> : null}

        <section
          aria-label="Platform statistics"
          className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="min-h-[104px] border-[#eee5dc] p-4 shadow-[0_2px_8px_rgba(74,49,29,0.04)] sm:p-4"
            >
              <div className="flex items-center gap-2">
                <stat.icon
                  className={`size-3.5 ${stat.accent}`}
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                <h2 className="text-[11px] font-semibold text-[#65584f]">
                  {stat.label}
                </h2>
              </div>
              {loading ? (
                <Skeleton className="mt-2 h-7 w-24" />
              ) : (
                <p className="mt-1.5 font-display text-[25px] leading-none font-bold tracking-[-0.03em] text-[#3b2b22]">
                  {stat.value}
                </p>
              )}
              <p className={`mt-1.5 text-[10px] font-semibold ${stat.accent}`}>
                {loading ? "Loading latest totals…" : stat.description}
              </p>
            </Card>
          ))}
        </section>

        <section
          aria-label="Platform analytics charts"
          className="grid gap-4 lg:grid-cols-2"
        >
          <Card className="min-w-0 border-[#eee5dc] p-4 shadow-[0_2px_8px_rgba(74,49,29,0.04)] sm:p-5">
            <h2 className="font-display text-sm font-semibold text-[#493930]">
              Monthly Platform Revenue ($)
            </h2>
            <div className="mt-3">
              {loading ? (
                <ChartLoadingState />
              ) : (
                <RevenueChart points={points} />
              )}
            </div>
          </Card>

          <Card className="min-w-0 border-[#eee5dc] p-4 shadow-[0_2px_8px_rgba(74,49,29,0.04)] sm:p-5">
            <h2 className="font-display text-sm font-semibold text-[#493930]">
              Monthly Booking Volume
            </h2>
            <div className="mt-3">
              {loading ? (
                <ChartLoadingState />
              ) : (
                <BookingChart points={points} />
              )}
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
