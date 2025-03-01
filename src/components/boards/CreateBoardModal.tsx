
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth/AuthContext";

interface CreateBoardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ListInput {
  id: string;
  name: string;
}

interface BoardFormValues {
  name: string;
  description: string;
}

export function CreateBoardModal({ open, onOpenChange }: CreateBoardModalProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [lists, setLists] = useState<ListInput[]>([
    { id: uuidv4(), name: t("boards.todo", "A Fazer") },
    { id: uuidv4(), name: t("boards.inProgress", "Em Progresso") },
    { id: uuidv4(), name: t("boards.done", "Concluído") },
  ]);

  const form = useForm<BoardFormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleAddList = () => {
    setLists([...lists, { id: uuidv4(), name: "" }]);
  };

  const handleRemoveList = (id: string) => {
    if (lists.length <= 1) {
      toast({
        title: t("boards.atLeastOneList", "Erro"),
        description: t("boards.needOneList", "Você precisa ter pelo menos uma lista"),
        variant: "destructive",
      });
      return;
    }
    setLists(lists.filter((list) => list.id !== id));
  };

  const handleListNameChange = (id: string, name: string) => {
    setLists(
      lists.map((list) => (list.id === id ? { ...list, name } : list))
    );
  };

  const onSubmit = async (values: BoardFormValues) => {
    if (!user) return;

    try {
      // Check if any list is empty
      const emptyList = lists.find((list) => !list.name.trim());
      if (emptyList) {
        toast({
          title: t("boards.emptyList", "Lista vazia"),
          description: t("boards.fillAllLists", "Preencha o nome de todas as listas"),
          variant: "destructive",
        });
        return;
      }

      // Insert the board
      const { data: boardData, error: boardError } = await supabase
        .from("boards")
        .insert({
          name: values.name,
          description: values.description,
          created_by: user.id,
        })
        .select();

      if (boardError) throw boardError;
      if (!boardData || boardData.length === 0) {
        throw new Error("Failed to create board");
      }

      const boardId = boardData[0].id;

      // Insert all lists
      const listsToInsert = lists.map((list, index) => ({
        name: list.name,
        position: index,
        board_id: boardId,
        created_by: user.id,
      }));

      const { error: listsError } = await supabase
        .from("lists")
        .insert(listsToInsert);

      if (listsError) throw listsError;

      // Success
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      toast({
        title: t("boards.boardCreated", "Quadro criado"),
        description: t("boards.boardCreatedDesc", "Seu quadro foi criado com sucesso"),
      });
      
      onOpenChange(false);
      form.reset();
      setLists([
        { id: uuidv4(), name: t("boards.todo", "A Fazer") },
        { id: uuidv4(), name: t("boards.inProgress", "Em Progresso") },
        { id: uuidv4(), name: t("boards.done", "Concluído") },
      ]);
    } catch (error: any) {
      console.error("Error creating board:", error);
      toast({
        title: t("boards.error", "Erro"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("boards.createBoard", "Criar novo quadro")}</DialogTitle>
          <DialogDescription>
            {t("boards.createBoardDesc", "Crie um novo quadro para gerenciar seus projetos")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("boards.boardName", "Nome do quadro")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("boards.boardNamePlaceholder", "Ex: Projeto Website")}
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("boards.description", "Descrição")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("boards.descriptionPlaceholder", "Descreva o propósito deste quadro")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">
                  {t("boards.lists", "Listas")}
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddList}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {t("boards.addList", "Adicionar lista")}
                </Button>
              </div>

              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                {lists.map((list) => (
                  <div
                    key={list.id}
                    className="flex items-center space-x-2 bg-secondary/20 p-2 rounded-md"
                  >
                    <Input
                      value={list.name}
                      onChange={(e) =>
                        handleListNameChange(list.id, e.target.value)
                      }
                      placeholder={t("boards.listName", "Nome da lista")}
                      className="flex-1"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveList(list.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t("cancel", "Cancelar")}
              </Button>
              <Button type="submit">
                {t("boards.createBoardButton", "Criar quadro")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
