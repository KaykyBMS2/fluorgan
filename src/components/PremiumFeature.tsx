import { ReactNode } from "react";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Lock } from "lucide-react";
import { Link } from "react-router-dom";

interface PremiumFeatureProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function PremiumFeature({ children, fallback }: PremiumFeatureProps) {
  const { hasPremiumAccess, isLoading } = usePremiumAccess();
  const { t } = useLanguage();

  if (isLoading) {
    return null;
  }

  if (hasPremiumAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Card className="p-6 text-center space-y-4">
      <div className="flex justify-center">
        <div className="p-3 bg-primary-50 rounded-full">
          <Lock className="h-6 w-6 text-primary-500" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold">{t("premiumFeature")}</h3>
        <p className="text-sm text-gray-500">
          {t("premiumFeatureDescription")}
        </p>
      </div>
      <Button asChild>
        <Link to="/settings/subscription">
          <Crown className="mr-2 h-4 w-4" />
          {t("upgradeToPremium")}
        </Link>
      </Button>
    </Card>
  );
}