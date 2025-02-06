import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/theme/ThemeContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Flag, Globe, Moon, Sun } from "lucide-react";

export function PreferenceSettings() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const languages = [
    { value: "en", label: "English", flag: "🇺🇸" },
    { value: "pt", label: "Português", flag: "🇧🇷" },
    { value: "es", label: "Español", flag: "🇪🇸" },
  ];

  const themes = [
    { value: "light", label: t("light", "settings"), icon: Sun },
    { value: "dark", label: t("dark", "settings"), icon: Moon },
    { value: "system", label: t("system", "settings"), icon: Globe },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("language", "settings")}</CardTitle>
          <CardDescription>
            {t("chooseLanguage", "settings")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem
                  key={lang.value}
                  value={lang.value}
                  className="flex items-center gap-2"
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span>{lang.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("theme", "settings")}</CardTitle>
          <CardDescription>
            {t("chooseTheme", "settings")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {themes.map((themeOption) => (
                <SelectItem
                  key={themeOption.value}
                  value={themeOption.value}
                  className="flex items-center gap-2"
                >
                  <themeOption.icon className="h-4 w-4" />
                  <span>{themeOption.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
}