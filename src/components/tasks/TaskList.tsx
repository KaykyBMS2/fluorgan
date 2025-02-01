import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DragDropContext } from "react-beautiful-dnd";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { TaskColumn } from "./TaskColumn";
import { TaskWithRelations } from "@/types/task";
import { useToast } from "@/components/ui/use-toast";
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
import { Button } from "@/components/ui/button";
import { ShareTaskDialog } from "./ShareTaskDialog";

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

    if (!sourceColumn || !destinationColumn) return;

    const taskId = result.draggableId;
    const newStatus = destinationColumn.status;

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus })
        .eq("id", taskId);

      if (error) throw error;

      // Update React Query cache immediately for better UX
      queryClient.setQueryData(["tasks"], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((task: TaskWithRelations) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        );
      });

      // Invalidate query to fetch updated data from server
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

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <TaskColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={getTasksByStatus(column.status)}
            />
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
              {t("deleteTaskDescription", "tasks")}
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