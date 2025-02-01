import { Layout } from "@/components/Layout";
import { PricingCard } from "@/components/pricing/PricingCard";

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
    price: "R$59",
    description: "Para times e usuários avançados",
    features: [
      "Projetos ilimitados",
      "10 membros por projeto",
      "5.000 tarefas ativas",
      "Histórico ilimitado",
      "Automação de workflows",
      "Relatórios detalhados",
    ],
    priceId: "price_1QnAFbAEwqbxqPckyuCd7ALL",
    popular: true,
  },
  {
    title: "Enterprise",
    price: "R$149",
    description: "Para empresas e grandes equipes",
    features: [
      "Projetos ilimitados",
      "Membros ilimitados",
      "Tarefas ilimitadas",
      "Suporte prioritário",
      "Permissões avançadas",
      "Integrações exclusivas",
    ],
    priceId: "price_1QnADtAEwqbxqPck5DKfLV3Y",
  },
];

const Pricing = () => {
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