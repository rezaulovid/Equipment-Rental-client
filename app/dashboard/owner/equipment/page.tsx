"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Package, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ownerApi } from "@/lib/api/owner"
import type { OwnerEquipment } from "@/lib/types/owner"
import { useApiQuery } from "@/hooks/use-api-query"
import { AdminPageHeader } from "../../admin/_components/admin-page-header"
import { ConfirmDialog } from "../../admin/_components/confirm-dialog"
import { OwnerEquipmentDetailsDialog } from "../_components/owner-equipment-details-dialog"
import { OwnerEquipmentForm } from "../_components/owner-equipment-form"
import { OwnerEquipmentTable } from "../_components/owner-equipment-table"
import { ErrorPanel, InlineNotice } from "../../admin/_components/state-panels"
import { cn } from "cn"

type EquipmentFilter = "all" | "pending" | "approved" | "rejected"

const filters: { value: EquipmentFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
]

export default function OwnerEquipmentPage() {
  const router = useRouter()
  const { data, loading, error, refetch, setData } = useApiQuery(() =>
    ownerApi.getEquipment()
  )

  const [filter, setFilter] = useState<EquipmentFilter>("all")
  const [search, setSearch] = useState("")
  const [details, setDetails] = useState<OwnerEquipment | null>(null)
  const [editing, setEditing] = useState<OwnerEquipment | null>(null)
  const [deleting, setDeleting] = useState<OwnerEquipment | null>(null)
  const [notice, setNotice] = useState<{
    variant: "success" | "error"
    message: string
  } | null>(null)

  const equipment = useMemo(() => data ?? [], [data])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return equipment.filter((item) => {
      const matchesStatus = filter === "all" || item.status === filter
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query) ||
        item.model.toLowerCase().includes(query)

      return matchesStatus && matchesQuery
    })
  }, [equipment, filter, search])

  function handleSaved(updated: OwnerEquipment) {
    setData(equipment.map((item) => (item.id === updated.id ? updated : item)))
    setEditing(null)
    setNotice({ variant: "success", message: `${updated.name} was updated.` })
  }

  async function handleDelete() {
    if (!deleting) return

    try {
      await ownerApi.deleteEquipment(deleting.id)
      setData(equipment.filter((item) => item.id !== deleting.id))
      setNotice({
        variant: "success",
        message: `${deleting.name} was deleted.`,
      })
    } catch (err) {
      setNotice({
        variant: "error",
        message:
          err instanceof Error ? err.message : "The equipment could not be deleted.",
      })
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-5 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="My equipment"
        description="Every listing you have submitted. New listings start as pending and only approved equipment is rented publicly."
        actions={
          <Button
            className="gap-2 bg-brand-orange text-white hover:bg-brand-orange-strong"
            onClick={() => router.push("/dashboard/owner/equipment/new")}
          >
            <Plus className="size-4" aria-hidden="true" />
            Add equipment
          </Button>
        }
      />

      {error ? <ErrorPanel message={error} onRetry={() => void refetch()} /> : null}
      {notice ? (
        <InlineNotice
          variant={notice.variant}
          message={notice.message}
          onDismiss={() => setNotice(null)}
        />
      ) : null}

      <Card>
        <div className="flex flex-col gap-3 border-b border-brand-navy-line p-4 lg:flex-row lg:items-center lg:justify-between dark:border-border">
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter by status">
            {filters.map((item) => {
              const active = filter === item.value
              const count =
                item.value === "all"
                  ? equipment.length
                  : equipment.filter((equip) => equip.status === item.value).length

              return (
                <button
                  key={item.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(item.value)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                    active
                      ? "border-brand-navy bg-brand-navy text-white"
                      : "border-brand-navy-line bg-white text-brand-ink-soft hover:border-brand-navy/30 hover:text-brand-navy dark:border-border dark:bg-transparent dark:text-muted-foreground"
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] tabular-nums",
                      active ? "bg-white/15" : "bg-brand-navy-tint dark:bg-muted"
                    )}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="relative w-full lg:max-w-xs">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-ink-soft"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search your equipment"
              className="h-9 pl-9"
              aria-label="Search equipment"
            />
          </div>
        </div>

        <OwnerEquipmentTable
          items={filtered}
          loading={loading}
          onView={setDetails}
          onUpdate={setEditing}
          onDelete={setDeleting}
        />
      </Card>

      {!loading && equipment.length > 0 && filtered.length === 0 ? (
        <p className="flex items-center justify-center gap-2 text-sm text-brand-ink-soft">
          <Package className="size-4" aria-hidden="true" />
          No equipment matches this filter.
        </p>
      ) : null}

      {editing ? (
        <Card>
          <CardContent className="p-5 sm:p-6">
            <OwnerEquipmentForm
              initial={editing}
              submitLabel="Save changes"
              busy={false}
              onSubmit={async (input) => {
                try {
                  const updated = await ownerApi.updateEquipment(editing.id, input)
                  handleSaved(updated)
                } catch (err) {
                  setNotice({
                    variant: "error",
                    message:
                      err instanceof Error
                        ? err.message
                        : "The equipment could not be updated.",
                  })
                }
              }}
              onCancel={() => setEditing(null)}
            />
          </CardContent>
        </Card>
      ) : null}

      <OwnerEquipmentDetailsDialog
        equipment={details}
        onOpenChange={(open) => {
          if (!open) setDetails(null)
        }}
        onEdit={(item) => {
          setDetails(null)
          setEditing(item)
        }}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
        title="Delete equipment?"
        description={`“${deleting?.name ?? ""}” will be removed from your listings. Existing rental records are kept for your history.`}
        confirmLabel="Delete equipment"
        destructive
        onConfirm={() => void handleDelete()}
      />
    </div>
  )
}
