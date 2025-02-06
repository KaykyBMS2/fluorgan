import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DragDropContext } from "react-beautiful-dnd";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { TaskColumn } from "./TaskColumn";
import { TaskWithRelations } from "@/types/task";
import { useToast } from "@/hooks/use-toast";
import { ShareTaskDialog } from "./ShareTaskDialog";
import { EditTaskDialog } from "./dialogs/EditTaskDialog";
import { DeleteTaskDialog } from "./dialogs/DeleteTaskDialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [scrollPosition, setScrollPosition] = useState(0);

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

      queryClient.setQueryData(["tasks"], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((task: TaskWithRelations) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        );
      });

      toast({
        title: t("success"),
        description: t("taskUpdated"),
      });
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('kanban-container');
    if (!container) return;

    const scrollAmount = 300;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : scrollPosition + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    setScrollPosition(newPosition);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  const getTasksByStatus = (status: string) => {
    return tasks?.filter((task) => task.status === status) || [];
  };

  return (
    <div className="relative">
      <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 z-10">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => handleScroll('left')}
          className="rounded-full bg-background/80 backdrop-blur-sm shadow-md"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => handleScroll('right')}
          className="rounded-full bg-background/80 backdrop-blur-sm shadow-md"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div 
          id="kanban-container"
          className="flex gap-6 overflow-x-auto pb-4 px-4 snap-x snap-mandatory hide-scrollbar"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {columns.map((column) => (
            <div key={column.id} className="snap-center">
              <TaskColumn
                id={column.id}
                title={column.title}
                tasks={getTasksByStatus(column.status)}
              />
            </div>
          ))}
        </div>
      </DragDropContext>

      <ShareTaskDialog
        open={!!shareTaskId}
        onOpenChange={() => setShareTaskId(null)}
        taskId={shareTaskId}
      />

      <DeleteTaskDialog
        taskId={deleteTaskId}
        onOpenChange={() => setDeleteTaskId(null)}
      />

      <EditTaskDialog
        task={editTask}
        onOpenChange={() => setEditTask(null)}
      />
    </div>
  );
}