import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart2,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export const Dashboard = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("dashboard")}</h1>
        <p className="text-gray-500 mt-2">
          {t("welcome", "common")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Clock className="h-6 w-6 text-primary-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("pending", "tasks")}</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-secondary-50 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-secondary-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("completed", "tasks")}</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("overdue", "tasks")}</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <BarChart2 className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("productivity", "tasks")}</p>
              <p className="text-2xl font-bold text-gray-900">0%</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};