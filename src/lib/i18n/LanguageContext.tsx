import { createContext, useContext, useState, useEffect } from "react";
import { translations, Language } from "./translations";
import { supabase } from "@/integrations/supabase/client";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string, section?: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const loadUserLanguage = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("language")
          .eq("id", session.user.id)
          .single();
        
        if (profile?.language) {
          setLanguageState(profile.language as Language);
        }
      }
    };

    loadUserLanguage();
  }, []);

  const setLanguage = async (newLanguage: Language) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase
        .from("profiles")
        .update({ language: newLanguage })
        .eq("id", session.user.id);
    }
    setLanguageState(newLanguage);
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