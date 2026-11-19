"use client"

import { useMemo, useState } from "react"
import { RefreshCw, Search, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { adminApi } from "@/lib/api/admin"
import { useSession } from "@/lib/auth-client"
import type { AdminUser } from "@/lib/types/admin"
import type { UserRole } from "@/lib/user-role"
import { useApiQuery } from "@/hooks/use-api-query"
import { AdminPageHeader } from "../_components/admin-page-header"
import { InlineNotice, ErrorPanel } from "../_components/state-panels"
import { UserEditDialog } from "../_components/user-edit-dialog"
import { UsersTable } from "../_components/users-table"

export default function AdminUsersPage() {
  const { data: session } = useSession()
  const { data, loading, error, refetch, setData } = useApiQuery(() =>
    adminApi.getUsers()
  )

  const [search, setSearch] = useState("")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [editing, setEditing] = useState<AdminUser | null>(null)
  const [notice, setNotice] = useState<{
    variant: "success" | "error"
    message: string
  } | null>(null)

  const users = useMemo(() => data ?? [], [data])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return users

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    )
  }, [users, search])

  async function handleRoleChange(user: AdminUser, role: UserRole) {
    setNotice(null)
    setUpdatingId(user.id)

    try {
      const updated = await adminApi.updateUserRole(user.id, role)
      setData(users.map((item) => (item.id === updated.id ? updated : item)))
      setNotice({
        variant: "success",
        message: `${updated.name} is now ${updated.role}.`,
      })
    } catch (err) {
      setNotice({
        variant: "error",
        message:
          err instanceof Error ? err.message : "The role could not be updated.",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  function handleSaved(updated: AdminUser) {
    setData(users.map((item) => (item.id === updated.id ? updated : item)))
    setNotice({
      variant: "success",
      message: `${updated.name}'s details were updated.`,
    })
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-5 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="All users"
        description="Every registered account, with role controls. Roles are enforced by the API on every request."
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
        <div className="flex flex-col gap-3 border-b border-brand-navy-line p-4 sm:flex-row sm:items-center sm:justify-between dark:border-border">
          <div className="relative w-full sm:max-w-xs">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-ink-soft"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email or role"
              className="h-9 pl-9"
              aria-label="Search users"
            />
          </div>
          <p className="text-xs text-brand-ink-soft dark:text-muted-foreground">
            {filtered.length} of {users.length} users
          </p>
        </div>

        <UsersTable
          users={filtered}
          currentUserId={session?.user?.id}
          loading={loading}
          updatingId={updatingId}
          onRoleChange={handleRoleChange}
          onEdit={setEditing}
        />
      </Card>

      {!loading && users.length > 0 && filtered.length === 0 ? (
        <p className="flex items-center justify-center gap-2 text-sm text-brand-ink-soft">
          <Users className="size-4" aria-hidden="true" />
          No user matches “{search}”.
        </p>
      ) : null}

      <UserEditDialog
        user={editing}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
        }}
        onSaved={handleSaved}
      />
    </div>
  )
}
