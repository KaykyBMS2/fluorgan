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

type TaskWithRelations = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  status_color: string | null;
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
          assigned_to:profiles!tasks_assigned_to_fkey (*),
          tags (*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as TaskWithRelations[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-gray-500">{t("loading")}</p>
      </div>
    );
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
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 animate-in fade-in slide-in-from-bottom duration-500">
      {tasks?.map((task) => (
        <Card key={task.id} className="flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg line-clamp-1">{task.title}</CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShareTaskId(task.id)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription className="line-clamp-2 mt-1">
              {task.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              <Badge variant="secondary" className={getStatusColor(task.status)}>
                {task.status}
              </Badge>
              {task.tags?.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  style={{ backgroundColor: tag.color + "20" }}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 pt-3 border-t">
            {task.due_date && (
              <div className="flex items-center gap-2 text-sm text-gray-500 w-full">
                <Calendar className="h-4 w-4" />
                <span className="truncate">
                  {format(new Date(task.due_date), "PPP")}
                </span>
              </div>
            )}
            {task.assigned_to && (
              <div className="flex items-center gap-2 text-sm text-gray-500 w-full">
                <User2 className="h-4 w-4" />
                <span className="truncate">
                  {task.assigned_to.username || 
                    `${task.assigned_to.first_name} ${task.assigned_to.last_name}`}
                </span>
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