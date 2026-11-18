"use client"

import { useState } from "react"
import { Heart } from "lucide-react"

import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  equipmentName: string
}

export function FavoriteButton({ equipmentName }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <button
      type="button"
      aria-label={
        isFavorite
          ? `Remove ${equipmentName} from favorites`
          : `Save ${equipmentName} to favorites`
      }
      aria-pressed={isFavorite}
      onClick={() => setIsFavorite((favorite) => !favorite)}
      className="absolute top-3 left-3 inline-flex size-9 items-center justify-center rounded-full bg-white/95 text-[#071D49] shadow-sm backdrop-blur transition-transform duration-200 outline-none hover:scale-105 hover:text-[#FF6B00] focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2"
    >
      <Heart
        aria-hidden="true"
        strokeWidth={2.2}
        className={cn(
          "size-[18px] transition-colors",
          isFavorite && "fill-[#FF6B00] text-[#FF6B00]"
        )}
      />
    </button>
  )
}
