"use client"

import { useState } from "react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { adminApi } from "@/lib/api/admin"
import type {
  AdminEquipment,
  EquipmentUpdateInput,
  RentalType,
} from "@/lib/types/admin"

const rentalTypeItems = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
]

type FormState = {
  name: string
  category: string
  location: string
  rentalPrice: string
  rentalType: RentalType
  availableQuantity: string
  condition: string
  brand: string
  model: string
  image: string
  description: string
  terms: string
}

function toForm(equipment: AdminEquipment): FormState {
  return {
    name: equipment.name,
    category: equipment.category,
    location: equipment.location,
    rentalPrice: String(equipment.rentalPrice),
    rentalType: equipment.rentalType,
    availableQuantity: String(equipment.availableQuantity),
    condition: equipment.condition,
    brand: equipment.brand,
    model: equipment.model,
    image: equipment.image,
    description: equipment.description,
    terms: equipment.terms,
  }
}

export function EquipmentEditDialog({
  equipment,
  onOpenChange,
  onSaved,
}: {
  equipment: AdminEquipment | null
  onOpenChange: (open: boolean) => void
  onSaved: (equipment: AdminEquipment) => void
}) {
  return (
    <Dialog open={Boolean(equipment)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update equipment</DialogTitle>
          <DialogDescription>
            Changes are saved to the database and kept in sync with the owner
            dashboard.
          </DialogDescription>
        </DialogHeader>

        {equipment ? (
          // Keyed by id so switching rows starts from a fresh copy of the
          // record without syncing props through an effect.
          <EquipmentEditForm
            key={equipment.id}
            equipment={equipment}
            onSaved={onSaved}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function EquipmentEditForm({
  equipment,
  onSaved,
  onClose,
}: {
  equipment: AdminEquipment
  onSaved: (equipment: AdminEquipment) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<FormState>(() => toForm(equipment))
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return

    if (form.name.trim().length < 2) {
      setError("Equipment name must be at least 2 characters.")
      return
    }

    const rentalPrice = Number(form.rentalPrice)
    const availableQuantity = Number(form.availableQuantity)

    if (!Number.isFinite(rentalPrice) || rentalPrice < 0) {
      setError("Rental price must be a positive number.")
      return
    }

    if (!Number.isInteger(availableQuantity) || availableQuantity < 0) {
      setError("Available quantity must be a whole number.")
      return
    }

    const input: EquipmentUpdateInput = {
      name: form.name.trim(),
      category: form.category.trim(),
      location: form.location.trim(),
      rentalPrice,
      rentalType: form.rentalType,
      availableQuantity,
      condition: form.condition.trim(),
      brand: form.brand.trim(),
      model: form.model.trim(),
      image: form.image.trim(),
      description: form.description.trim(),
      terms: form.terms.trim(),
    }

    try {
      setSaving(true)
      setError(null)
      const updated = await adminApi.updateEquipment(equipment.id, input)
      onSaved(updated)
      onClose()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "The equipment could not be updated."
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error ? <Alert variant="error">{error}</Alert> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="equipment-name">Equipment name</Label>
          <Input
            id="equipment-name"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="equipment-category">Category</Label>
          <Input
            id="equipment-category"
            value={form.category}
            onChange={(event) => update("category", event.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="equipment-location">Location</Label>
          <Input
            id="equipment-location"
            value={form.location}
            onChange={(event) => update("location", event.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="equipment-price">Rental price (USD)</Label>
          <Input
            id="equipment-price"
            type="number"
            min={0}
            step="0.01"
            value={form.rentalPrice}
            onChange={(event) => update("rentalPrice", event.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Rental type</Label>
          <Select
            items={rentalTypeItems}
            value={form.rentalType}
            onValueChange={(value) => {
              if (value) update("rentalType", value as RentalType)
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {rentalTypeItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="equipment-quantity">Available quantity</Label>
          <Input
            id="equipment-quantity"
            type="number"
            min={0}
            step={1}
            value={form.availableQuantity}
            onChange={(event) => update("availableQuantity", event.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="equipment-condition">Condition</Label>
          <Input
            id="equipment-condition"
            value={form.condition}
            onChange={(event) => update("condition", event.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="equipment-brand">Brand</Label>
          <Input
            id="equipment-brand"
            value={form.brand}
            onChange={(event) => update("brand", event.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="equipment-model">Model</Label>
          <Input
            id="equipment-model"
            value={form.model}
            onChange={(event) => update("model", event.target.value)}
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="equipment-image">Image URL</Label>
          <Input
            id="equipment-image"
            value={form.image}
            placeholder="https://…"
            onChange={(event) => update("image", event.target.value)}
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="equipment-description">Description</Label>
          <Textarea
            id="equipment-description"
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="equipment-terms">Rental terms and conditions</Label>
          <Textarea
            id="equipment-terms"
            value={form.terms}
            onChange={(event) => update("terms", event.target.value)}
          />
        </div>
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
