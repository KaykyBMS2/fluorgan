import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function usePremiumAccess() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const { data: premiumAccess, isLoading } = useQuery({
    queryKey: ["premiumAccess", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      const { data, error } = await supabase
        .rpc('has_premium_access', {
          user_uuid: user.id as string
        });

      if (error) {
        toast({
          title: t("error"),
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      return data || false;
    },
    enabled: !!user?.id,
  });

  return {
    hasPremiumAccess: premiumAccess || false,
    isLoading,
  };
}