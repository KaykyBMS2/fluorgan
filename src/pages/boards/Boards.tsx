
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PlusCircle } from "lucide-react";
import { CreateBoardModal } from "@/components/boards/CreateBoardModal";
import { BoardCard } from "@/components/boards/BoardCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Board } from "@/types/board";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Boards() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const { data: boards, isLoading } = useQuery({
    queryKey: ["boards"],
    queryFn: async () => {
      if (!user) {
        toast({
          title: t("common.error", "Error"),
          description: t("boards.mustBeLoggedIn", "You must be logged in to view boards"),
          variant: "destructive",
        });
        return [];
      }

      console.log("Fetching boards for user:", user.id);
      
      const { data, error } = await supabase
        .from("boards")
        .select("*")
        .eq("created_by", user.id)
        .eq("is_archived", false)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching boards:", error);
        toast({
          title: t("common.error", "Error"),
          description: t("boards.fetchError", "Failed to load boards: ") + error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      console.log("Boards data:", data);
      return data as Board[];
    },
    enabled: !!user,
  });

  return (
    <Layout>
      <div className="container py-6 space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("boards.boards", "Quadros")}
          </h1>
          <Button onClick={() => setCreateModalOpen(true)} className="bg-[#0249FF] hover:bg-blue-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            {t("boards.createNew", "Criar novo quadro")}
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[200px] bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : boards && boards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {boards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">
              {t("boards.noBoards", "Nenhum quadro encontrado")}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t(
                "boards.noBoardsDesc",
                "Crie um novo quadro para começar a organizar suas tarefas"
              )}
            </p>
            <Button onClick={() => setCreateModalOpen(true)} className="bg-[#0249FF] hover:bg-blue-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              {t("boards.createFirst", "Criar seu primeiro quadro")}
            </Button>
          </div>
        )}
      </div>

      <CreateBoardModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </Layout>
  );
}
