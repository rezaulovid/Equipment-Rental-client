"use client"

import { Quote, RefreshCw, Star } from "lucide-react"

import { SectionHeading } from "@/components/home/section-heading"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { reviewsApi } from "@/lib/api/reviews"
import { useApiQuery } from "@/hooks/use-api-query"

export function CustomerReviews() {
  const { data: reviewsData, loading, error, refetch } = useApiQuery(() =>
    reviewsApi.list()
  )
  const reviews = reviewsData ?? []

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
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
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
        ) : reviews.length > 0 ? (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {reviews.slice(0, 4).map((review) => (
              <li key={review.id} className="min-w-0">
                <article className="flex h-full flex-col rounded-2xl border border-[#E4EAF3] bg-white p-5 shadow-[0_14px_32px_-28px_rgba(7,29,73,0.5)]">
                  <Quote
                    className="size-7 text-[#FF6B00]"
                    aria-hidden="true"
                  />
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
                  <p className="mt-5 border-t border-[#EEF2F8] pt-4 text-sm font-semibold text-[#071D49]">
                    {review.customerName}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Verified completed rental
                  </p>
                </article>
              </li>
            ))}
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
