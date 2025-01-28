import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";

interface ShareTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string | null;
}

export function ShareTaskDialog({
  open,
  onOpenChange,
  taskId,
}: ShareTaskDialogProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name");

      if (error) throw error;
      return data as Tables["profiles"][];
    },
  });

  const handleShare = async () => {
    if (!taskId || !selectedUserId) return;

    const { error } = await supabase
      .from("tasks")
      .update({ assigned_to: selectedUserId })
      .eq("id", taskId);

    if (error) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: t("success"),
        description: t("taskShared"),
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("shareTask")}</DialogTitle>
          <DialogDescription>
            {t("shareTaskDescription")}
          </DialogDescription>
        </DialogHeader>
        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
          <SelectTrigger>
            <SelectValue placeholder={t("selectUser")} />
          </SelectTrigger>
          <SelectContent>
            {users?.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {`${user.first_name} ${user.last_name}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleShare}>{t("share")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}