"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Heart } from "lucide-react"

import { favoritesApi } from "@/lib/api/catalog"
import { useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

/**
 * Real favorites toggle backed by the customer favorites API. Signed-out
 * visitors are sent to sign in and returned to the current page afterwards.
 */
export function FavoriteToggle({
  equipmentId,
  equipmentName,
  initialFavorite = false,
  onChange,
  variant = "icon",
  className,
}: {
  equipmentId: string
  equipmentName: string
  initialFavorite?: boolean
  onChange?: (favorite: boolean) => void
  variant?: "icon" | "button"
  className?: string
}) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite)
  const [trackedInitial, setTrackedInitial] = useState(initialFavorite)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, isPending } = useSession()

  // The details page resolves the saved favorite after mount, so keep the
  // local state in sync when that initial value becomes available.
  if (initialFavorite !== trackedInitial) {
    setTrackedInitial(initialFavorite)
    setIsFavorite(initialFavorite)
  }

  const isCustomer = session?.user?.role === "customer"

  async function toggle() {
    if (busy) return

    if (!session?.user) {
      router.push(`/sign-in?redirectTo=${encodeURIComponent(pathname)}`)
      return
    }

    if (!isCustomer) {
      setError("Only customer accounts can save favorites.")
      return
    }

    const next = !isFavorite
    setIsFavorite(next)
    setBusy(true)
    setError(null)
    onChange?.(next)

    try {
      if (next) {
        await favoritesApi.add(equipmentId)
      } else {
        await favoritesApi.remove(equipmentId)
      }
    } catch (err) {
      setIsFavorite(!next)
      onChange?.(!next)
      setError(
        err instanceof Error ? err.message : "Could not update favorites."
      )
    } finally {
      setBusy(false)
    }
  }

  const label = isFavorite
    ? `Remove ${equipmentName} from favorites`
    : `Save ${equipmentName} to favorites`

  if (variant === "button") {
    return (
      <div className={cn("inline-flex flex-col items-start gap-1", className)}>
        <button
          type="button"
          onClick={toggle}
          disabled={busy || isPending}
          aria-pressed={isFavorite}
          aria-label={label}
          className={cn(
            "inline-flex h-10 items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 disabled:opacity-60",
            isFavorite
              ? "border-brand-orange/40 bg-brand-orange-soft text-brand-orange-deep hover:bg-brand-orange/15"
              : "border-brand-navy-line bg-white text-brand-navy hover:border-brand-orange/40 hover:text-brand-orange-deep"
          )}
        >
          <Heart
            className={cn("size-4", isFavorite && "fill-current")}
            aria-hidden="true"
          />
          {isFavorite ? "Saved" : "Save to favorites"}
        </button>
        {error ? (
          <span role="alert" className="text-xs text-red-600">
            {error}
          </span>
        ) : null}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy || isPending}
      aria-label={label}
      aria-pressed={isFavorite}
      title={error ?? label}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full bg-white/95 text-brand-navy shadow-sm backdrop-blur transition-transform duration-200 outline-none hover:scale-105 hover:text-brand-orange focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70",
        isFavorite && "text-brand-orange",
        className
      )}
    >
      <Heart
        aria-hidden="true"
        strokeWidth={2.2}
        className={cn(
          "size-[18px] transition-colors",
          isFavorite && "fill-current"
        )}
      />
    </button>
  )
}
