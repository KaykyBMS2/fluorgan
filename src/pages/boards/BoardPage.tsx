
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Board, List, Card as CardType } from "@/types/board";
import { BoardList } from "@/components/boards/BoardList";
import { Button } from "@/components/ui/button";
import { Plus, Users, Settings } from "lucide-react";
import { CreateCardModal } from "@/components/boards/CreateCardModal";

const BoardPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [createCardModalOpen, setCreateCardModalOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const { data: board, isLoading } = useQuery({
    queryKey: ["board", id],
    queryFn: async () => {
      if (!id) throw new Error("Board ID is required");

      const { data: boardData, error: boardError } = await supabase
        .from("boards")
        .select("*")
        .eq("id", id)
        .single();

      if (boardError) throw boardError;

      const { data: listsData, error: listsError } = await supabase
        .from("lists")
        .select("*")
        .eq("board_id", id)
        .eq("is_archived", false)
        .order("position");

      if (listsError) throw listsError;

      const { data: cardsData, error: cardsError } = await supabase
        .from("cards")
        .select(`
          *,
          assigned_to:profiles(*)
        `)
        .eq("is_archived", false)
        .in(
          "list_id",
          listsData.map((list) => list.id)
        )
        .order("position");

      if (cardsError) throw cardsError;

      // Group cards by list
      const listsWithCards = listsData.map((list) => ({
        ...list,
        cards: cardsData.filter((card) => card.list_id === list.id),
      }));

      return {
        ...boardData,
        lists: listsWithCards,
      } as Board;
    },
    enabled: !!id,
  });

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, type, draggableId } = result;

    // Dropped outside the list
    if (!destination) return;

    // No movement
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Update locally first for a responsive UI
    queryClient.setQueryData(["board", id], (oldData: any) => {
      if (!oldData) return oldData;

      const newBoard = { ...oldData };

      if (type === "LIST") {
        // Reorder lists
        const newLists = Array.from(newBoard.lists);
        const [movedList] = newLists.splice(source.index, 1);
        newLists.splice(destination.index, 0, movedList);

        // Update positions
        newLists.forEach((list, index) => {
          list.position = index;
        });

        newBoard.lists = newLists;
      } else {
        // Reorder cards
        const sourceListIndex = newBoard.lists.findIndex(
          (l: List) => l.id === source.droppableId
        );
        const destListIndex = newBoard.lists.findIndex(
          (l: List) => l.id === destination.droppableId
        );

        if (sourceListIndex === -1 || destListIndex === -1) return oldData;

        const newSourceCards = Array.from(newBoard.lists[sourceListIndex].cards || []);
        
        // Find the moved card
        const movedCardIndex = newSourceCards.findIndex(
          (c: CardType) => c.id === draggableId
        );
        
        if (movedCardIndex === -1) return oldData;
        
        const movedCard = { ...newSourceCards[movedCardIndex] };
        
        // Remove from source list
        newSourceCards.splice(movedCardIndex, 1);
        
        // Add to destination list (might be the same list)
        const newDestCards = 
          source.droppableId === destination.droppableId
            ? newSourceCards
            : Array.from(newBoard.lists[destListIndex].cards || []);

        // Update the list_id if moving between lists
        if (source.droppableId !== destination.droppableId) {
          movedCard.list_id = destination.droppableId;
        }
        
        // Insert at the new position
        newDestCards.splice(destination.index, 0, movedCard);
        
        // Update positions for all cards
        newDestCards.forEach((card: CardType, index: number) => {
          card.position = index;
        });
        
        // Update the lists in the board
        newBoard.lists[sourceListIndex].cards = 
          source.droppableId === destination.droppableId
            ? newDestCards
            : newSourceCards;
            
        if (source.droppableId !== destination.droppableId) {
          newBoard.lists[destListIndex].cards = newDestCards;
        }
      }

      return newBoard;
    });

    try {
      if (type === "LIST") {
        // Update lists positions in the database
        const updatedLists = board?.lists?.map((list, index) => ({
          id: list.id,
          position: index === source.index ? destination.index : 
                    index >= Math.min(source.index, destination.index) && 
                    index <= Math.max(source.index, destination.index) 
                    ? index < source.index ? index + 1 : index - 1 
                    : index
        }));

        if (updatedLists) {
          const { error } = await supabase.from("lists").upsert(
            updatedLists.map(list => ({
              id: list.id,
              position: list.position
            }))
          );

          if (error) throw error;
        }
      } else {
        // Update card positions and list_id in the database
        const card = board?.lists
          ?.find(list => list.id === source.droppableId)
          ?.cards?.find(card => card.id === draggableId);

        if (card) {
          const { error } = await supabase
            .from("cards")
            .update({ 
              list_id: destination.droppableId,
              position: destination.index 
            })
            .eq("id", draggableId);

          if (error) throw error;
        }

        // Update positions of other affected cards
        const sourceListCards = board?.lists
          ?.find(list => list.id === source.droppableId)
          ?.cards?.filter(card => card.id !== draggableId) || [];

        const destListCards = source.droppableId !== destination.droppableId
          ? board?.lists
              ?.find(list => list.id === destination.droppableId)
              ?.cards || []
          : sourceListCards;

        // Reorder source list cards
        sourceListCards.forEach((card, index) => {
          if (index >= source.index) {
            supabase
              .from("cards")
              .update({ position: index })
              .eq("id", card.id);
          }
        });

        // Reorder destination list cards
        if (source.droppableId !== destination.droppableId) {
          destListCards.forEach((card, index) => {
            if (index >= destination.index) {
              supabase
                .from("cards")
                .update({ position: index + 1 })
                .eq("id", card.id);
            }
          });
        }
      }

      // Refresh data after server update
      queryClient.invalidateQueries({ queryKey: ["board", id] });
    } catch (error: any) {
      console.error("Error updating positions:", error);
      toast({
        title: t("boards.error", "Erro"),
        description: error.message,
        variant: "destructive",
      });
      
      // Rollback by invalidating the query
      queryClient.invalidateQueries({ queryKey: ["board", id] });
    }
  };

  const handleCreateCard = (listId: string) => {
    setSelectedListId(listId);
    setCreateCardModalOpen(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6 p-4">
          <div className="h-8 w-1/3 bg-secondary/20 rounded-md"></div>
          <div className="flex space-x-4">
            <div className="h-[70vh] w-72 bg-secondary/20 rounded-md"></div>
            <div className="h-[70vh] w-72 bg-secondary/20 rounded-md"></div>
            <div className="h-[70vh] w-72 bg-secondary/20 rounded-md"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!board) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <h2 className="text-2xl font-bold">
            {t("boards.boardNotFound", "Quadro não encontrado")}
          </h2>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="mt-4"
          >
            {t("boards.goBack", "Voltar")}
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">{board.name}</h1>
            {board.description && (
              <p className="text-muted-foreground mt-1">{board.description}</p>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              {t("boards.share", "Compartilhar")}
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              {t("boards.settings", "Configurações")}
            </Button>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 pt-2 px-2 -mx-2 snap-x">
            {board.lists?.map((list, index) => (
              <BoardList
                key={list.id}
                index={index}
                list={list}
                onCreateCard={() => handleCreateCard(list.id)}
              />
            ))}
            <div className="min-w-[272px] w-[272px] shrink-0 rounded-lg border border-dashed border-secondary p-4 flex flex-col items-center justify-center">
              <Button variant="ghost" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                {t("boards.addList", "Adicionar lista")}
              </Button>
            </div>
          </div>
        </DragDropContext>

        {selectedListId && (
          <CreateCardModal
            open={createCardModalOpen}
            onOpenChange={setCreateCardModalOpen}
            listId={selectedListId}
            boardId={board.id}
          />
        )}
      </div>
    </Layout>
  );
};

export default BoardPage;
