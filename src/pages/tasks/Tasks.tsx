import { Layout } from "@/components/Layout";
import { TaskList } from "@/components/tasks/TaskList";
import { Button } from "@/components/ui/button";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Plus } from "lucide-react";

const Tasks = () => {
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{t("tasks")}</h1>
          <Button onClick={() => setCreateTaskOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("createTask")}
          </Button>
        </div>
        <TaskList />
        <CreateTaskDialog
          open={createTaskOpen}
          onOpenChange={setCreateTaskOpen}
        />
      </div>
    </Layout>
  );
};

export default Tasks;