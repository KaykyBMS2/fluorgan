import {
  LayoutDashboard,
  CheckSquare,
  BarChart,
  Settings,
  Plus,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/",
  },
  {
    title: "Tarefas",
    icon: CheckSquare,
    url: "/tasks",
  },
  {
    title: "Relatórios",
    icon: BarChart,
    url: "/reports",
  },
  {
    title: "Configurações",
    icon: Settings,
    url: "/settings",
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h1 className="text-2xl font-bold text-primary-600">Fluorgan</h1>
      </SidebarHeader>
      <SidebarContent>
        <div className="px-4 mb-4">
          <Button className="w-full" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nova Tarefa
          </Button>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}