import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@/hooks/use-toast";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const { signUp } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!email || !password || !firstName || !lastName || !username) {
        toast({
          title: t("error"),
          description: t("allFieldsRequired", "auth"),
          variant: "destructive",
        });
        return;
      }
      await signUp(email, password, firstName, lastName, username);
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Fluorgan</h1>
        <p className="text-muted-foreground">Organize suas tarefas como nunca antes</p>
      </div>
      
      <Card className="w-full max-w-md bg-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-foreground">
            {t("signupTitle", "auth")}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {/* TODO: Implement Google signup */}}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Cadastrar com Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                ou continue com email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder={t("firstName", "auth")}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="h-11 bg-background text-foreground"
              />
              <Input
                placeholder={t("lastName", "auth")}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="h-11 bg-background text-foreground"
              />
            </div>
            <Input
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="h-11 bg-background text-foreground"
            />
            <Input
              type="email"
              placeholder={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 bg-background text-foreground"
            />
            <Input
              type="password"
              placeholder={t("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 bg-background text-foreground"
            />
            <Button type="submit" className="w-full h-11">
              {t("signup")}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-sm text-center px-6 text-muted-foreground">
            {t("hasAccount", "auth")}{" "}
            <Link 
              to="/auth/login" 
              className="text-primary hover:underline font-medium"
            >
              {t("login")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}