import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useToast } from "@/components/ui/use-toast";

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

type Column = {
  id: string;
  title: string;
  status: string;
};

const columns: Column[] = [
  { id: "todo", title: "A Fazer", status: "pending" },
  { id: "inProgress", title: "Em Progresso", status: "in_progress" },
  { id: "done", title: "Concluído", status: "completed" },
];

export function TaskList() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [shareTaskId, setShareTaskId] = useState<string | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [editTask, setEditTask] = useState<TaskWithRelations | null>(null);

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

  const handleDeleteTask = async () => {
    if (!deleteTaskId) return;

    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", deleteTaskId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: t("success"),
        description: t("taskDeleted", "tasks"),
      });
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteTaskId(null);
    }
  };

  const handleUpdateTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editTask) return;

    const formData = new FormData(event.currentTarget);
    const updatedTask = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
    };

    try {
      const { error } = await supabase
        .from("tasks")
        .update(updatedTask)
        .eq("id", editTask.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: t("success"),
        description: t("taskUpdated", "tasks"),
      });
      setEditTask(null);
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const sourceColumn = columns.find((col) => col.id === result.source.droppableId);
    const destinationColumn = columns.find(
      (col) => col.id === result.destination.droppableId
    );

    if (!sourceColumn || !destinationColumn || sourceColumn.id === destinationColumn.id)
      return;

    const taskId = result.draggableId;
    const newStatus = destinationColumn.status;

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus })
        .eq("id", taskId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      toast({
        title: t("success"),
        description: t("taskUpdated", "tasks"),
      });
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-gray-500">{t("loading")}</p>
      </div>
    );
  }

  const getTasksByStatus = (status: string) => {
    return tasks?.filter((task) => task.status === status) || [];
  };

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

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              <h2 className="text-lg font-semibold mb-4">{column.title}</h2>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 space-y-4"
                  >
                    {getTasksByStatus(column.status).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="hover:shadow-lg transition-shadow"
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <CardTitle className="text-lg line-clamp-1">
                                  {task.title}
                                </CardTitle>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setShareTaskId(task.id)}
                                  >
                                    <Share2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setEditTask(task)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setDeleteTaskId(task.id)}
                                  >
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
                                <Badge
                                  variant="secondary"
                                  className={getPriorityColor(task.priority)}
                                >
                                  {task.priority}
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
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <ShareTaskDialog
        open={!!shareTaskId}
        onOpenChange={() => setShareTaskId(null)}
        taskId={shareTaskId}
      />

      <AlertDialog open={!!deleteTaskId} onOpenChange={() => setDeleteTaskId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTask", "tasks")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteTaskConfirmation", "tasks")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-red-500">
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!editTask} onOpenChange={() => setEditTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editTask", "tasks")}</DialogTitle>
            <DialogDescription>{t("editTaskDescription", "tasks")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateTask}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title">{t("title")}</label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editTask?.title}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description">{t("description")}</label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editTask?.description || ""}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditTask(null)}>
                {t("cancel")}
              </Button>
              <Button type="submit">{t("save")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}