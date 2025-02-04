import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface DeleteTaskDialogProps {
  taskId: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteTaskDialog({ taskId, onOpenChange, onConfirm }: DeleteTaskDialogProps) {
  const { t } = useLanguage();

  return (
    <AlertDialog open={!!taskId} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteTask")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteTaskDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-500">
            {t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}