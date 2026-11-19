"use client"

import { useRef, useState } from "react"
import { Image as ImageIcon, Loader2, Save } from "lucide-react"

import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
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
import type { OwnerEquipment, OwnerEquipmentFormValues } from "@/lib/types/owner"
import { uploadEquipmentImage } from "@/lib/imgbb"
import {
  validateOwnerEquipmentForm,
  type FieldErrors,
} from "@/lib/validation"

const rentalTypeItems = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
]

function toFormState(
  equipment: OwnerEquipment | null | undefined
): OwnerEquipmentFormValues {
  if (!equipment) {
    return {
      name: "",
      description: "",
      category: "",
      location: "",
      rentalPrice: "",
      rentalType: "daily",
      availableQuantity: "",
      condition: "",
      brand: "",
      model: "",
      image: "",
      terms: "",
    }
  }

  return {
    name: equipment.name,
    description: equipment.description,
    category: equipment.category,
    location: equipment.location,
    rentalPrice: String(equipment.rentalPrice),
    rentalType: equipment.rentalType,
    availableQuantity: String(equipment.availableQuantity),
    condition: equipment.condition,
    brand: equipment.brand,
    model: equipment.model,
    image: equipment.image,
    terms: equipment.terms,
  }
}

/**
 * Shared listing form used by the owner "Add equipment" page and the owner
 * edit dialog. All required fields are validated before the value reaches the
 * owner API, which associates the listing with the signed-in owner.
 */
