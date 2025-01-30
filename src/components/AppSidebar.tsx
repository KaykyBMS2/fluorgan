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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";

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
  const { signOut, user } = useAuth();
  const { t } = useLanguage();
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <>
      <Sidebar className="bg-white border-r border-gray-200">
        <SidebarHeader className="p-4">
          <h1 className="text-2xl font-bold text-primary-600">Fluorgan</h1>
        </SidebarHeader>
        <SidebarContent>
          <div className="px-4 mb-4">
            <Button 
              className="w-full" 
              size="sm"
              onClick={() => setCreateTaskOpen(true)}
            >
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
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback>
                {profile?.first_name?.[0]}
                {profile?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {profile?.first_name} {profile?.last_name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-500 hover:text-gray-900"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t("logout")}
          </Button>
        </SidebarFooter>
      </Sidebar>
      <CreateTaskDialog open={createTaskOpen} onOpenChange={setCreateTaskOpen} />
    </>
  );
}