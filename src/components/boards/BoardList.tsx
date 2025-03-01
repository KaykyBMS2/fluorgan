
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";
import { MoreHorizontal, Plus } from "lucide-react";
import { List, Card as CardType } from "@/types/board";
import { Card } from "@/components/boards/Card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CreateCardModal } from "@/components/boards/CreateCardModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth/AuthContext";

interface BoardListProps {
  list: List;
  index: number;
  boardId: string;
  onCardClick: (card: CardType) => void;
}

export function BoardList({ list, index, boardId, onCardClick }: BoardListProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [createCardOpen, setCreateCardOpen] = useState(false);

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="w-[280px] shrink-0 bg-muted/30 dark:bg-muted/20 rounded-md flex flex-col max-h-full"
        >
          {/* List Header */}
          <div
            {...provided.dragHandleProps}
            className="p-2 flex items-center justify-between border-b"
          >
            <h3 className="font-medium text-sm flex items-center gap-2">
              {list.name}
              <span className="text-muted-foreground text-xs">
                {list.cards?.length || 0}
              </span>
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">
                    {t("boards.listOptions", "Opções da lista")}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  {t("boards.renameList", "Renomear lista")}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  {t("boards.archiveList", "Arquivar lista")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Cards */}
          <Droppable droppableId={list.id} type="card">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="p-2 flex-1 overflow-y-auto"
              >
                {list.cards?.map((card, cardIndex) => (
                  <Card 
                    key={card.id} 
                    card={card} 
                    index={cardIndex} 
                    onCardClick={onCardClick} 
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Add Card Button */}
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground"
              onClick={() => setCreateCardOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              {t("boards.addCard", "Adicionar cartão")}
            </Button>
          </div>

          <CreateCardModal
            open={createCardOpen}
            onOpenChange={setCreateCardOpen}
            listId={list.id}
            boardId={boardId}
          />
        </div>
      )}
    </Draggable>
  );
}
