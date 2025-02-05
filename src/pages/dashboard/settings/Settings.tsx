import { useAuth } from "@/lib/auth/AuthContext";
import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { PreferenceSettings } from "@/components/settings/PreferenceSettings";

const Settings = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <ProfileSettings profile={profile} />
        <PreferenceSettings />
      </div>
    </Layout>
  );
};

export default Settings;