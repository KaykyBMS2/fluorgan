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

export function PreferenceSettings() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("language", "settings")}</CardTitle>
          <CardDescription>
            {t("chooseLanguage", "settings")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="pt-BR">Português</SelectItem>
              <SelectItem value="es">Español</SelectItem>
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
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Claro</SelectItem>
              <SelectItem value="dark">Escuro</SelectItem>
              <SelectItem value="system">Sistema</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </>
  );
}