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
import { useSession } from "@/lib/auth-client"
import { Plus } from "lucide-react"

const menuItemsByRole ={
    customer:[

    ],
    owner:[

    ],
    admin:[

    ],
}

export function DashboardSidebar() {
    const {data:session,isPending}=useSession();
    const role=session?.user?.role || "customer";
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
        <SidebarGroup>
          <SidebarMenu>
            {
            
            // menuItemsByRole[role]?.map((items) => (
            //   <SidebarMenuItem key={items.id}>
            //     <SidebarMenuButton render={<a href={items.url} />}>
            //       <items.icon />
            //       <span>{items.name}</span>
            //     </SidebarMenuButton>
            //   </SidebarMenuItem>
            // ))
            
            }
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
