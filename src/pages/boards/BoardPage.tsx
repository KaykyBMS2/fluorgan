
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Board, Card, List } from "@/types/board";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ChevronLeft, ArrowLeft, Plus } from "lucide-react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { BoardList } from "@/components/boards/BoardList";
import { useAuth } from "@/lib/auth/AuthContext";

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const { data: board, isLoading: isBoardLoading } = useQuery({
    queryKey: ["board", id],
    queryFn: async () => {
      // Get the board
      const { data: boardData, error: boardError } = await supabase
        .from("boards")
        .select("*")
        .eq("id", id)
        .single();

      if (boardError) throw boardError;

      // Get the lists for this board
      const { data: listsData, error: listsError } = await supabase
        .from("lists")
        .select("*")
        .eq("board_id", id)
        .eq("is_archived", false)
        .order("position", { ascending: true });

      if (listsError) throw listsError;

      // Get all cards for this board
      const { data: cardsData, error: cardsError } = await supabase
        .from("cards")
        .select(`
          *,
          assigned_user:assigned_to(*)
        `)
        .eq("is_archived", false);

      if (cardsError) throw cardsError;

      // Organize cards into their respective lists
      const lists = listsData.map((list) => ({
        ...list,
        cards: cardsData
          .filter((card) => card.list_id === list.id)
          .sort((a, b) => a.position - b.position),
      }));

      return {
        ...boardData,
        lists,
      } as Board;
    },
    enabled: !!id && !!user,
  });

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setCardModalOpen(true);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "list") {
      try {
        // Get all lists
        const lists = [...(board?.lists || [])];
        
        // Reorder the lists
        const [removedList] = lists.splice(source.index, 1);
        lists.splice(destination.index, 0, removedList);

        // Update positions in UI
        const updatedLists = lists.map((list, index) => ({
          ...list,
          position: index,
        }));

        // Update locally first
        queryClient.setQueryData(["board", id], {
          ...board,
          lists: updatedLists,
        });

        // Update in database
        const updates = updatedLists.map((list) => ({
          id: list.id,
          position: list.position,
        }));

        for (const update of updates) {
          const { error } = await supabase
            .from("lists")
            .update({ position: update.position })
            .eq("id", update.id);

          if (error) throw error;
        }
      } catch (error: any) {
        console.error("Error reordering lists:", error);
        toast({
          title: t("boards.error", "Erro"),
          description: error.message,
          variant: "destructive",
        });
        // Refresh data from server
        queryClient.invalidateQueries({ queryKey: ["board", id] });
      }
    } else if (type === "card") {
      try {
        const sourceListId = source.droppableId;
        const destinationListId = destination.droppableId;
        const cardId = draggableId;

        // Create a copy of the board
        const newBoard = { ...board } as Board;
        
        // Find the source and destination lists
        const sourceList = newBoard.lists?.find((list) => list.id === sourceListId);
        const destinationList = newBoard.lists?.find((list) => list.id === destinationListId);

        if (!sourceList || !destinationList) return;

        // Remove the card from the source list
        const card = sourceList.cards?.find((card) => card.id === cardId);
        if (!card) return;
        
        sourceList.cards = sourceList.cards?.filter((card) => card.id !== cardId);

        // Add the card to the destination list at the right position
        card.list_id = destinationListId;
        destinationList.cards = destinationList.cards || [];
        destinationList.cards.splice(destination.index, 0, card);

        // Update positions for all cards in destination list
        destinationList.cards = destinationList.cards.map((card, index) => ({
          ...card,
          position: index,
        }));

        // If source and destination are different, update positions in source list too
        if (sourceList.id !== destinationList.id) {
          sourceList.cards = (sourceList.cards || []).map((card, index) => ({
            ...card,
            position: index,
          }));
        }

        // Update locally first
        queryClient.setQueryData(["board", id], newBoard);

        // Update in database
        const { error } = await supabase
          .from("cards")
          .update({
            list_id: destinationListId,
            position: destination.index,
          })
          .eq("id", cardId);

        if (error) throw error;

        // Update positions for all cards in destination list
        for (let i = 0; i < (destinationList.cards || []).length; i++) {
          const currentCard = destinationList.cards?.[i];
          if (currentCard && currentCard.position !== i) {
            const { error } = await supabase
              .from("cards")
              .update({ position: i })
              .eq("id", currentCard.id);
            
            if (error) throw error;
          }
        }

        // If source and destination are different, update positions in source list too
        if (sourceList.id !== destinationList.id) {
          for (let i = 0; i < (sourceList.cards || []).length; i++) {
            const currentCard = sourceList.cards?.[i];
            if (currentCard && currentCard.position !== i) {
              const { error } = await supabase
                .from("cards")
                .update({ position: i })
                .eq("id", currentCard.id);
              
              if (error) throw error;
            }
          }
        }
      } catch (error: any) {
        console.error("Error moving card:", error);
        toast({
          title: t("boards.error", "Erro"),
          description: error.message,
          variant: "destructive",
        });
        // Refresh data from server
        queryClient.invalidateQueries({ queryKey: ["board", id] });
      }
    }
  };

  if (isBoardLoading) {
    return (
      <Layout>
        <div className="container py-6 animate-pulse">
          <div className="h-8 w-1/3 bg-muted rounded mb-6" />
          <div className="flex gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-[280px] h-[400px] bg-muted rounded" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!board) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">
            {t("boards.boardNotFound", "Quadro não encontrado")}
          </h1>
          <p className="text-muted-foreground mb-6">
            {t(
              "boards.boardNotFoundDesc",
              "O quadro que você está procurando não existe ou você não tem permissão para visualizá-lo"
            )}
          </p>
          <Button onClick={() => navigate("/boards")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("boards.backToBoards", "Voltar para Quadros")}
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="h-full flex flex-col">
        <div className="container py-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/boards")}
                className="mr-2"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">{board.name}</h1>
            </div>
          </div>
          {board.description && (
            <p className="text-muted-foreground text-sm">{board.description}</p>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="all-lists" direction="horizontal" type="list">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex gap-4 p-4 h-full overflow-x-auto"
                >
                  {board.lists?.map((list, index) => (
                    <BoardList
                      key={list.id}
                      list={list}
                      index={index}
                      boardId={board.id}
                      onCardClick={handleCardClick}
                    />
                  ))}
                  {provided.placeholder}

                  <div className="w-[280px] shrink-0">
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      {t("boards.addList", "Adicionar nova lista")}
                    </Button>
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      {/* Card detail modal would go here */}
    </Layout>
  );
}
