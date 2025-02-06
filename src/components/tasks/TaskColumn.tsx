import { Droppable } from "react-beautiful-dnd";
import { TaskCard } from "./TaskCard";
import { TaskWithRelations } from "@/types/task";
import { Card } from "@/components/ui/card";

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: TaskWithRelations[];
}

export const TaskColumn = ({ id, title, tasks }: TaskColumnProps) => {
  return (
    <Card className="flex flex-col min-w-[300px] bg-background border shadow-sm">
      <h2 className="text-lg font-semibold mb-4 px-4 pt-4">{title}</h2>
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 space-y-4 p-4 min-h-[200px]"
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Card>
  );
};