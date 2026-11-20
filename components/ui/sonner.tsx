"use client"

import type { CSSProperties } from "react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

/**
 * Sonner toaster wired to the RentPro design tokens (navy ink, warm borders,
 * rounded cards) and to the active next-themes colour scheme.
 */
function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      richColors
      closeButton
      offset={88}
      mobileOffset={16}
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-border": "var(--border)",
          "--normal-text": "var(--foreground)",
          "--info-bg": "var(--muted)",
          "--info-border": "var(--border)",
          "--info-text": "var(--foreground)",
          "--border-radius": "0.75rem",
          fontFamily: "var(--font-sans)",
        } as CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "font-sans",
          title: "font-semibold",
          description: "text-xs",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
