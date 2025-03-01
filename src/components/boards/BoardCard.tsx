
import { useNavigate } from "react-router-dom";
import { Calendar, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Board } from "@/types/board";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface BoardCardProps {
  board: Board;
}

export function BoardCard({ board }: BoardCardProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/boards/${board.id}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col">
      <div
        className="h-24 bg-primary/10 hover:bg-primary/20 transition-colors"
        onClick={handleClick}
      />

      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1" onClick={handleClick}>
            <h3 className="font-semibold text-lg line-clamp-1">{board.name}</h3>
            {board.description && (
              <p className="text-muted-foreground text-sm line-clamp-2">
                {board.description}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">
                  {t("boards.openMenu", "Abrir menu")}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleClick}>
                {t("boards.open", "Abrir")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t("boards.share", "Compartilhar")}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                {t("boards.archive", "Arquivar")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>

      <CardFooter className="py-2 text-xs text-muted-foreground mt-auto">
        <div className="flex items-center">
          <Calendar className="mr-1 h-3 w-3" />
          {format(new Date(board.created_at), "PP")}
        </div>
      </CardFooter>
    </Card>
  );
}
