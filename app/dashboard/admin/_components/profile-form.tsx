"use client"

import { useState } from "react"
import { Save, UserRound } from "lucide-react"

import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { adminApi } from "@/lib/api/admin"
import type { AdminProfile, ProfileUpdateInput } from "@/lib/types/admin"

export function ProfileForm({
  profile,
  onSaved,
}: {
  profile: AdminProfile
  onSaved: (profile: AdminProfile) => void
}) {
  const [form, setForm] = useState({
    name: profile.name ?? "",
    phone: profile.phone ?? "",
    address: profile.address ?? "",
    image: profile.image ?? "",
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
    setSaved(false)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return

    const name = form.name.trim()
    if (name.length < 2) {
      setError("Name must be at least 2 characters.")
      return
    }

    const input: ProfileUpdateInput = {
      name,
      phone: form.phone.trim(),
      address: form.address.trim(),
      image: form.image.trim(),
    }

    try {
      setSaving(true)
      setError(null)
      const updated = await adminApi.updateProfile(input)
      onSaved(updated)
      setSaved(true)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Your profile could not be saved."
      )
    } finally {
      setSaving(false)
    }
  }

  const initials = form.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-brand-navy-line bg-white p-6 text-center dark:border-border dark:bg-card">
        <span className="flex size-24 items-center justify-center overflow-hidden rounded-full bg-brand-navy-tint text-2xl font-semibold text-brand-navy ring-4 ring-brand-orange/20 dark:bg-muted dark:text-foreground">
          {form.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.image} alt="" className="size-full object-cover" />
          ) : initials ? (
            initials
          ) : (
            <UserRound className="size-8" aria-hidden="true" />
          )}
        </span>
        <div>
          <p className="font-display text-base font-semibold text-brand-navy dark:text-foreground">
            {form.name || "Admin"}
          </p>
          <p className="text-xs text-brand-ink-soft dark:text-muted-foreground">
            {profile.email}
          </p>
        </div>
        <span className="rounded-full border border-brand-navy/10 bg-brand-navy px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-white uppercase">
          {profile.role}
        </span>
      </div>

      <div className="rounded-2xl border border-brand-navy-line bg-white p-5 sm:p-6 dark:border-border dark:bg-card">
        <div className="flex flex-col gap-4">
          {error ? <Alert variant="error">{error}</Alert> : null}
          {saved ? (
            <Alert variant="success">Your profile has been updated.</Alert>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="profile-name">Full name</Label>
              <Input
                id="profile-name"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-email">Email (read only)</Label>
              <Input id="profile-email" value={profile.email} disabled />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-phone">Phone number</Label>
              <Input
                id="profile-phone"
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
                placeholder="+880 1XXX XXXXXX"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-image">Profile image URL</Label>
              <Input
                id="profile-image"
                value={form.image}
                onChange={(event) => update("image", event.target.value)}
                placeholder="https://…"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="profile-address">Address</Label>
              <Textarea
                id="profile-address"
                value={form.address}
                onChange={(event) => update("address", event.target.value)}
                className="min-h-24"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="gap-2 bg-brand-orange text-white hover:bg-brand-orange-strong"
            >
              <Save className="size-4" aria-hidden="true" />
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
