import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Check } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const PricingCard = ({
  title,
  price,
  description,
  features,
  priceId,
  popular,
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  priceId?: string;
  popular?: boolean;
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para assinar um plano",
        variant: "destructive",
      });
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
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o checkout",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={`p-6 ${popular ? 'border-primary ring-2 ring-primary' : ''}`}>
      {popular && (
        <div className="absolute top-0 right-0 px-3 py-1 text-sm text-white transform translate-x-2 -translate-y-2 bg-primary rounded-full">
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
        onClick={priceId ? handleCheckout : undefined}
      >
        {price === "Grátis" ? "Começar Agora" : "Assinar Agora"}
      </Button>
    </Card>
  );
};

const Pricing = () => {
  const { t } = useLanguage();

  const plans = [
    {
      title: "Free",
      price: "Grátis",
      description: "Para usuários individuais e pequenos times",
      features: [
        "Até 10 projetos ativos",
        "3 membros por projeto",
        "100 tarefas no total",
        "Histórico de 30 dias",
        "Sistema de tasks básico",
        "Interface Kanban",
      ],
    },
    {
      title: "Pro",
      price: "$12",
      description: "Para times e usuários avançados",
      features: [
        "Projetos ilimitados",
        "10 membros por projeto",
        "5.000 tarefas ativas",
        "Histórico ilimitado",
        "Automação de workflows",
        "Relatórios detalhados",
      ],
      priceId: "price_1QnAFbAEwqbxqPckyuCd7ALL", // Substitua pelo seu Price ID do Stripe
      popular: true,
    },
    {
      title: "Enterprise",
      price: "$29",
      description: "Para empresas e grandes equipes",
      features: [
        "Projetos ilimitados",
        "Membros ilimitados",
        "Tarefas ilimitadas",
        "Suporte prioritário",
        "Permissões avançadas",
        "Integrações exclusivas",
      ],
      priceId: "price_1QnADtAEwqbxqPck5DKfLV3Y", // Substitua pelo seu Price ID do Stripe
    },
  ];

  return (
    <Layout>
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Planos e Preços</h1>
          <p className="text-xl text-gray-500">
            Escolha o plano perfeito para suas necessidades
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PricingCard key={plan.title} {...plan} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;
