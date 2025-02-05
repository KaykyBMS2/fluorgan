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
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password || !firstName || !lastName || !username) {
      toast({
        title: t("error", "common"),
        description: t("allFieldsRequired", "auth"),
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      await signUp(email, password, firstName, lastName, username);
    } catch (error: any) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Fluorgan</h1>
        <p className="text-muted-foreground">Organize suas tarefas como nunca antes</p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {t("signupTitle", "auth")}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full"
            disabled={isLoading}
            onClick={() => {/* TODO: Implement Google signup */}}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            {t("signupWithGoogle", "auth")}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("orContinueWith", "auth")}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder={t("firstName", "auth")}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoading}
                required
                className="h-11"
              />
              <Input
                placeholder={t("lastName", "auth")}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
                required
                className="h-11"
              />
            </div>
            <Input
              placeholder={t("username", "common")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              required
              className="h-11"
            />
            <Input
              type="email"
              placeholder={t("email", "common")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              className="h-11"
            />
            <Input
              type="password"
              placeholder={t("password", "common")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className="h-11"
            />
            <Button 
              type="submit" 
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading ? t("signingUp", "auth") : t("signup", "common")}
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
              {t("login", "common")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}