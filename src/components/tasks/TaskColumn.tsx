import { Droppable } from "react-beautiful-dnd";
import { TaskCard } from "./TaskCard";
import { TaskWithRelations } from "@/types/task";

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: TaskWithRelations[];
}

export const TaskColumn = ({ id, title, tasks }: TaskColumnProps) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 space-y-4"
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};