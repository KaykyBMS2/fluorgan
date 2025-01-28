import {
  LayoutDashboard,
  CheckSquare,
  BarChart,
  Settings,
  Plus,
  LogOut,
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
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const menuItems = [
  {
    title: "dashboard",
    icon: LayoutDashboard,
    url: "/",
  },
  {
    title: "tasks",
    icon: CheckSquare,
    url: "/tasks",
  },
  {
    title: "reports",
    icon: BarChart,
    url: "/reports",
  },
  {
    title: "settings",
    icon: Settings,
    url: "/settings",
  },
];

export function AppSidebar() {
  const { signOut } = useAuth();
  const { t } = useLanguage();

  return (
    <Sidebar className="bg-white border-r border-gray-200">
      <SidebarHeader className="p-4">
        <h1 className="text-2xl font-bold text-primary-600">Fluorgan</h1>
      </SidebarHeader>
      <SidebarContent>
        <div className="px-4 mb-4">
          <Button className="w-full" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            {t("newTask", "tasks")}
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
                      <span>{t(item.title, "common")}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="mt-auto px-4 pb-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-500 hover:text-gray-900"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t("logout")}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}