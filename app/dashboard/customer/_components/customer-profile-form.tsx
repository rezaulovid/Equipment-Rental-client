"use client"

import { useState } from "react"
import { Image as ImageIcon, Save, UserRound } from "lucide-react"

import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { customerApi } from "@/lib/api/customer"
import { useSession } from "@/lib/auth-client"
import type { CustomerProfile } from "@/lib/types/customer"
import {
  validateProfileForm,
  type FieldErrors,
} from "@/lib/validation"

export function CustomerProfileForm({
  profile,
  onSaved,
}: {
  profile: CustomerProfile
  onSaved: (profile: CustomerProfile) => void
}) {
  const { refetch } = useSession()
  const [form, setForm] = useState({
    name: profile.name,
    phone: profile.phone,
    address: profile.address,
    image: profile.image ?? "",
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      const next = { ...current }
      delete next[key]
      return next
    })
    setSaved(false)
    setError(null)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return

    const nextErrors = validateProfileForm(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    try {
      setSaving(true)
      setError(null)
      setSaved(false)

      const updated = await customerApi.updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        image: form.image.trim(),
      })

      onSaved(updated)
      setSaved(true)
      await refetch()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Your profile could not be saved."
      )
    } finally {
      setSaving(false)
    }
  }

  const name = form.name.trim()
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-brand-navy-line bg-white p-6 text-center dark:border-border dark:bg-card">
        <span className="flex size-24 items-center justify-center overflow-hidden rounded-full bg-brand-navy-tint text-2xl font-semibold text-brand-navy ring-4 ring-brand-orange/20 dark:bg-muted dark:text-foreground">
          {form.image.trim() ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.image.trim()}
              alt=""
              className="size-full object-cover"
            />
          ) : initials ? (
            initials
          ) : (
            <UserRound className="size-8" aria-hidden="true" />
          )}
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-base font-semibold text-brand-navy dark:text-foreground">
            {name || "Customer"}
          </p>
          <p className="truncate text-xs text-brand-ink-soft dark:text-muted-foreground">
            {profile.email}
          </p>
        </div>
        <span className="rounded-full border border-brand-navy/10 bg-brand-navy px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-white uppercase">
          {profile.role}
        </span>
        <p className="mt-1 flex items-start gap-1.5 text-left text-[11px] leading-5 text-brand-ink-soft">
          <ImageIcon className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
          Paste a public image URL to change your profile picture.
        </p>
      </div>

      <div className="rounded-2xl border border-brand-navy-line bg-white p-5 sm:p-6 dark:border-border dark:bg-card">
        <div className="flex flex-col gap-4">
          {error ? <Alert variant="error">{error}</Alert> : null}
          {saved ? (
            <Alert variant="success">Your profile has been updated.</Alert>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="customer-name">Full name</Label>
              <Input
                id="customer-name"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                aria-invalid={Boolean(errors.name)}
                required
                minLength={2}
                maxLength={80}
              />
              {errors.name ? (
                <p className="text-xs text-red-600">{errors.name}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="customer-email">Email (read only)</Label>
              <Input
                id="customer-email"
                value={profile.email}
                disabled
                aria-describedby="customer-email-hint"
              />
              <p
                id="customer-email-hint"
                className="text-[11px] leading-5 text-brand-ink-soft"
              >
                Your email is part of your sign-in identity and cannot be
                changed here.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="customer-phone">Phone number</Label>
              <Input
                id="customer-phone"
                type="tel"
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
                placeholder="+880 1XXX XXXXXX"
                aria-invalid={Boolean(errors.phone)}
                maxLength={30}
              />
              {errors.phone ? (
                <p className="text-xs text-red-600">{errors.phone}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="customer-image">Profile image URL</Label>
              <Input
                id="customer-image"
                type="url"
                value={form.image}
                onChange={(event) => update("image", event.target.value)}
                placeholder="https://…"
                aria-invalid={Boolean(errors.image)}
              />
              {errors.image ? (
                <p className="text-xs text-red-600">{errors.image}</p>
              ) : null}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="customer-address">Address</Label>
              <Textarea
                id="customer-address"
                value={form.address}
                onChange={(event) => update("address", event.target.value)}
                className="min-h-24"
                placeholder="Street, area, city"
                aria-invalid={Boolean(errors.address)}
                maxLength={200}
              />
              {errors.address ? (
                <p className="text-xs text-red-600">{errors.address}</p>
              ) : null}
              <p className="text-[11px] leading-5 text-brand-ink-soft">
                Your phone and address are prefilled when you book equipment.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="gap-2 bg-brand-orange text-white hover:bg-brand-orange-strong"
            >
              <Save className="size-4" aria-hidden="true" />
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
