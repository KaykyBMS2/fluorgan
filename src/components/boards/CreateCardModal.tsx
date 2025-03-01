
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { Calendar as CalendarIcon, User2 } from "lucide-react";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
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
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { Profile } from "@/types/profile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listId: string;
  boardId: string;
}

interface CardFormValues {
  title: string;
  description: string;
  assignedTo: string;
}

export function CreateCardModal({
  open,
  onOpenChange,
  listId,
  boardId,
}: CreateCardModalProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date | undefined>(undefined);

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*");

      if (error) throw error;
      return data as Profile[];
    },
  });

  const form = useForm<CardFormValues>({
    defaultValues: {
      title: "",
      description: "",
      assignedTo: "",
    },
  });

  const onSubmit = async (values: CardFormValues) => {
    if (!user) return;

    try {
      // Get the current highest position in the list
      const { data: cardsData, error: cardsError } = await supabase
        .from("cards")
        .select("position")
        .eq("list_id", listId)
        .order("position", { ascending: false })
        .limit(1);

      if (cardsError) throw cardsError;

      const position = cardsData && cardsData.length > 0 ? cardsData[0].position + 1 : 0;

      // Insert the card
      const { error: cardError } = await supabase.from("cards").insert({
        title: values.title,
        description: values.description,
        list_id: listId,
        created_by: user.id,
        position,
        due_date: date ? date.toISOString() : null,
        assigned_to: values.assignedTo || null,
      });

      if (cardError) throw cardError;

      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
      toast({
        title: t("boards.cardCreated", "Cartão criado"),
        description: t(
          "boards.cardCreatedDesc",
          "Seu cartão foi criado com sucesso"
        ),
      });

      form.reset();
      setDate(undefined);
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error creating card:", error);
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
          <DialogTitle>{t("boards.createCard", "Criar novo cartão")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("boards.cardTitle", "Título")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("boards.cardTitlePlaceholder", "Digite o título do cartão")}
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
                      placeholder={t("boards.descriptionPlaceholder", "Adicione detalhes sobre este cartão")}
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>{t("boards.dueDate", "Data de vencimento")}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "PPP")
                      ) : (
                        <span>{t("boards.selectDate", "Selecionar data")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>

              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("boards.assignTo", "Atribuir a")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("boards.selectMember", "Selecionar membro")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">
                          {t("boards.none", "Ninguém")}
                        </SelectItem>
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center">
                              <User2 className="h-4 w-4 mr-2 text-muted-foreground" />
                              {user.first_name && user.last_name
                                ? `${user.first_name} ${user.last_name}`
                                : user.username || user.email}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t("cancel", "Cancelar")}
              </Button>
              <Button type="submit">
                {t("boards.createCardButton", "Criar cartão")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
