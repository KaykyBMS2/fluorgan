import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { TaskWithRelations } from "@/types/task";

interface EditTaskDialogProps {
  task: TaskWithRelations | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function EditTaskDialog({ task, onOpenChange, onSubmit }: EditTaskDialogProps) {
  const { t } = useLanguage();

  if (!task) return null;

  return (
    <Dialog open={!!task} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("editTask")}</DialogTitle>
          <DialogDescription>{t("editTaskDescription")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title">{t("title")}</label>
              <Input
                id="title"
                name="title"
                defaultValue={task?.title}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description">{t("description")}</label>
              <Textarea
                id="description"
                name="description"
                defaultValue={task?.description || ""}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit">{t("save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}