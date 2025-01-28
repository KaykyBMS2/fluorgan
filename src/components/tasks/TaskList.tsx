import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  Share2,
  Trash2,
  User2,
} from "lucide-react";
import { format } from "date-fns";
import { Tables } from "@/integrations/supabase/types";
import { ShareTaskDialog } from "./ShareTaskDialog";

type TaskWithRelations = Tables<"tasks"> & {
  assigned_to: Tables<"profiles">;
  tags: Tables<"tags">[];
};

export function TaskList() {
  const { t } = useLanguage();
  const [shareTaskId, setShareTaskId] = useState<string | null>(null);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          assigned_to (
            id,
            first_name,
            last_name
          ),
          tags (
            id,
            name,
            color
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as TaskWithRelations[];
    },
  });

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in_progress":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks?.map((task) => (
        <Card key={task.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{task.title}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShareTaskId(task.id)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription>{task.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              <Badge variant="secondary" className={getStatusColor(task.status)}>
                {task.status}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            {task.due_date && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                {format(new Date(task.due_date), "PPP")}
              </div>
            )}
            {task.assigned_to && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User2 className="h-4 w-4" />
                {`${task.assigned_to.first_name} ${task.assigned_to.last_name}`}
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
      <ShareTaskDialog
        open={!!shareTaskId}
        onOpenChange={() => setShareTaskId(null)}
        taskId={shareTaskId}
      />
    </div>
  );
}