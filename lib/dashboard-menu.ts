import type { LucideIcon } from "lucide-react"
import {
  ChartColumn,
  CirclePlus,
  ClipboardList,
  CreditCard,
  Heart,
  LayoutDashboard,
  Package,
  Search,
  Settings,
  Users,
  Wallet,
} from "lucide-react"

import type { UserRole } from "@/lib/user-role"

export type DashboardMenuItem = {
  id: string
  name: string
  url: string
  icon: LucideIcon
}

/**
 * Sidebar navigation for every role. Keep the overview item first and give it
 * the role's dashboard root URL so active-state detection can treat it exactly.
 */
export const menuItemsByRole: Record<UserRole, DashboardMenuItem[]> = {
  customer: [
    {
      id: "customer-overview",
      name: "Overview",
      url: "/dashboard/customer",
      icon: LayoutDashboard,
    },
    {
      id: "customer-browse-equipment",
      name: "Browse Equipment",
      url: "/equipment",
      icon: Search,
    },
    {
      id: "customer-rentals",
      name: "My Rentals",
      url: "/dashboard/customer/rentals",
      icon: ClipboardList,
    },
    {
      id: "customer-favorites",
      name: "Favorites",
      url: "/dashboard/customer/favorites",
      icon: Heart,
    },
    {
      id: "customer-payments",
      name: "Payment History",
      url: "/dashboard/customer/payments",
      icon: CreditCard,
    },
    {
      id: "customer-profile",
      name: "Profile",
      url: "/dashboard/customer/profile",
      icon: Settings,
    },
  ],
  owner: [
    {
      id: "owner-overview",
      name: "Overview",
      url: "/dashboard/owner",
      icon: LayoutDashboard,
    },
    {
      id: "owner-equipment",
      name: "My Equipment",
      url: "/dashboard/owner/equipment",
      icon: Package,
    },
    {
      id: "owner-add-equipment",
      name: "Add Equipment",
      url: "/dashboard/owner/equipment/new",
      icon: CirclePlus,
    },
    {
      id: "owner-requests",
      name: "Rental Requests",
      url: "/dashboard/owner/requests",
      icon: ClipboardList,
    },
    {
      id: "owner-earnings",
      name: "Earnings",
      url: "/dashboard/owner/earnings",
      icon: Wallet,
    },
    {
      id: "owner-analytics",
      name: "Analytics",
      url: "/dashboard/owner/analytics",
      icon: ChartColumn,
    },
    {
      id: "owner-profile",
      name: "Profile",
      url: "/dashboard/owner/profile",
      icon: Settings,
    },
  ],
  admin: [
    {
      id: "admin-overview",
      name: "Overview",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      id: "admin-users",
      name: "All Users",
      url: "/dashboard/admin/users",
      icon: Users,
    },
    {
      id: "admin-equipment",
      name: "All Equipment",
      url: "/dashboard/admin/equipment",
      icon: Package,
    },
    {
      id: "admin-rentals",
      name: "All Rentals",
      url: "/dashboard/admin/rentals",
      icon: ClipboardList,
    },
    {
      id: "admin-analytics",
      name: "Analytics",
      url: "/dashboard/admin/analytics",
      icon: ChartColumn,
    },
    {
      id: "admin-profile",
      name: "Profile",
      url: "/dashboard/admin/profile",
      icon: Settings,
    },
  ],
}
