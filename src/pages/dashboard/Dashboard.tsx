import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthContext";

const Dashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

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
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t("dashboard")}</h1>
          <p className="text-gray-500">{t("welcome")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium">{t("pending")}</h3>
            <p className="text-3xl font-bold mt-2">{taskStats?.pending || 0}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium">{t("completed")}</h3>
            <p className="text-3xl font-bold mt-2">{taskStats?.completed || 0}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium">{t("overdue")}</h3>
            <p className="text-3xl font-bold mt-2">{taskStats?.overdue || 0}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium">{t("productivity")}</h3>
            <p className="text-3xl font-bold mt-2">
              {taskStats?.productivity.toFixed(0)}%
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;