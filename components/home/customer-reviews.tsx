"use client"

import { Quote, RefreshCw, Star, Wrench } from "lucide-react"

import { SectionHeading } from "@/components/home/section-heading"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { reviewsApi, type CustomerReview } from "@/lib/api/reviews"
import { useApiQuery } from "@/hooks/use-api-query"

type DisplayReview = CustomerReview & {
  equipmentName?: string
  isDemo?: boolean
}

const MAX_DISPLAYED_REVIEWS = 5

/**
 * Static sample reviews fill empty homepage slots only. They are never sent to
 * the API or written to the database, and genuine reviews always appear first.
 */
const demoReviews: DisplayReview[] = [
  {
    id: "demo-review-1",
    bookingId: "demo-booking-1",
    customerName: "Marcus Reed",
    rating: 5,
    message:
      "The CAT 320 was delivered on time and in excellent condition. It made short work of our site prep, and the handover covered everything we needed to get started safely.",
    equipmentName: "CAT 320 Excavator",
    createdAt: "2026-11-08T10:00:00.000Z",
    isDemo: true,
  },
  {
    id: "demo-review-2",
    bookingId: "demo-booking-2",
    customerName: "Priya Shah",
    rating: 4,
    message:
      "Booked the Canon R5 kit for a weekend shoot. Everything arrived neatly packed and the battery life held up all day. Pickup was straightforward, though an extra memory card would have been useful.",
    equipmentName: "Canon EOS R5 Kit",
    createdAt: "2026-10-22T10:00:00.000Z",
    isDemo: true,
  },
  {
    id: "demo-review-3",
    bookingId: "demo-booking-3",
    customerName: "Daniel Ortiz",
    rating: 5,
    message:
      "The scissor lift was stable, clean, and ready to go when I arrived. The team explained the safety controls clearly and the weekly rate was better than the other quotes I received.",
    equipmentName: "Scissor Lift 12m",
    createdAt: "2026-10-03T10:00:00.000Z",
    isDemo: true,
  },
  {
    id: "demo-review-4",
    bookingId: "demo-booking-4",
    customerName: "Emily Carter",
    rating: 4,
    message:
      "Used the concrete mixer for a small patio project. It ran smoothly and was easy to move around the site. The rental process was quick, but traffic made the delivery window a little tight.",
    equipmentName: "Electric Concrete Mixer",
    createdAt: "2026-09-19T10:00:00.000Z",
    isDemo: true,
  },
  {
    id: "demo-review-5",
    bookingId: "demo-booking-5",
    customerName: "James Whitfield",
    rating: 5,
    message:
      "Needed a reliable pickup for a three-day job and the Hilux handled it perfectly. Clean interior, full tank, and a very smooth return inspection. Would definitely rent again.",
    equipmentName: "Toyota Hilux 4x4",
    createdAt: "2026-09-02T10:00:00.000Z",
    isDemo: true,
  },
]

const reviewDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
})

function formatReviewDate(value: string | null) {
  if (!value) return null

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : reviewDateFormatter.format(date)
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

  return initials || "C"
}

export function CustomerReviews() {
  const { data: reviewsData, loading, error, refetch } = useApiQuery(() =>
    reviewsApi.list()
  )
  const reviews = reviewsData ?? []
  const displayedReviews: DisplayReview[] = [
    ...reviews,
    ...demoReviews,
  ].slice(0, MAX_DISPLAYED_REVIEWS)

  return (
    <section
      aria-labelledby="customer-reviews-heading"
      className="bg-[#F8FAFC] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          id="customer-reviews-heading"
          align="center"
          title="Customer Reviews"
          subtitle="Feedback shared by customers after completing a rental."
        />

        {error ? (
          <div className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-red-200 bg-white p-6 text-center">
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
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
              Try again
            </Button>
          </div>
        ) : loading ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: MAX_DISPLAYED_REVIEWS }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#E4EAF3] bg-white p-5"
              >
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="mt-5 h-4 w-28" />
                <Skeleton className="mt-4 h-20 w-full" />
                <Skeleton className="mt-5 h-4 w-24" />
              </div>
            ))}
          </div>
        ) : displayedReviews.length > 0 ? (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displayedReviews.map((review) => {
              const reviewDate = formatReviewDate(review.createdAt)

              return (
                <li key={review.id} className="min-w-0">
                  <article className="flex h-full flex-col rounded-2xl border border-[#E4EAF3] bg-white p-5 shadow-[0_14px_32px_-28px_rgba(7,29,73,0.5)]">
                    <div className="flex items-start justify-between gap-3">
                      <Quote
                        className="size-7 text-[#FF6B00]"
                        aria-hidden="true"
                      />
                      {review.isDemo ? (
                        <span className="rounded-full bg-[#FFF1E5] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#D95F00] uppercase">
                          Demo review
                        </span>
                      ) : null}
                    </div>
                    <div
                      className="mt-4 flex gap-1"
                      aria-label={`${review.rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`size-4 ${
                            index < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200"
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                      {review.message}
                    </p>
                    {review.equipmentName ? (
                      <p className="mt-3 flex items-start gap-1.5 text-xs font-medium text-[#5B6B84]">
                        <Wrench
                          className="mt-0.5 size-3.5 shrink-0 text-[#FF6B00]"
                          aria-hidden="true"
                        />
                        <span>{review.equipmentName}</span>
                      </p>
                    ) : null}
                    <div className="mt-5 flex items-center gap-3 border-t border-[#EEF2F8] pt-4">
                      <span
                        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#FFF1E5] text-xs font-semibold text-[#D95F00]"
                        aria-hidden="true"
                      >
                        {getInitials(review.customerName)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#071D49]">
                          {review.customerName}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {review.isDemo
                            ? "Sample feedback"
                            : "Verified completed rental"}
                          {reviewDate ? ` · ${reviewDate}` : null}
                        </p>
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="mx-auto mt-10 max-w-xl rounded-2xl border border-dashed border-[#D5DFEC] bg-white px-6 py-8 text-center text-sm leading-6 text-slate-600">
            No customer reviews have been published yet. Customers can leave a
            review after a paid rental is marked complete.
          </p>
        )}
      </div>
    </section>
  )
}
