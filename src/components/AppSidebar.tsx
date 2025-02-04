import {
  LayoutDashboard,
  CheckSquare,
  BarChart,
  Settings,
  Plus,
  LogOut,
  Users,
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
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (fetchError) {
        toast({
          title: t("error"),
          description: fetchError.message,
          variant: "destructive",
        });
        return null;
      }

      if (existingProfile) return existingProfile;

      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert([{ id: user.id }])
        .select()
        .maybeSingle();

      if (insertError) {
        toast({
          title: t("error"),
          description: insertError.message,
          variant: "destructive",
        });
        return null;
      }

      return newProfile;
    },
    enabled: !!user?.id,
  });

  const { data: colleagues, isLoading: isLoadingColleagues } = useQuery({
    queryKey: ["colleagues", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data: friendships, error: friendshipsError } = await supabase
        .from("friendships")
        .select(`
          sender_id,
          receiver_id,
          sender:profiles!friendships_sender_id_fkey(
            id,
            first_name,
            last_name,
            avatar_url
          ),
          receiver:profiles!friendships_receiver_id_fkey(
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .eq("status", "accepted");

      if (friendshipsError) {
        toast({
          title: t("error"),
          description: friendshipsError.message,
          variant: "destructive",
        });
        return [];
      }

      return friendships.map((friendship) => {
        const isReceiver = friendship.receiver_id === user.id;
        const colleague = isReceiver ? friendship.sender : friendship.receiver;
        return colleague;
      });
    },
    enabled: !!user?.id,
  });

  return (
    <>
      <Sidebar className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        <SidebarHeader className="p-4">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            Fluorgan
          </h1>
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
                      <Link to={item.url} className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{t(item.title, "common")}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
              <Users className="mr-2 h-4 w-4 inline-block" />
              {t("colleagues", "common")}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2 py-2">
              {isLoadingColleagues ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : colleagues?.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                  {t("noColleagues", "common")}
                </p>
              ) : (
                <div className="space-y-1">
                  {colleagues?.map((colleague) => (
                    <div
                      key={colleague.id}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={colleague.avatar_url || ""} />
                        <AvatarFallback>
                          {colleague.first_name?.[0]}
                          {colleague.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {colleague.first_name} {colleague.last_name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-gray-200 dark:border-gray-800">
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
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
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