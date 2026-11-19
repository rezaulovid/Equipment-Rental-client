"use client"

import { Pencil, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { AdminUser } from "@/lib/types/admin"
import type { UserRole } from "@/lib/user-role"
import { TableEmpty, TableLoading } from "./state-panels"

const roleItems = [
  { value: "customer", label: "Customer" },
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
]

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function formatDate(value: string | null) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function UsersTable({
  users,
  currentUserId,
  loading,
  updatingId,
  onRoleChange,
  onEdit,
}: {
  users: AdminUser[]
  currentUserId?: string
  loading: boolean
  updatingId: string | null
  onRoleChange: (user: AdminUser, role: UserRole) => void
  onEdit: (user: AdminUser) => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Registered</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableLoading colSpan={5} />
        ) : users.length === 0 ? (
          <TableEmpty
            colSpan={5}
            icon={Users}
            title="No users found"
            description="Registered accounts will appear here as soon as people sign up."
          />
        ) : (
          users.map((user) => {
            const isSelf = user.id === currentUserId

            return (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-navy-tint text-xs font-semibold text-brand-navy dark:bg-muted dark:text-foreground">
                      {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.image}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        initials(user.name) || "U"
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{user.name}</p>
                      <p className="text-xs text-brand-ink-soft dark:text-muted-foreground">
                        {isSelf ? "You" : user.phone || "No phone"}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-brand-ink-soft dark:text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell>
                  <Select
                    items={roleItems}
                    value={user.role}
                    disabled={isSelf || updatingId === user.id}
                    onValueChange={(value) => {
                      if (value && value !== user.role) {
                        onRoleChange(user, value as UserRole)
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 w-[132px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roleItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isSelf ? (
                    <p className="mt-1 text-[10px] text-brand-ink-soft dark:text-muted-foreground">
                      Your role cannot be changed
                    </p>
                  ) : null}
                </TableCell>
                <TableCell className="whitespace-nowrap text-brand-ink-soft dark:text-muted-foreground">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(user)}
                    className="gap-1.5"
                  >
                    <Pencil className="size-3.5" aria-hidden="true" />
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