export function OwnerEquipmentForm({
  initial,
  submitLabel = "Save equipment",
  busy = false,
  onSubmit,
  onCancel,
}: {
  initial?: OwnerEquipment | null
  submitLabel?: string
  busy?: boolean
  onSubmit: (input: {
    name: string
    description: string
    category: string
    location: string
    rentalPrice: number
    rentalType: OwnerEquipmentFormValues["rentalType"]
    availableQuantity: number
    condition: string
    brand: string
    model: string
    image: string
    terms: string
  }) => void | Promise<void>
  onCancel?: () => void
}) {
  const [values, setValues] = useState<OwnerEquipmentFormValues>(() =>
    toFormState(initial)
  )
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function update<K extends keyof OwnerEquipmentFormValues>(
    key: K,
    value: OwnerEquipmentFormValues[K]
  ) {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      const next = { ...current }
      delete next[key]
      return next
    })
    setFormError(null)
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError(null)

    try {
      const url = await uploadEquipmentImage(file)
      update("image", url)
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "The image could not be uploaded."
      )
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validateOwnerEquipmentForm(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    setFormError(null)

    try {
      await onSubmit({
        name: values.name.trim(),
        description: values.description.trim(),
        category: values.category.trim(),
        location: values.location.trim(),
        rentalPrice: Number(values.rentalPrice),
        rentalType: values.rentalType,
        availableQuantity: Number(values.availableQuantity),
        condition: values.condition.trim(),
        brand: values.brand.trim(),
        model: values.model.trim(),
        image: values.image.trim(),
        terms: values.terms.trim(),
      })
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "The equipment could not be saved."
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {formError ? <Alert variant="error">{formError}</Alert> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="owner-equipment-name">Equipment name</Label>
          <Input
            id="owner-equipment-name"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            required
            minLength={2}
            maxLength={120}
          />
          {errors.name ? (
            <p className="text-xs text-red-600">{errors.name}</p>
          ) : null}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="owner-equipment-description">Description</Label>
          <Textarea
            id="owner-equipment-description"
            value={values.description}
            onChange={(event) => update("description", event.target.value)}
            className="min-h-24"
            maxLength={2000}
          />
          {errors.description ? (
            <p className="text-xs text-red-600">{errors.description}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="owner-equipment-category">Category</Label>
          <Input
            id="owner-equipment-category"
            value={values.category}
            onChange={(event) => update("category", event.target.value)}
            maxLength={60}
          />
          {errors.category ? (
            <p className="text-xs text-red-600">{errors.category}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="owner-equipment-location">Location</Label>
          <Input
            id="owner-equipment-location"
            value={values.location}
            onChange={(event) => update("location", event.target.value)}
            maxLength={120}
          />
          {errors.location ? (
            <p className="text-xs text-red-600">{errors.location}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="owner-equipment-price">Rental price (USD)</Label>
          <Input
            id="owner-equipment-price"
            type="number"
            min={0}
            step="0.01"
            value={values.rentalPrice}
            onChange={(event) => update("rentalPrice", event.target.value)}
            aria-invalid={Boolean(errors.rentalPrice)}
            required
          />
          {errors.rentalPrice ? (
            <p className="text-xs text-red-600">{errors.rentalPrice}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label>Rental type</Label>
          <Select
            items={rentalTypeItems}
            value={values.rentalType}
            onValueChange={(value) => {
              if (value) update("rentalType", value as OwnerEquipmentFormValues["rentalType"])
            }}
          >
            <SelectTrigger className="w-full" aria-invalid={Boolean(errors.rentalType)}>
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
          {errors.rentalType ? (
            <p className="text-xs text-red-600">{errors.rentalType}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="owner-equipment-quantity">Available quantity</Label>
          <Input
            id="owner-equipment-quantity"
            type="number"
            min={1}
            step={1}
            value={values.availableQuantity}
            onChange={(event) => update("availableQuantity", event.target.value)}
            aria-invalid={Boolean(errors.availableQuantity)}
            required
          />
          {errors.availableQuantity ? (
            <p className="text-xs text-red-600">{errors.availableQuantity}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="owner-equipment-condition">Equipment condition</Label>
          <Input
            id="owner-equipment-condition"
            value={values.condition}
            onChange={(event) => update("condition", event.target.value)}
            maxLength={60}
          />
          {errors.condition ? (
            <p className="text-xs text-red-600">{errors.condition}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="owner-equipment-brand">Brand</Label>
          <Input
            id="owner-equipment-brand"
            value={values.brand}
            onChange={(event) => update("brand", event.target.value)}
            maxLength={60}
          />
          {errors.brand ? (
            <p className="text-xs text-red-600">{errors.brand}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="owner-equipment-model">Model</Label>
          <Input
            id="owner-equipment-model"
            value={values.model}
            onChange={(event) => update("model", event.target.value)}
            maxLength={60}
          />
          {errors.model ? (
            <p className="text-xs text-red-600">{errors.model}</p>
          ) : null}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="owner-equipment-image">Equipment image</Label>
          <Input
            id="owner-equipment-image"
            type="url"
            value={values.image}
            onChange={(event) => update("image", event.target.value)}
            placeholder="https://…"
            aria-invalid={Boolean(errors.image)}
            required
          />
          {errors.image ? (
            <p className="text-xs text-red-600">{errors.image}</p>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              aria-label="Upload equipment image"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="gap-2"
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <ImageIcon className="size-4" aria-hidden="true" />
              )}
              {uploading ? "Uploading..." : "Upload image"}
            </Button>
            {uploadError ? <p className="text-xs text-red-600">{uploadError}</p> : null}
          </div>
          <p className="text-[11px] leading-5 text-brand-ink-soft">
            Upload a photo of the equipment through ImgBB or paste a direct image
            URL above.
          </p>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="owner-equipment-terms">Rental terms and conditions</Label>
          <Textarea
            id="owner-equipment-terms"
            value={values.terms}
            onChange={(event) => update("terms", event.target.value)}
            className="min-h-24"
            maxLength={2000}
          />
          {errors.terms ? (
            <p className="text-xs text-red-600">{errors.terms}</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={onCancel}
          >
            Cancel
          </Button>
        ) : null}
        <Button
          type="submit"
          disabled={busy}
          className="gap-2 bg-brand-orange text-white hover:bg-brand-orange-strong"
        >
          {busy ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="size-4" aria-hidden="true" />
          )}
          {busy ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
