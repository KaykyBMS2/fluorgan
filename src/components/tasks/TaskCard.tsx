import { Draggable } from "react-beautiful-dnd";
import { format } from "date-fns";
import { Calendar, Edit, Share2, Trash2, User2 } from "lucide-react";
import { TaskWithRelations } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TaskCardProps {
  task: TaskWithRelations;
  index: number;
  onEdit?: (task: TaskWithRelations) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
}

export const TaskCard = ({ task, index, onEdit, onDelete, onShare }: TaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-accent text-accent-foreground";
      case "low":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-background border shadow-sm hover:shadow-md transition-shadow"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg line-clamp-1">
                {task.title}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onShare?.(task.id)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEdit?.(task)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onDelete?.(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription className="line-clamp-2 mt-1">
              {task.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className={getPriorityColor(task.priority)}
              >
                {task.priority}
              </Badge>
              {task.tags?.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="bg-background"
                  style={{ borderColor: tag.color }}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 pt-3 border-t">
            {task.due_date && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground w-full">
                <Calendar className="h-4 w-4" />
                <span className="truncate">
                  {format(new Date(task.due_date), "PPP")}
                </span>
              </div>
            )}
            {task.assigned_to && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground w-full">
                <User2 className="h-4 w-4" />
                <span className="truncate">
                  {task.assigned_to.username ||
                    `${task.assigned_to.first_name} ${task.assigned_to.last_name}`}
                </span>
              </div>
            )}
          </CardFooter>
        </Card>
      )}
    </Draggable>
  );
};