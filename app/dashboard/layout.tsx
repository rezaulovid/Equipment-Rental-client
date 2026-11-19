import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "../components/DashboardSidebar"
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="min-w-0 flex-1 bg-brand-surface text-brand-navy dark:bg-background dark:text-foreground">
        <SidebarTrigger className="text-brand-navy hover:bg-brand-navy-tint hover:text-brand-navy dark:text-foreground dark:hover:bg-white/10 dark:hover:text-white" />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default DashboardLayout
