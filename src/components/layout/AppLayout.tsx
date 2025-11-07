import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, KanbanSquare, FileText, LogOut } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import grifoLogo from "@/assets/grifo-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { ReadOnlyBanner } from "./ReadOnlyBanner";
import { Button } from "@/components/ui/button";
interface AppLayoutProps {
  children: ReactNode;
}
const navigation = [{
  name: "Dashboard",
  href: "/dashboard",
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
}];
function AppSidebar() {
  const { open, setOpen } = useSidebar();
  const { signOut, currentUser } = useAuth();
  
  return <Sidebar 
      collapsible="icon"
      className="bg-sidebar border-r border-sidebar-border"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <SidebarContent className="bg-sidebar">
        {/* Logo/Title */}
        <div className="p-6 border-b border-sidebar-border flex items-center gap-3">
          <img src={grifoLogo} alt="Grifo" className="h-10 w-10 object-contain flex-shrink-0" />
          {open && <h1 className="text-xl font-bold text-sidebar-foreground whitespace-nowrap">GRIFO CRM</h1>}
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
              <span className="text-sm font-semibold text-sidebar-accent-foreground">
                {currentUser?.user_nome.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            {open && <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {currentUser?.user_nome}
                </p>
                <p className="text-xs text-sidebar-foreground/70 truncate capitalize">
                  {currentUser?.user_role}
                </p>
              </div>}
          </div>
          {open && (
            <Button
              variant="ghost"
              onClick={signOut}
              className="w-full mt-2 flex items-center gap-2 justify-start px-4 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </Button>
          )}
        </div>
      </SidebarContent>
    </Sidebar>;
}
export function AppLayout({
  children
}: AppLayoutProps) {
  return <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full bg-background overflow-x-hidden">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="border-b bg-background">
            <div className="h-14 flex items-center px-4">
              {/* Removido SidebarTrigger - agora é automático com hover */}
            </div>
            <ReadOnlyBanner />
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>;
}