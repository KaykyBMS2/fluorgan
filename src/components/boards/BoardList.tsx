
import { Draggable, Droppable } from "react-beautiful-dnd";
import { MoreHorizontal, Plus } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { List } from "@/types/board";
import { Card as CardComponent } from "@/components/boards/Card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface BoardListProps {
  list: List;
  index: number;
  onCreateCard: () => void;
}

export function BoardList({ list, index, onCreateCard }: BoardListProps) {
  const { t } = useLanguage();

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="min-w-[272px] w-[272px] shrink-0 flex flex-col rounded-lg bg-secondary/10 border border-secondary/20 overflow-hidden snap-start"
        >
          <div
            {...provided.dragHandleProps}
            className="px-3 py-2 flex justify-between items-center bg-secondary/20"
          >
            <h3 className="font-medium truncate">{list.name}</h3>
            <div className="flex items-center">
              <span className="text-xs text-muted-foreground mr-2">
                {list.cards?.length || 0}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    {t("boards.editList", "Editar lista")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    {t("boards.archiveList", "Arquivar lista")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Droppable droppableId={list.id} type="CARD">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  "p-2 flex-grow overflow-y-auto max-h-[calc(100vh-240px)]",
                  snapshot.isDraggingOver && "bg-primary/5"
                )}
              >
                {list.cards?.map((card, cardIndex) => (
                  <CardComponent
                    key={card.id}
                    card={card}
                    index={cardIndex}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="p-2 border-t border-secondary/20 bg-background">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground"
              onClick={onCreateCard}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("boards.addCard", "Adicionar cartão")}
            </Button>
          </div>
        </div>
      )}
    </Draggable>
  );
}
