import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart2,
  Plus,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { CreateTaskDialog } from "./tasks/CreateTaskDialog";
import { useAuth } from "@/lib/auth/AuthContext";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

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
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("dashboard")}</h1>
          <p className="text-gray-500 mt-2">
            {t("welcome", "common")}
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => setCreateTaskOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("createTask")}
          </Button>
          <Button variant="outline" asChild>
            <Link to="/tasks">{t("viewAllTasks")}</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Clock className="h-6 w-6 text-primary-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("pending", "tasks")}</p>
              <p className="text-2xl font-bold text-gray-900">
                {taskStats?.pending || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-secondary-50 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-secondary-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("completed", "tasks")}</p>
              <p className="text-2xl font-bold text-gray-900">
                {taskStats?.completed || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("overdue", "tasks")}</p>
              <p className="text-2xl font-bold text-gray-900">
                {taskStats?.overdue || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <BarChart2 className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("productivity", "tasks")}</p>
              <p className="text-2xl font-bold text-gray-900">
                {taskStats?.productivity.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <CreateTaskDialog
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
      />
    </div>
  );
};