
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart2,
  Plus,
  UserPlus,
  Trophy,
  Star,
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
        <Card className="p-6 bg-card hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("pending", "tasks")}</p>
              <p className="text-2xl font-bold">{taskStats?.pending || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-secondary/10 rounded-xl">
              <CheckCircle2 className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("completed", "tasks")}</p>
              <p className="text-2xl font-bold">{taskStats?.completed || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-destructive/10 rounded-xl">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("overdue", "tasks")}</p>
              <p className="text-2xl font-bold">{taskStats?.overdue || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <BarChart2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("productivity", "tasks")}</p>
              <div className="space-y-2">
                <p className="text-2xl font-bold">{taskStats?.productivity.toFixed(0)}%</p>
                <Progress value={taskStats?.productivity || 0} className="h-2" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <PremiumFeature>
          <Card className="p-6 bg-card hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  {t("achievements")}
                </h3>
                <Button variant="outline" size="sm">
                  {t("viewAll")}
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Star className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Level {userStats?.level || 1}</p>
                      <p className="text-sm text-muted-foreground">
                        {userStats?.experience_points || 0} XP
                      </p>
                    </div>
                  </div>
                  <Progress value={65} className="w-24 h-2" />
                </div>
              </div>
            </div>
          </Card>
        </PremiumFeature>

        <Card className="p-6 bg-card hover:shadow-lg transition-shadow lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                {t("recentActivity")}
              </h3>
              <Button variant="outline" size="sm">
                {t("viewAll")}
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <Target className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">{t("completedTask")}</p>
                    <p className="text-sm text-muted-foreground">2 {t("hoursAgo")}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  {t("details")}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <CreateTaskDialog open={createTaskOpen} onOpenChange={setCreateTaskOpen} />
      <AddFriendDialog open={addFriendOpen} onOpenChange={setAddFriendOpen} />
    </div>
  );
};
