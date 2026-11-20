"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Star } from "lucide-react"

import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { reviewsApi } from "@/lib/api/reviews"
import type { CustomerReview } from "@/lib/api/reviews"

export function ReviewForm({ bookingId }: { bookingId: string }) {
  const [review, setReview] = useState<CustomerReview | null>(null)
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    reviewsApi
      .getForBooking(bookingId)
      .then((savedReview) => {
        if (active) setReview(savedReview)
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Your review status could not be loaded."
          )
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [bookingId])

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return

    setSaving(true)
    setError(null)

    try {
      const savedReview = await reviewsApi.create({
        bookingId,
        rating,
        message: message.trim(),
      })
      setReview(savedReview)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Your review could not be saved."
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-3 rounded-xl border border-brand-navy-line p-4">
      <div>
        <h3 className="font-display text-sm font-semibold text-brand-navy">
          Your review
        </h3>
        <p className="mt-1 text-xs leading-5 text-brand-ink-soft">
          Reviews are available for paid, completed rentals.
        </p>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}

      {loading ? (
        <p className="text-sm text-brand-ink-soft">Loading review status…</p>
      ) : review ? (
        <div className="space-y-2">
          <div
            className="flex gap-1"
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
          <p className="text-sm leading-6 text-brand-navy">{review.message}</p>
          <p className="text-xs text-brand-ink-soft">
            Your review is published on the homepage.
          </p>
        </div>
      ) : (
        <form onSubmit={submitReview} className="space-y-3">
          <fieldset>
            <legend className="mb-2 text-xs font-medium text-brand-navy">
              Rating
            </legend>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => {
                const value = index + 1
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    aria-label={`${value} star${value === 1 ? "" : "s"}`}
                    aria-pressed={rating === value}
                    className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                  >
                    <Star
                      className={`size-5 ${
                        value <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                )
              })}
            </div>
          </fieldset>
          <Textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            minLength={20}
            maxLength={500}
            required
            placeholder="Share your experience (20–500 characters)"
            aria-label="Review"
          />
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-brand-ink-soft">
              {message.trim().length}/500
            </span>
            <Button
              type="submit"
              size="sm"
              disabled={saving || message.trim().length < 20}
              className="bg-brand-orange text-white hover:bg-brand-orange-strong"
            >
              {saving ? "Publishing…" : "Publish review"}
            </Button>
          </div>
        </form>
      )}
    </section>
  )
}
