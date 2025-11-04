import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, KanbanSquare, FileText, Settings } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import grifoLogo from "@/assets/grifo-logo.png";
interface AppLayoutProps {
  children: ReactNode;
}
const navigation = [{
  name: "Dashboard",
  href: "/",
  icon: LayoutDashboard
}, {
  name: "Leads",
  href: "/leads",
  icon: Users
}, {
  name: "Kanban",
  href: "/kanban",
  icon: KanbanSquare
}, {
  name: "Formulários",
  href: "/forms",
  icon: FileText
}, {
  name: "Configurações",
  href: "/settings",
  icon: Settings
}];
function AppSidebar() {
  const {
    open
  } = useSidebar();
  return <Sidebar className="bg-sidebar border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        {/* Logo/Title */}
        <div className="p-6 border-b border-sidebar-border flex items-center gap-3">
          <img src={grifoLogo} alt="Grifo" className="h-10 w-10 object-contain flex-shrink-0" />
          {open && <h1 className="text-xl font-bold text-sidebar-foreground whitespace-nowrap">GRIFO ACADEMY</h1>}
        </div>

        {/* Navigation */}
        <SidebarGroup className="flex-1">
          <SidebarGroupContent className="p-4">
            <SidebarMenu className="space-y-1">
              {navigation.map(item => <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.href} end={item.href === "/"} className={({
                  isActive
                }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}>
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {open && <span>{item.name}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Info */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-sidebar-accent-foreground">U</span>
            </div>
            {open && <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Usuário</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">Admin</p>
              </div>}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>;
}
export function AppLayout({
  children
}: AppLayoutProps) {
  return <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header with Toggle */}
          <header className="h-14 flex items-center border-b px-4 bg-background">
            <SidebarTrigger />
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>;
}