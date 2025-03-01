
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function BoardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate("/boards");
    } else {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to access boards",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, navigate, toast]);

  return null;
}
