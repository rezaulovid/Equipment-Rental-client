"use client"

import { useMemo, useState } from "react"
import { Package, RefreshCw, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { adminApi } from "@/lib/api/admin"
import type { AdminEquipment, EquipmentStatus } from "@/lib/types/admin"
import { useApiQuery } from "@/hooks/use-api-query"
import { AdminPageHeader } from "../_components/admin-page-header"
import { ConfirmDialog } from "../_components/confirm-dialog"
import { EquipmentEditDialog } from "../_components/equipment-edit-dialog"
import { EquipmentTable } from "../_components/equipment-table"
import { ErrorPanel, InlineNotice } from "../_components/state-panels"
import { cn } from "cn"

type Filter = EquipmentStatus | "all"

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
]

export default function AdminEquipmentPage() {
  const { data, loading, error, refetch, setData } = useApiQuery(() =>
    adminApi.getEquipment()
  )

  const [filter, setFilter] = useState<Filter>("all")
  const [search, setSearch] = useState("")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [editing, setEditing] = useState<AdminEquipment | null>(null)
  const [deleting, setDeleting] = useState<AdminEquipment | null>(null)
  const [notice, setNotice] = useState<{
    variant: "success" | "error"
    message: string
  } | null>(null)

  const equipment = useMemo(() => data ?? [], [data])

  const counts = useMemo(() => {
    return equipment.reduce(
      (acc, item) => {
        acc[item.status] += 1
        return acc
      },
      { pending: 0, approved: 0, rejected: 0 } as Record<EquipmentStatus, number>
    )
  }, [equipment])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return equipment.filter((item) => {
      const matchesStatus = filter === "all" || item.status === filter
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.ownerName.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)

      return matchesStatus && matchesQuery
    })
  }, [equipment, filter, search])

  function replace(updated: AdminEquipment) {
    setData(equipment.map((item) => (item.id === updated.id ? updated : item)))
  }

  async function handleStatus(
    item: AdminEquipment,
    status: EquipmentStatus
  ) {
    setNotice(null)
    setUpdatingId(item.id)

    try {
      const updated = await adminApi.updateEquipmentStatus(item.id, status)
      replace(updated)
      setNotice({
        variant: "success",
        message: `${updated.name} was ${status === "approved" ? "approved" : status === "rejected" ? "rejected" : "updated"}.`,
      })
    } catch (err) {
      setNotice({
        variant: "error",
        message:
          err instanceof Error
            ? err.message
            : "The equipment status could not be updated.",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  function handleSaved(updated: AdminEquipment) {
    replace(updated)
    setNotice({ variant: "success", message: `${updated.name} was updated.` })
  }

  async function handleDelete() {
    if (!deleting) return

    await adminApi.deleteEquipment(deleting.id)
    setData(equipment.filter((item) => item.id !== deleting.id))
    setNotice({
      variant: "success",
      message: `${deleting.name} was deleted.`,
    })
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-5 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="All equipment"
        description="Review owner submissions. Only approved equipment is visible on the public catalogue."
        actions={
          <Button
            variant="outline"
            onClick={() => void refetch()}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw
              className={`size-4 ${loading ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            Refresh
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
                item.value === "all" ? equipment.length : counts[item.value]

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
              placeholder="Search equipment or owner"
              className="h-9 pl-9"
              aria-label="Search equipment"
            />
          </div>
        </div>

        <EquipmentTable
          items={filtered}
          loading={loading}
          updatingId={updatingId}
          onApprove={(item) => void handleStatus(item, "approved")}
          onReject={(item) => void handleStatus(item, "rejected")}
          onEdit={setEditing}
          onDelete={setDeleting}
        />
      </Card>

      {!loading && equipment.length > 0 && filtered.length === 0 ? (
        <p className="flex items-center justify-center gap-2 text-sm text-brand-ink-soft">
          <Package className="size-4" aria-hidden="true" />
          No equipment matches this filter.
        </p>
      ) : null}

      <EquipmentEditDialog
        equipment={editing}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
        }}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
        title="Delete equipment?"
        description={`“${deleting?.name ?? ""}” will be removed from the catalogue and from customers' favorites. This cannot be undone.`}
        confirmLabel="Delete equipment"
        destructive
        onConfirm={handleDelete}
      />
    </div>
  )
}
