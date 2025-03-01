import { createContext, useContext, useState, useEffect } from "react";
import { translations, Language } from "./translations";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string, section?: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const { toast } = useToast();

  useEffect(() => {
    const loadUserLanguage = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        try {
          const { data: profile, error: fetchError } = await supabase
            .from("profiles")
            .select("language")
            .eq("id", session.user.id)
            .maybeSingle();

          if (fetchError) {
            console.error("Error fetching profile:", fetchError);
            return;
          }

          if (profile?.language) {
            setLanguageState(profile.language as Language);
            return;
          }

          if (!profile) {
            const { error: insertError } = await supabase
              .from("profiles")
              .insert([{ 
                id: session.user.id,
                language: "en"
              }]);

            if (insertError) {
              console.error("Error creating profile:", insertError);
              toast({
                title: "Error",
                description: "Failed to create user profile",
                variant: "destructive",
              });
            }
          }
        } catch (error) {
          console.error("Error in loadUserLanguage:", error);
        }
      }
    };

    loadUserLanguage();
  }, [toast]);

  const setLanguage = async (newLanguage: Language) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      try {
        const { error } = await supabase
          .from("profiles")
          .upsert({ 
            id: session.user.id,
            language: newLanguage
          });

        if (error) {
          toast({
            title: "Error",
            description: "Failed to update language preference",
            variant: "destructive",
          });
          return;
        }

        setLanguageState(newLanguage);
      } catch (error) {
        console.error("Error updating language:", error);
        toast({
          title: "Error",
          description: "Failed to update language preference",
          variant: "destructive",
        });
      }
    }
  };

  const t = (key: string, section: string = "common"): string => {
    try {
      const sectionData = translations[language][section as keyof typeof translations.en];
      if (typeof sectionData === "object" && sectionData !== null) {
        const value = sectionData[key as keyof typeof sectionData];
        if (typeof value === "string") {
          return value;
        }
        console.error(`Translation for ${section}.${key} is not a string`);
        return key;
      }
      console.error(`Section ${section} not found in translations`);
      return key;
    } catch (error) {
      console.error(`Translation missing: ${section}.${key}`);
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
