import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";
import Logo from "@/components/Logo";
const Index = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen flex flex-col bg-gradient-to-b from-freight-50 to-freight-100 dark:from-freight-900 dark:to-freight-950">
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-sm border-b border-freight-200/20 dark:border-freight-800/20 safe-top">
        <div className="container mx-auto flex items-center justify-between py-4 px-4 sm:px-6">
          <div className="flex items-center">
            <Logo size="lg" />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" onClick={() => navigate("/login")} className="text-freight-700 hover:text-freight-800 bg-white/80 hover:bg-white dark:text-freight-300 dark:bg-white/5 dark:hover:bg-white/10 sm:px-4 mx-[4px] px-[6px]">
              Entrar
            </Button>
            <Button variant="default" onClick={() => navigate("/register")} className="bg-freight-600 hover:bg-freight-500 text-white sm:px-4 px-0">
              Cadastrar
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto pb-safe">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Logo size="lg" variant="icon" className="h-28 w-28 sm:h-40 sm:w-40 mb-4" />
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-freight-800 dark:text-freight-200">FreteValor</h1>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-freight-600 dark:text-freight-400">
            A solução completa para gerenciamento de fretes e transportes
          </p>
          
          <div className="bg-white/40 dark:bg-freight-900/40 backdrop-blur-sm p-4 sm:p-8 rounded-lg mb-6 sm:mb-10 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-freight-700 dark:text-freight-300">
              Gerencie seus fretes com facilidade
            </h2>
            <ul className="grid sm:grid-cols-2 gap-4 text-left mb-6">
              {["Cadastre e acompanhe todos os seus fretes", "Gerencie clientes e motoristas", "Controle de custos e pagamentos", "Gere recibos e comprovantes"].map((item, index) => <li key={index} className="flex items-start">
                  <span className="bg-freight-500 dark:bg-freight-600 p-1 rounded-full mr-2 mt-1 text-white">✓</span>
                  <span className="text-freight-700 dark:text-freight-300">{item}</span>
                </li>)}
            </ul>
            
            <Button size="lg" className="w-full sm:w-auto bg-freight-600 hover:bg-freight-500 text-white font-semibold px-6 sm:px-8 py-3 sm:py-6 text-base sm:text-lg" onClick={() => navigate("/login")}>
              Experimente Agora
            </Button>
            
            <p className="mt-4 text-sm text-freight-600/80 dark:text-freight-400/80">
              Acesso rápido e simplificado. Sem necessidade de cartão de crédito.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <div className="bg-white/30 dark:bg-freight-900/30 p-4 sm:p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-freight-700 dark:text-freight-300">Simplicidade</h3>
              <p className="text-freight-600 dark:text-freight-400">Interface intuitiva para agilizar seu trabalho diário</p>
            </div>
            <div className="bg-white/30 dark:bg-freight-900/30 p-4 sm:p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-freight-700 dark:text-freight-300">Eficiência</h3>
              <p className="text-freight-600 dark:text-freight-400">Otimize suas operações e reduza o tempo administrativo</p>
            </div>
            <div className="bg-white/30 dark:bg-freight-900/30 p-4 sm:p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-freight-700 dark:text-freight-300">Mobilidade</h3>
              <p className="text-freight-600 dark:text-freight-400">Acesse suas informações em qualquer dispositivo</p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="py-4 text-center text-freight-600/60 dark:text-freight-400/60 bg-white/5 safe-bottom">
        <p>© 2024 FreteValor - Todos os direitos reservados</p>
      </footer>
    </div>;
};
export default Index;