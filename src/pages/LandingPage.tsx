import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Truck, 
  Building2, 
  TrendingUp, 
  Shield, 
  Clock, 
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  Package,
  Target,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";

const LandingPage = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] [mask-image:radial-gradient(white,transparent_85%)]" />
        
        <div className="container mx-auto px-4 pt-20 pb-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 backdrop-blur-sm border border-primary/20"
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Plataforma SaaS de Gestão de Fretes</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Conectando Empresas e Motoristas
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              A solução completa para gestão de fretes, marketplace de cargas e propostas em tempo real
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                onClick={() => navigate("/register/company")}
                className="group text-lg px-8 py-6 relative overflow-hidden"
              >
                <Building2 className="w-5 h-5 mr-2" />
                Sou Transportadora
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/register")}
                className="text-lg px-8 py-6"
              >
                <Truck className="w-5 h-5 mr-2" />
                Sou Motorista
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-sm text-muted-foreground"
            >
              Já tem uma conta?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-primary hover:underline font-medium"
              >
                Fazer login
              </button>
            </motion.p>
          </motion.div>
        </div>

        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/50 backdrop-blur-sm border-y">
        <div className="container mx-auto px-4">
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: 1250, label: "Empresas Ativas", suffix: "+" },
              { value: 8500, label: "Motoristas", suffix: "+" },
              { value: 45000, label: "Fretes Realizados", suffix: "+" },
              { value: 98, label: "Satisfação", suffix: "%" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  <CountUp end={stat.value} duration={2.5} separator="." />
                  {stat.suffix}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Como Funciona</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Uma plataforma completa para todos os envolvidos no processo logístico
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 mb-20">
            {/* Para Empresas */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 h-full border-2 hover:border-primary transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Para Transportadoras</h3>
                <ul className="space-y-4">
                  {[
                    "Gerencie todos os seus fretes em um só lugar",
                    "Publique cargas no marketplace",
                    "Receba propostas de motoristas qualificados",
                    "Controle completo de clientes e equipe",
                    "Relatórios e dashboards em tempo real",
                    "Gestão financeira integrada"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            {/* Para Motoristas */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 h-full border-2 hover:border-primary transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Truck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Para Motoristas</h3>
                <ul className="space-y-4">
                  {[
                    "Encontre cargas próximas à sua localização",
                    "Envie propostas para fretes do seu interesse",
                    "Receba notificações em tempo real",
                    "Acompanhe seus ganhos mensais",
                    "Histórico completo de viagens",
                    "Sistema de avaliações"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </div>

          {/* Benefits Cards */}
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Shield,
                title: "Segurança Total",
                description: "Dados criptografados e sistema de aprovação para empresas"
              },
              {
                icon: Clock,
                title: "Economia de Tempo",
                description: "Automatize processos e reduza trabalho manual"
              },
              {
                icon: TrendingUp,
                title: "Aumente Lucros",
                description: "Otimize rotas e reduza custos operacionais"
              }
            ].map((benefit, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Planos e Preços</h2>
            <p className="text-xl text-muted-foreground">
              Escolha o plano ideal para o seu negócio
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto"
          >
            {[
              {
                name: "Free",
                price: "0",
                period: "mês",
                features: [
                  "5 fretes por mês",
                  "1 usuário",
                  "Acesso básico ao marketplace",
                  "Suporte via email"
                ],
                cta: "Começar Grátis",
                popular: false
              },
              {
                name: "Basic",
                price: "99",
                period: "mês",
                features: [
                  "50 fretes por mês",
                  "3 usuários",
                  "Acesso completo ao marketplace",
                  "Relatórios básicos",
                  "Suporte prioritário"
                ],
                cta: "Iniciar Teste",
                popular: false
              },
              {
                name: "Pro",
                price: "299",
                period: "mês",
                features: [
                  "Fretes ilimitados",
                  "10 usuários",
                  "Marketplace premium",
                  "Relatórios avançados",
                  "API de integração",
                  "Suporte 24/7"
                ],
                cta: "Iniciar Teste",
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                features: [
                  "Tudo do Pro",
                  "Usuários ilimitados",
                  "White-label",
                  "Gerente de conta dedicado",
                  "SLA garantido",
                  "Treinamento personalizado"
                ],
                cta: "Falar com Vendas",
                popular: false
              }
            ].map((plan, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className={`p-6 h-full relative ${plan.popular ? 'border-2 border-primary shadow-xl' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                        Mais Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      {plan.price !== "Custom" && <span className="text-2xl font-bold">R$</span>}
                      <span className="text-5xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground">/{plan.period}</span>}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => navigate("/register/company")}
                  >
                    {plan.cta}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="p-12 text-center bg-gradient-to-br from-primary/10 via-accent/10 to-background border-2">
              <Target className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h2 className="text-4xl font-bold mb-4">
                Pronto para revolucionar sua logística?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Junte-se a milhares de empresas e motoristas que já transformaram seus negócios
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="text-lg px-8"
                  onClick={() => navigate("/register/company")}
                >
                  Começar Gratuitamente
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8"
                  onClick={() => navigate("/login")}
                >
                  Fazer Login
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold">FreteValor</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A plataforma completa para gestão de fretes e marketplace de cargas.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-primary">Preços</a></li>
                <li><a href="#" className="hover:text-primary">Marketplace</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Sobre</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
                <li><a href="#" className="hover:text-primary">Contato</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Privacidade</a></li>
                <li><a href="#" className="hover:text-primary">Termos</a></li>
                <li><a href="#" className="hover:text-primary">Segurança</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 FreteValor. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
