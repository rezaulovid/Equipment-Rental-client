"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"

import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { adminApi } from "@/lib/api/admin"
import type { AdminUser } from "@/lib/types/admin"

export function UserEditDialog({
  user,
  onOpenChange,
  onSaved,
}: {
  user: AdminUser | null
  onOpenChange: (open: boolean) => void
  onSaved: (user: AdminUser) => void
}) {
  return (
    <Dialog open={Boolean(user)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="size-4 text-brand-orange" aria-hidden="true" />
            Manage user
          </DialogTitle>
          <DialogDescription>
            Update contact details for {user?.name}. Email and role are managed
            separately.
          </DialogDescription>
        </DialogHeader>

        {user ? (
          // Remount per user so the form starts from that row's values without
          // an effect that copies props into state.
          <UserEditForm
            key={user.id}
            user={user}
            onSaved={onSaved}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function UserEditForm({
  user,
  onSaved,
  onClose,
}: {
  user: AdminUser
  onSaved: (user: AdminUser) => void
  onClose: () => void
}) {
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone)
  const [address, setAddress] = useState(user.address)
  const [image, setImage] = useState(user.image ?? "")
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return

    try {
      setSaving(true)
      setError(null)
      const updated = await adminApi.updateUser(user.id, {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        image: image.trim(),
      })
      onSaved(updated)
      onClose()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "The user could not be updated."
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error ? <Alert variant="error">{error}</Alert> : null}

      <div className="space-y-1.5">
        <Label htmlFor="user-name">Full name</Label>
        <Input
          id="user-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="user-email">Email (read only)</Label>
        <Input id="user-email" value={user.email} disabled />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="user-phone">Phone number</Label>
        <Input
          id="user-phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+880 1XXX XXXXXX"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="user-address">Address</Label>
        <Textarea
          id="user-address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          className="min-h-20"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="user-image">Profile image URL</Label>
        <Input
          id="user-image"
          value={image}
          onChange={(event) => setImage(event.target.value)}
          placeholder="https://…"
        />
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          disabled={saving}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={saving}
          className="bg-brand-orange text-white hover:bg-brand-orange-strong"
        >
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </DialogFooter>
    </form>
  )
}
