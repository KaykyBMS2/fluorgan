import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { TablesInsert } from "@/integrations/supabase/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TaskForm } from "./form/TaskForm";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTaskDialog({ open, onOpenChange }: CreateTaskDialogProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user?.id);

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (data: TablesInsert<"tasks">) => {
    if (!user) {
      toast({
        title: t("error"),
        description: t("notAuthenticated"),
        variant: "destructive",
      });
      return;
    }

    const taskData = {
      ...data,
      created_by: user.id,
    };

    const { error: taskError } = await supabase
      .from("tasks")
      .insert(taskData)
      .select("*, assigned_to:profiles!tasks_assigned_to_fkey (*)")
      .single();

    if (taskError) {
      toast({
        title: t("error"),
        description: taskError.message,
        variant: "destructive",
      });
      return;
    }

    if (data.assigned_to) {
      const { error: notificationError } = await supabase.from("notifications").insert({
        user_id: data.assigned_to,
        title: "New Task Assignment",
        message: `${user.email} assigned you a new task: ${data.title}`,
        type: "task_assignment",
      });

      if (notificationError) {
        console.error("Error creating notification:", notificationError);
      }
    }

    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    queryClient.invalidateQueries({ queryKey: ["notifications"] });

    toast({
      title: t("success"),
      description: t("taskCreated"),
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("createTask")}</DialogTitle>
          <DialogDescription>
            {t("createTaskDescription")}
          </DialogDescription>
        </DialogHeader>
        <TaskForm 
          users={users}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}