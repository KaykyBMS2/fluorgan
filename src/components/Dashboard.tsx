
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart2,
  Plus,
  UserPlus,
  TrendingUp,
  Target,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { CreateTaskDialog } from "./tasks/CreateTaskDialog";
import { AddFriendDialog } from "./friends/AddFriendDialog";
import { useAuth } from "@/lib/auth/AuthContext";
import { Link } from "react-router-dom";
import { NotificationsButton } from "./notifications/NotificationsButton";
import { PremiumFeature } from "./PremiumFeature";
import { Progress } from "./ui/progress";
import { TaskStatsCard } from "./dashboard/TaskStatsCard";
import { AchievementCard } from "./dashboard/AchievementCard";
import { ActivityCard } from "./dashboard/ActivityCard";
import { TasksChart } from "./dashboard/TasksChart";
import { startOfWeek, endOfWeek, format, eachDayOfInterval, addDays } from "date-fns";

export const Dashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [addFriendOpen, setAddFriendOpen] = useState(false);

  const { data: taskStats } = useQuery({
    queryKey: ["taskStats"],
    queryFn: async () => {
      const [pending, completed, overdue] = await Promise.all([
        supabase
          .from("tasks")
          .select("*", { count: "exact" })
          .eq("status", "pending")
          .eq("created_by", user?.id),
        supabase
          .from("tasks")
          .select("*", { count: "exact" })
          .eq("status", "completed")
          .eq("created_by", user?.id),
        supabase
          .from("tasks")
          .select("*", { count: "exact" })
          .lt("due_date", new Date().toISOString())
          .neq("status", "completed")
          .eq("created_by", user?.id),
      ]);

      const total = (pending.count || 0) + (completed.count || 0);
      const productivity = total > 0 ? ((completed.count || 0) / total) * 100 : 0;

      return {
        pending: pending.count || 0,
        completed: completed.count || 0,
        overdue: overdue.count || 0,
        productivity,
      };
    },
  });

  const { data: weeklyStats } = useQuery({
    queryKey: ["weeklyStats"],
    queryFn: async () => {
      const startDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
      const endDate = endOfWeek(new Date(), { weekStartsOn: 1 }); // Sunday
      
      // Generate dates for the week
      const dates = eachDayOfInterval({
        start: startDate,
        end: endDate
      });
      
      const dateRanges = dates.map(date => ({
        start: date,
        end: addDays(date, 1)
      }));
      
      const results = await Promise.all(
        dateRanges.map(async ({ start, end }) => {
          const [pending, completed] = await Promise.all([
            supabase
              .from("tasks")
              .select("*", { count: "exact" })
              .eq("status", "pending")
              .eq("created_by", user?.id)
              .gte("created_at", start.toISOString())
              .lt("created_at", end.toISOString()),
            supabase
              .from("tasks")
              .select("*", { count: "exact" })
              .eq("status", "completed")
              .eq("created_by", user?.id)
              .gte("created_at", start.toISOString())
              .lt("created_at", end.toISOString()),
          ]);
          
          return {
            name: format(start, "E"),
            pending: pending.count || 0,
            completed: completed.count || 0
          };
        })
      );
      
      return results;
    },
    enabled: !!user?.id
  });

  const { data: userStats } = useQuery({
    queryKey: ["userStats", user?.id],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("experience_points, level")
        .eq("id", user?.id)
        .single();

      return profile;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold">{t("dashboard")}</h1>
            <NotificationsButton />
          </div>
          <p className="text-muted-foreground mt-1">{t("welcome", "common")}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => setCreateTaskOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            {t("createTask")}
          </Button>
          <Button variant="outline" onClick={() => setAddFriendOpen(true)} className="w-full sm:w-auto">
            <UserPlus className="mr-2 h-4 w-4" />
            {t("addFriend")}
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link to="/tasks">{t("viewAllTasks")}</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TaskStatsCard 
          title={t("pending", "tasks")}
          value={taskStats?.pending || 0}
          icon={<Clock className="h-6 w-6" />}
          iconBgClass="bg-primary/10"
          iconColor="text-primary"
        />

        <TaskStatsCard 
          title={t("completed", "tasks")}
          value={taskStats?.completed || 0}
          icon={<CheckCircle2 className="h-6 w-6" />}
          iconBgClass="bg-secondary/10"
          iconColor="text-secondary"
        />

        <TaskStatsCard 
          title={t("overdue", "tasks")}
          value={taskStats?.overdue || 0}
          icon={<AlertCircle className="h-6 w-6" />}
          iconBgClass="bg-destructive/10"
          iconColor="text-destructive"
        />

        <TaskStatsCard 
          title={t("productivity", "tasks")}
          value={`${taskStats?.productivity.toFixed(0)}%`}
          icon={<BarChart2 className="h-6 w-6" />}
          iconBgClass="bg-primary/10"
          iconColor="text-primary"
        >
          <Progress value={taskStats?.productivity || 0} className="h-2" />
        </TaskStatsCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {weeklyStats && <TasksChart data={weeklyStats} />}
        
        <div className="space-y-6">
          <PremiumFeature>
            <AchievementCard 
              level={userStats?.level || 1} 
              experiencePoints={userStats?.experience_points || 0} 
            />
          </PremiumFeature>
          
          <ActivityCard />
        </div>
      </div>

      <CreateTaskDialog open={createTaskOpen} onOpenChange={setCreateTaskOpen} />
      <AddFriendDialog open={addFriendOpen} onOpenChange={setAddFriendOpen} />
    </div>
  );
};
