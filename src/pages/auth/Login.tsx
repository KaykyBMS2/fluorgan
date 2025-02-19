import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Fluorgan</h1>
        <p className="text-gray-600">Organize suas tarefas como nunca antes</p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {t("loginTitle", "auth")}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {/* TODO: Implement Google login */}}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Entrar com Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                ou continue com email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder={t("email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder={t("password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="text-sm text-right">
              <Link 
                to="/auth/reset-password" 
                className="text-primary hover:underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>
            <Button type="submit" className="w-full h-11">
              {t("login")}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-sm text-center px-6 text-muted-foreground">
            {t("noAccount", "auth")}{" "}
            <Link 
              to="/auth/signup" 
              className="text-primary hover:underline font-medium"
            >
              {t("signup")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}