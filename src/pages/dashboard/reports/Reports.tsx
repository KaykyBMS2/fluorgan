import { Layout } from "@/components/Layout";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "recharts";
import { startOfMonth, endOfMonth, format } from "date-fns";

const Reports = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const { data: taskStats } = useQuery({
    queryKey: ["taskStats", "monthly"],
    queryFn: async () => {
      const startDate = startOfMonth(new Date());
      const endDate = endOfMonth(new Date());

      const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("created_by", user?.id)
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      if (error) throw error;

      const statusCount = tasks.reduce((acc: any, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {});

      const priorityCount = tasks.reduce((acc: any, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
      }, {});

      return {
        statusData: Object.entries(statusCount).map(([name, value]) => ({
          name,
          value,
        })),
        priorityData: Object.entries(priorityCount).map(([name, value]) => ({
          name,
          value,
        })),
      };
    },
    enabled: !!user?.id,
  });

  return (
    <Layout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t("reports")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t("reportsDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("tasksByStatus")}</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart width={400} height={300} data={taskStats?.statusData}>
                {/* Add PieChart configuration */}
              </PieChart>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("tasksByPriority")}</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart width={400} height={300} data={taskStats?.priorityData}>
                {/* Add BarChart configuration */}
              </BarChart>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;