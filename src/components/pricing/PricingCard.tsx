import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  priceId?: string;
  popular?: boolean;
}

export const PricingCard = ({
  title,
  price,
  description,
  features,
  priceId,
  popular,
}: PricingCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para assinar um plano",
      });
      navigate("/auth/login?redirect=/pricing");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o checkout",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={`p-6 relative ${popular ? 'border-primary ring-2 ring-primary' : ''}`}>
      {popular && (
        <div className="absolute -top-3 right-4 px-3 py-1 text-sm text-white bg-primary rounded-full">
          Popular
        </div>
      )}
      <div className="mb-4">
        <h3 className="text-2xl font-bold">{title}</h3>
        <div className="mt-2">
          <span className="text-3xl font-bold">{price}</span>
          {price !== "Grátis" && <span className="text-gray-500">/mês</span>}
        </div>
        <p className="mt-2 text-gray-500">{description}</p>
      </div>
      <ul className="mb-6 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="w-5 h-5 mr-2 text-green-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button 
        className="w-full" 
        variant={popular ? "default" : "outline"}
        onClick={priceId ? handleSubscribe : undefined}
      >
        {price === "Grátis" ? "Começar Agora" : "Assinar Agora"}
      </Button>
    </Card>
  );
};