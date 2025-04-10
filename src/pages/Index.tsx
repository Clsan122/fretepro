
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-freight-700 to-freight-900 text-white p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <Truck className="h-20 w-20" />
        </div>
        <h1 className="text-5xl font-bold mb-4">Frete Pro</h1>
        <p className="text-xl mb-8">
          A solução completa para gerenciamento de fretes e transportes
        </p>
        
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-semibold mb-4">Gerencie seus fretes com facilidade</h2>
          <ul className="grid md:grid-cols-2 gap-4 text-left mb-6">
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
            className="bg-freight-500 hover:bg-freight-400 text-white font-semibold px-8 py-6 text-lg"
            onClick={() => navigate("/login")}
          >
            Experimente Agora
          </Button>
          
          <p className="mt-4 text-sm text-white/80">
            Acesso rápido e simplificado. Sem necessidade de cartão de crédito.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
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
      
      <footer className="mt-auto py-4 text-center text-white/60 w-full">
        <p>© 2025 Frete Pro - Todos os direitos reservados</p>
      </footer>
    </div>
  );
};

export default Index;
