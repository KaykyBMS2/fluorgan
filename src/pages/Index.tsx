import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTheme } from "@/lib/theme/ThemeContext";
import { 
  CheckCircle2, 
  ArrowRight, 
  PlayCircle,
  Zap,
  BarChart3,
  Users,
  Star,
  Check
} from "lucide-react";

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const features = [
    {
      icon: <CheckCircle2 className="w-12 h-12 text-primary mb-4" />,
      title: "Organização Intuitiva",
      description: "Interface simples e poderosa para gerenciar suas tarefas com eficiência"
    },
    {
      icon: <Zap className="w-12 h-12 text-primary mb-4" />,
      title: "Automação Inteligente",
      description: "Automatize seus fluxos de trabalho e aumente a produtividade da equipe"
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-primary mb-4" />,
      title: "Relatórios Avançados",
      description: "Métricas detalhadas para acompanhar o progresso e tomar decisões"
    }
  ];

  const testimonials = [
    {
      name: "João Silva",
      role: "Gerente de Projetos",
      company: "Tech Solutions",
      image: "/placeholder.svg",
      text: "O Fluorgan transformou completamente nossa gestão de projetos. A produtividade aumentou em 40%!"
    },
    {
      name: "Maria Santos",
      role: "CEO",
      company: "Inovação Digital",
      image: "/placeholder.svg",
      text: "Implementamos o Fluorgan há 6 meses e os resultados são impressionantes. Recomendo fortemente!"
    },
    {
      name: "Pedro Costa",
      role: "Tech Lead",
      company: "StartUp BR",
      image: "/placeholder.svg",
      text: "A melhor ferramenta de gestão de tarefas que já utilizei. Interface intuitiva e recursos poderosos."
    }
  ];

  const plans = [
    {
      name: "Free",
      price: "R$ 0",
      features: [
        "Até 10 projetos",
        "3 membros por projeto",
        "100 tarefas",
        "Suporte básico"
      ]
    },
    {
      name: "Pro",
      price: "R$ 49",
      popular: true,
      features: [
        "Projetos ilimitados",
        "10 membros por projeto",
        "Tarefas ilimitadas",
        "Automação avançada",
        "Suporte prioritário"
      ]
    },
    {
      name: "Enterprise",
      price: "Sob consulta",
      features: [
        "Tudo do Pro",
        "Membros ilimitados",
        "API dedicada",
        "Gerente de sucesso",
        "SLA garantido"
      ]
    }
  ];

  const faqs = [
    {
      question: "O Fluorgan é realmente grátis?",
      answer: "Sim! Oferecemos um plano gratuito com recursos essenciais para você começar. Faça upgrade apenas quando precisar de mais recursos."
    },
    {
      question: "Como funciona a automação?",
      answer: "Nossa automação permite criar regras personalizadas para mover tarefas automaticamente, enviar notificações e muito mais."
    },
    {
      question: "Posso cancelar a qualquer momento?",
      answer: "Sim, você pode cancelar sua assinatura quando quiser. Não há contratos longos ou taxas de cancelamento."
    }
  ];

  return (
    <div className="min-h-screen bg-background animate-in fade-in slide-in-from-bottom duration-500">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Gerencie suas tarefas com inteligência e produtividade
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Automação, colaboração e organização para equipes que querem resultados reais
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="text-lg group"
              onClick={() => navigate("/auth/signup")}
            >
              Experimente Grátis
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg"
              onClick={() => {}}
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Veja como funciona
            </Button>
          </div>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Users className="h-4 w-4" />
            Mais de 10.000 equipes já aumentaram sua produtividade com o Fluorgan
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  {feature.icon}
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Demo Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Conheça o Fluorgan em ação
          </h2>
          <Carousel className="max-w-4xl mx-auto">
            <CarouselContent>
              {[1, 2, 3].map((_, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Screenshot {index + 1}</span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            O que nossos usuários dizem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">{testimonial.text}</p>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Planos para cada necessidade
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`p-6 relative ${plan.popular ? 'border-primary ring-2 ring-primary' : ''}`}>
                {plan.popular && (
                  <span className="absolute -top-3 right-4 px-3 py-1 text-sm text-white bg-primary rounded-full">
                    Popular
                  </span>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-3xl font-bold mt-2">{plan.price}</p>
                  <p className="text-sm text-muted-foreground">por mês</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => navigate("/auth/signup")}
                >
                  Começar agora
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Perguntas Frequentes
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Junte-se às milhares de equipes que já estão transformando sua produtividade
          </h2>
          <Button 
            size="lg" 
            className="text-lg"
            onClick={() => navigate("/auth/signup")}
          >
            Comece grátis agora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4">Produto</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Recursos</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Preços</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Integrações</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Sobre</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Carreiras</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Suporte</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Ajuda</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Status</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacidade</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Termos</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Fluorgan. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;