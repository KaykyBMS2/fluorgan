
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CreateBoardModal } from "@/components/boards/CreateBoardModal";
import { BoardCard } from "@/components/boards/BoardCard";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Board } from "@/types/board";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Boards = () => {
  const { t } = useLanguage();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: boards, isLoading } = useQuery({
    queryKey: ["boards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("boards")
        .select("*")
        .eq("is_archived", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Board[];
    },
  });

  const filteredBoards = boards?.filter((board) =>
    board.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentBoards = [...(filteredBoards || [])].slice(0, 5);

  return (
    <Layout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              {t("boards.title", "Quadros")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("boards.subtitle", "Gerencie seus projetos com quadros Kanban")}
            </p>
          </div>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("boards.createBoard", "Criar quadro")}
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("boards.searchPlaceholder", "Pesquisar quadros...")}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">{t("boards.allBoards", "Todos os quadros")}</TabsTrigger>
            <TabsTrigger value="recent">{t("boards.recentBoards", "Recentes")}</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-48 rounded-xl bg-secondary/20 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredBoards && filteredBoards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBoards.map((board) => (
                  <BoardCard key={board.id} board={board} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">
                  {searchQuery
                    ? t("boards.noSearchResults", "Nenhum quadro encontrado")
                    : t("boards.noBoards", "Você ainda não tem quadros")}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery
                    ? t("boards.tryDifferentSearch", "Tente uma pesquisa diferente")
                    : t("boards.createYourFirstBoard", "Crie seu primeiro quadro para começar")}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => setCreateModalOpen(true)}
                    className="mt-4"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {t("boards.createBoard", "Criar quadro")}
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
          <TabsContent value="recent" className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-48 rounded-xl bg-secondary/20 animate-pulse"
                  />
                ))}
              </div>
            ) : recentBoards && recentBoards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentBoards.map((board) => (
                  <BoardCard key={board.id} board={board} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">
                  {t("boards.noRecentBoards", "Nenhum quadro recente")}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {t("boards.createYourFirstBoard", "Crie seu primeiro quadro para começar")}
                </p>
                <Button
                  onClick={() => setCreateModalOpen(true)}
                  className="mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t("boards.createBoard", "Criar quadro")}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <CreateBoardModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
        />
      </div>
    </Layout>
  );
};

export default Boards;
