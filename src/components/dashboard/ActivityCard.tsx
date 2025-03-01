
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Target } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function ActivityCard() {
  const { t } = useLanguage();
  
  return (
    <Card className="p-6 bg-card hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{t("recentActivity")}</h3>
          <Button variant="outline" size="sm">
            {t("viewAll")}
          </Button>
        </div>
        <div className="space-y-4">
          {/* Activity items */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Target className="h-4 w-4 text-secondary" />
              </div>
              <div>
                <p className="font-medium">{t("completedTask")}</p>
                <p className="text-sm text-muted-foreground">2 {t("hoursAgo")}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              {t("details")}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
