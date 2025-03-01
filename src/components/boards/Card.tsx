
import { Draggable } from "react-beautiful-dnd";
import { Calendar, MessageSquare, Paperclip, CheckSquare, User2 } from "lucide-react";
import { format } from "date-fns";
import { Card as CardType } from "@/types/board";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CardProps {
  card: CardType;
  index: number;
}

export function Card({ card, index }: CardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getUserInfo = () => {
    const user = card.assigned_user;
    if (!user) return null;

    const name = user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.username || '';

    return {
      name,
      initials: getInitials(name || '??'),
      avatar: user.avatar_url,
    };
  };

  const userInfo = getUserInfo();

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "mb-2 rounded-md border bg-card p-3 shadow-sm hover:shadow-md transition-shadow",
            snapshot.isDragging && "shadow-md rotate-1",
            card.color && `border-l-4 border-l-[${card.color}]`
          )}
        >
          <div className="space-y-2">
            <h4 className="font-medium">{card.title}</h4>
            {card.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {card.description}
              </p>
            )}

            {card.labels && card.labels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {card.labels.map((label) => (
                  <Badge
                    key={label.id}
                    variant="outline"
                    className="h-1.5 w-6"
                    style={{ backgroundColor: label.color }}
                  />
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-muted-foreground pt-2">
              <div className="flex gap-2">
                {card.due_date && (
                  <div className="flex items-center text-xs">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {format(new Date(card.due_date), "MMM d")}
                  </div>
                )}

                {card.comments && card.comments.length > 0 && (
                  <div className="flex items-center text-xs">
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    {card.comments.length}
                  </div>
                )}

                {card.attachments && card.attachments.length > 0 && (
                  <div className="flex items-center text-xs">
                    <Paperclip className="h-3.5 w-3.5 mr-1" />
                    {card.attachments.length}
                  </div>
                )}

                {card.checklists && card.checklists.length > 0 && (
                  <div className="flex items-center text-xs">
                    <CheckSquare className="h-3.5 w-3.5 mr-1" />
                    {card.checklists.reduce((count, checklist) => {
                      const completed = checklist.items?.filter(item => item.is_completed).length || 0;
                      const total = checklist.items?.length || 0;
                      return count + `${completed}/${total}`;
                    }, "")}
                  </div>
                )}
              </div>

              {userInfo && (
                <div className="flex items-center">
                  <Avatar className="h-6 w-6">
                    {userInfo.avatar && (
                      <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                    )}
                    <AvatarFallback className="text-xs">
                      {userInfo.initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
