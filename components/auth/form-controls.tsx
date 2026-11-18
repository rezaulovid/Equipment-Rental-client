"use client"

import type { InputHTMLAttributes, ReactNode } from "react"
import { CheckCircle2, Eye, EyeOff, Info } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function AuthField({
  id,
  label,
  hint,
  describedBy,
  children,
}: {
  id: string
  label: string
  hint?: string
  describedBy?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-[13.5px] font-semibold text-[#071D49]"
      >
        {label}
      </label>
      {children}
      {hint ? (
        <p id={describedBy} className="text-xs leading-5 text-[#7B8AA3]">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function AuthInput({
  icon,
  trailing,
  className,
  ...props
}: {
  icon: ReactNode
  trailing?: ReactNode
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#8A99B1]"
      >
        {icon}
      </span>
      <input
        className={cn(
          "h-[52px] w-full rounded-xl border border-[#E3E9F2] bg-[#FBFCFE] pl-12 text-[15px] font-medium text-[#071D49] shadow-[inset_0_1px_2px_rgba(7,29,73,0.03)] transition-colors outline-none placeholder:font-normal placeholder:text-[#93A1B8] hover:border-[#CBD8E8] focus:border-[#FF6B00] focus:bg-white focus:ring-4 focus:ring-[#FF6B00]/15 aria-invalid:border-[#DC2626] aria-invalid:ring-4 aria-invalid:ring-[#DC2626]/15",
          trailing ? "pr-12" : "pr-4",
          className
        )}
        {...props}
      />
      {trailing ? (
        <span className="absolute top-1/2 right-1.5 -translate-y-1/2">
          {trailing}
        </span>
      ) : null}
    </div>
  )
}

export function PasswordVisibilityToggle({
  visible,
  onToggle,
}: {
  visible: boolean
  onToggle: () => void
}) {
  const label = visible ? "Hide password" : "Show password"

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      aria-pressed={visible}
      className="inline-flex size-9 items-center justify-center rounded-lg text-[#7B8AA3] transition-colors outline-none hover:bg-[#F1F5FB] hover:text-[#071D49] focus-visible:ring-2 focus-visible:ring-[#FF6B00]/40"
    >
      {visible ? (
        <EyeOff className="size-[18px]" aria-hidden="true" />
      ) : (
        <Eye className="size-[18px]" aria-hidden="true" />
      )}
    </button>
  )
}

export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className={cn("shrink-0", className)}
    >
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 8.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  )
}

export function GoogleButton({
  label,
  onClick,
}: {
  label: string
  onClick?: () => void
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="h-[50px] w-full gap-2.5 rounded-full border-[#DCE4EF] bg-white px-5 text-[14.5px] font-semibold text-[#071D49] shadow-xs hover:border-[#C7D4E6] hover:bg-[#F8FAFD] hover:text-[#071D49] focus-visible:ring-[#FF6B00]/40"
    >
      <GoogleIcon className="size-5" />
      {label}
    </Button>
  )
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className="h-px flex-1 bg-[#E7ECF4]" />
      <span className="text-xs font-medium tracking-[0.08em] text-[#93A1B8] uppercase">
        or
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-[#E7ECF4]" />
    </div>
  )
}

export function FormStatusNote({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-start gap-2.5 rounded-xl border border-[#C7E9D4] bg-[#F1FCF5] px-3.5 py-3"
    >
      <CheckCircle2
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0 text-[#128A46]"
      />
      <div>
        <p className="text-[13px] font-semibold text-[#0F6B39]">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-[#3D7A58]">{description}</p>
      </div>
    </div>
  )
}

export function FormNotice({ children }: { children: ReactNode }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-start gap-2.5 rounded-xl border border-[#FFE2C7] bg-[#FFF7ED] px-3.5 py-3 text-xs leading-5 text-[#9A5B21]"
    >
      <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <p>{children}</p>
    </div>
  )
}
