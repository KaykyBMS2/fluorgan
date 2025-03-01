
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/theme/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartLegend, 
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent 
} from "@/components/ui/chart";
import { BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Bar, ResponsiveContainer, Tooltip } from "recharts";

interface TasksChartProps {
  data: Array<{
    name: string;
    pending: number;
    completed: number;
  }>;
}

export function TasksChart({ data }: TasksChartProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  const config = {
    pending: {
      label: t("pending", "tasks"),
      color: "#0249FF"
    },
    completed: {
      label: t("completed", "tasks"),
      color: "#28A745"
    },
  };
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>{t("tasksOverview")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer
            config={config}
            className="w-full h-full"
          >
            <RechartsBarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: theme === 'dark' ? '#e5e7eb' : '#4b5563' }}
                axisLine={{ stroke: theme === 'dark' ? '#374151' : '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fill: theme === 'dark' ? '#e5e7eb' : '#4b5563' }}
                axisLine={{ stroke: theme === 'dark' ? '#374151' : '#e5e7eb' }}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="pending" fill="#0249FF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" fill="#28A745" radius={[4, 4, 0, 0]} />
              <ChartLegend content={<ChartLegendContent />} />
            </RechartsBarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
