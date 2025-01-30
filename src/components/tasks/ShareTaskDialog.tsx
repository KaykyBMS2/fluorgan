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
      return data as Tables<"profiles", "Row">[];
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("shareTask")}</DialogTitle>
          <DialogDescription className="text-gray-500">
            {t("shareTaskDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger className="w-full">
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
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            {t("cancel")}
          </Button>
          <Button 
            onClick={handleShare}
            className="w-full sm:w-auto"
          >
            {t("share")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}