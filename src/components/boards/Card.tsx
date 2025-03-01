
import { useState } from "react";
import { Calendar, User2, Tag, CheckSquare, MessageSquare, Paperclip, Clock } from "lucide-react";
import { Card as CardComponent } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { format } from "date-fns";
import { Card as CardType } from "@/types/board";
import { Draggable } from "react-beautiful-dnd";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CardProps {
  card: CardType;
  index: number;
  onCardClick: (card: CardType) => void;
}

export function Card({ card, index, onCardClick }: CardProps) {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const hasDueDate = Boolean(card.due_date);
  const hasAssignee = Boolean(card.assigned_to);
  const hasLabels = Boolean(card.labels && card.labels.length > 0);
  const hasChecklists = Boolean(card.checklists && card.checklists.length > 0);
  const hasComments = Boolean(card.comments && card.comments.length > 0);
  const hasAttachments = Boolean(card.attachments && card.attachments.length > 0);

  const isPastDue = hasDueDate && new Date(card.due_date!) < new Date();

  // Compute total and completed checklist items
  const checklistStats = card.checklists?.reduce(
    (acc, checklist) => {
      acc.total += checklist.items?.length || 0;
      acc.completed += checklist.items?.filter(item => item.is_completed)?.length || 0;
      return acc;
    },
    { total: 0, completed: 0 }
  );

  const handleClick = () => {
    onCardClick(card);
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            "mb-2 transform transition-transform",
            isHovered && "scale-[1.02]"
          )}
        >
          <CardComponent className="p-3 cursor-pointer hover:shadow-md">
            {hasLabels && (
              <div className="mb-2 flex flex-wrap gap-1">
                {card.labels?.map((label) => (
                  <span
                    key={label.id}
                    className="w-8 h-2 rounded-sm block"
                    style={{ backgroundColor: label.color }}
                    title={label.name}
                  />
                ))}
              </div>
            )}

            <h3 className="font-medium mb-2">{card.title}</h3>

            <div className="space-y-2">
              {card.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {card.description}
                </p>
              )}

              <div className="flex items-center gap-1 flex-wrap text-xs text-muted-foreground">
                {hasDueDate && (
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "flex items-center gap-1 text-xs",
                      isPastDue && "bg-destructive/10 text-destructive"
                    )}
                  >
                    <Clock className="h-3 w-3" />
                    {format(new Date(card.due_date!), "dd MMM")}
                  </Badge>
                )}

                {hasAttachments && (
                  <Badge variant="outline" className="flex items-center gap-1 text-xs">
                    <Paperclip className="h-3 w-3" />
                    {card.attachments?.length}
                  </Badge>
                )}

                {hasChecklists && checklistStats && (
                  <Badge variant="outline" className="flex items-center gap-1 text-xs">
                    <CheckSquare className="h-3 w-3" />
                    {checklistStats.completed}/{checklistStats.total}
                  </Badge>
                )}

                {hasComments && (
                  <Badge variant="outline" className="flex items-center gap-1 text-xs">
                    <MessageSquare className="h-3 w-3" />
                    {card.comments?.length}
                  </Badge>
                )}
              </div>

              {hasAssignee && (
                <div className="flex justify-end">
                  <div className="flex -space-x-1 overflow-hidden">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center" title={card.assigned_user?.first_name || ''}>
                      <User2 className="h-3 w-3 text-primary" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardComponent>
        </div>
      )}
    </Draggable>
  );
}
