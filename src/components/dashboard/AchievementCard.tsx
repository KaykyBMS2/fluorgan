
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface AchievementCardProps {
  level: number;
  experiencePoints: number;
}

export function AchievementCard({ level, experiencePoints }: AchievementCardProps) {
  const { t } = useLanguage();
  
  return (
    <Card className="p-6 bg-card hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{t("achievements")}</h3>
          <Button variant="outline" size="sm">
            {t("viewAll")}
          </Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Star className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Level {level}</p>
                <p className="text-sm text-muted-foreground">
                  {experiencePoints} XP
                </p>
              </div>
            </div>
            <Progress value={65} className="w-24 h-2" />
          </div>
        </div>
      </div>
    </Card>
  );
}
