import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para acessar esta página",
        variant: "destructive",
      });
      navigate("/auth/login");
    }
  }, [user, loading, navigate, toast]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return user ? <>{children}</> : null;
};