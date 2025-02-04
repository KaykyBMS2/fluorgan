import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

interface ProfileSettingsProps {
  profile: any;
}

const DELETION_CONFIRMATION = `I understand that this action cannot be undone and I want to permanently delete my account and all associated data.`;

export function ProfileSettings({ profile }: ProfileSettingsProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const form = useForm();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [deletionText, setDeletionText] = useState("");

  const handleSubmit = async (data: any) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", user.id);

    if (error) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: t("success"),
        description: t("profileUpdated", "settings"),
      });
      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Sucesso",
        description: "Avatar atualizado com sucesso",
      });

      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o avatar",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (deletionText !== DELETION_CONFIRMATION) {
      toast({
        title: "Erro",
        description: "Por favor, digite o texto de confirmação exatamente como mostrado",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(user?.id as string);
      if (error) throw error;

      toast({
        title: "Conta deletada",
        description: "Sua conta foi permanentemente deletada",
      });
      navigate("/auth/login");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Não foi possível deletar sua conta",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("profile", "settings")}</CardTitle>
          <CardDescription>
            {t("updateProfile", "settings")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${profile.avatar_url}` : ''} />
                <AvatarFallback>
                  {profile?.first_name?.[0]}
                  {profile?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="avatar">Avatar</Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  defaultValue={profile?.first_name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("firstName", "settings")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  defaultValue={profile?.last_name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("lastName", "settings")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">{t("save")}</Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
          <CardDescription>
            Ações irreversíveis que afetam permanentemente sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Separator className="bg-destructive/20" />
            <div>
              <h3 className="text-lg font-semibold text-destructive mb-2">Deletar Conta</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Esta ação é permanente e não pode ser desfeita. Todos os seus dados serão permanentemente deletados.
              </p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="deletion-confirmation" className="text-sm text-muted-foreground">
                    Digite o texto abaixo para confirmar:
                  </Label>
                  <p className="text-sm font-mono bg-muted p-2 rounded my-2">
                    {DELETION_CONFIRMATION}
                  </p>
                  <Input
                    id="deletion-confirmation"
                    value={deletionText}
                    onChange={(e) => setDeletionText(e.target.value)}
                    className="w-full"
                    placeholder="Digite o texto de confirmação..."
                  />
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="w-full"
                  disabled={deletionText !== DELETION_CONFIRMATION}
                >
                  Deletar Conta Permanentemente
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}