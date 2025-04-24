import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";
import Logo from "@/components/Logo";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-freight-700 to-freight-900">
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between py-4 px-4 sm:px-6">
          <Logo variant="full" size="md" className="text-white" />
          <div className="flex items-center gap-2 sm:gap-4">
            <Button 
              variant="secondary"
              className="text-freight-800 bg-white/90 hover:bg-white dark:text-white dark:bg-white/10 dark:hover:bg-white/20 px-3 sm:px-4"
              onClick={() => navigate("/login")}
            >
              Entrar
            </Button>
            <Button 
              variant="default"
              className="bg-freight-600 hover:bg-freight-500 text-white px-3 sm:px-4"
              onClick={() => navigate("/register")}
            >
              Cadastrar
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Truck className="h-16 w-16 sm:h-20 sm:w-20 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white">Frete Pro</h1>
          <p className="text-lg sm:text-xl mb-8 text-white/90">
            A solução completa para gerenciamento de fretes e transportes
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-8 rounded-lg mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Gerencie seus fretes com facilidade</h2>
            <ul className="grid sm:grid-cols-2 gap-4 text-left mb-6 text-white/90">
              <li className="flex items-start">
                <span className="bg-freight-500 p-1 rounded-full mr-2 mt-1">✓</span>
                <span>Cadastre e acompanhe todos os seus fretes</span>
              </li>
              <li className="flex items-start">
                <span className="bg-freight-500 p-1 rounded-full mr-2 mt-1">✓</span>
                <span>Gerencie clientes e motoristas</span>
              </li>
              <li className="flex items-start">
                <span className="bg-freight-500 p-1 rounded-full mr-2 mt-1">✓</span>
                <span>Controle de custos e pagamentos</span>
              </li>
              <li className="flex items-start">
                <span className="bg-freight-500 p-1 rounded-full mr-2 mt-1">✓</span>
                <span>Gere recibos e comprovantes</span>
              </li>
            </ul>
            
            <Button 
              size="lg"
              className="w-full sm:w-auto bg-freight-500 hover:bg-freight-400 text-white font-semibold px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg"
              onClick={() => navigate("/login")}
            >
              Experimente Agora
            </Button>
            
            <p className="mt-4 text-sm text-white/80">
              Acesso rápido e simplificado. Sem necessidade de cartão de crédito.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <div className="bg-white/5 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Simplicidade</h3>
              <p>Interface intuitiva para agilizar seu trabalho diário</p>
            </div>
            <div className="bg-white/5 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Eficiência</h3>
              <p>Otimize suas operações e reduza o tempo administrativo</p>
            </div>
            <div className="bg-white/5 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Mobilidade</h3>
              <p>Acesse suas informações em qualquer dispositivo</p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="py-4 text-center text-white/60">
        <p>© 2025 Frete Pro - Todos os direitos reservados</p>
      </footer>
    </div>
  );
};

export default Index;
