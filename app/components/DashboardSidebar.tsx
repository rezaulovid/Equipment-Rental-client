"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { LogOut } from "lucide-react"

import { authClient, useSession } from "@/lib/auth-client"
import { menuItemsByRole } from "@/lib/dashboard-menu"
import { DEFAULT_USER_ROLE, isUserRole, type UserRole } from "@/lib/user-role"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

const roleLabels: Record<UserRole, string> = {
  customer: "Customer",
  owner: "Owner",
  admin: "Admin",
}

const roleBadgeStyles: Record<UserRole, string> = {
  customer: "border-brand-orange/50 bg-brand-orange/15 text-brand-orange-muted",
  owner: "border-[#7fa9e8]/50 bg-[#7fa9e8]/15 text-[#cfe0f7]",
  admin: "border-[#e5b45c]/50 bg-[#e5b45c]/15 text-[#f2c879]",
}

function getInitials(name?: string | null) {
  if (!name?.trim()) return "U"

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { data: session, isPending } = useSession()

  const rawRole = session?.user?.role
  const role: UserRole = isUserRole(rawRole) ? rawRole : DEFAULT_USER_ROLE
  const items = menuItemsByRole[role] ?? []

  const roleRoot = `/dashboard/${role}`

  // Match the most specific URL so nested pages (e.g. "Add Equipment" inside
  // "My Equipment") only highlight one item at a time.
  const activeItemUrl = items
    .map((item) => item.url)
    .filter((url) =>
      url === roleRoot
        ? pathname === url
        : pathname === url || pathname.startsWith(`${url}/`)
    )
    .sort((a, b) => b.length - a.length)[0]

  const isActive = (url: string) => url === activeItemUrl

  async function handleLogout() {
    if (isSigningOut) return

    setIsSigningOut(true)

    try {
      const { error } = await authClient.signOut()

      if (error) {
        console.error("Logout error:", error)
        return
      }

      router.push("/sign-in")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <Sidebar>
      <div className="flex h-full flex-col bg-brand-navy font-display text-brand-cream">
        <SidebarHeader className="shrink-0 px-5 pt-5 pb-1">
          <Link
            href="/"
            aria-label="RentPro home"
            className="inline-flex w-fit rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-4 focus-visible:ring-offset-brand-navy"
          >
            <Image
              src="/images/rentpro-logo-light.png"
              alt="RentPro — Rent Smart. Work Better."
              width={534}
              height={140}
              priority
              className="h-auto w-[150px]"
            />
          </Link>
        </SidebarHeader>

        <div className="flex shrink-0 flex-col items-center gap-2.5 px-4 pt-4 pb-5">
          <div className="size-20 shrink-0 overflow-hidden rounded-full bg-brand-navy-soft ring-2 ring-brand-orange/70 ring-offset-[3px] ring-offset-brand-navy">
            {session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name ?? "Account avatar"}
                className="size-full object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center text-xl font-semibold text-brand-cream">
                {getInitials(session?.user?.name)}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-[15px] leading-tight font-semibold text-white">
              {isPending ? "Loading..." : (session?.user?.name ?? "Guest")}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60">
                {roleLabels[role]}
              </span>
              <span
                className={cn(
                  "rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em] uppercase",
                  roleBadgeStyles[role]
                )}
              >
                {role}
              </span>
            </div>
          </div>
        </div>

        <SidebarContent className="px-2.5">
          <SidebarGroup className="p-0 pt-1">
            <SidebarMenu className="gap-1.5">
              {isPending
                ? Array.from({ length: 6 }).map((_, index) => (
                    <SidebarMenuItem key={index}>
                      <div className="flex h-11 items-center gap-3 rounded-lg px-3">
                        <Skeleton className="size-[18px] shrink-0 rounded-md bg-white/10" />
                        <Skeleton className="h-3.5 w-32 rounded bg-white/10" />
                      </div>
                    </SidebarMenuItem>
                  ))
                : items.map((item) => {
                    const active = isActive(item.url)

                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          render={<Link href={item.url} />}
                          isActive={active}
                          aria-current={active ? "page" : undefined}
                          tooltip={item.name}
                          className="relative h-11 gap-3 rounded-lg px-3 text-[15px] font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white data-active:bg-brand-orange/15 data-active:text-white data-active:ring-1 data-active:ring-brand-orange/30 data-active:before:absolute data-active:before:inset-y-2.5 data-active:before:left-0 data-active:before:w-[3px] data-active:before:rounded-r-full data-active:before:bg-brand-orange data-active:before:content-[''] data-active:hover:bg-brand-orange/20 data-active:[&>svg]:text-brand-orange data-active:shadow-[0_10px_24px_-16px_rgba(255,107,0,0.6)]"
                        >
                          <item.icon
                            className="size-[18px]"
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                          <span>{item.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="shrink-0 border-t border-white/10 p-2.5">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                type="button"
                onClick={handleLogout}
                disabled={isSigningOut}
                className="h-11 gap-3 rounded-lg px-3 text-[15px] font-medium text-white/75 hover:bg-white/10 hover:text-white disabled:opacity-60"
              >
                <LogOut
                  className="size-[18px]"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span>{isSigningOut ? "Signing out..." : "Logout"}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </div>
    </Sidebar>
  )
}
