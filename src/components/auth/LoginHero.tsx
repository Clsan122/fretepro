
import React from "react";
import { Truck, FileText, Package, Route } from "lucide-react";

export const LoginHero = () => {
  return (
    <div className="flex-1 hidden lg:flex flex-col justify-center p-10 bg-freight-600 text-white">
      <div className="max-w-lg">
        <img 
          src="/lovable-uploads/7a2e868d-b2ae-4a11-925f-49bcc1560c2a.png" 
          alt="FreteValor Logo" 
          className="h-20 mb-8"
        />
        <h1 className="text-4xl font-bold mb-6">FreteValor</h1>
        <p className="text-xl mb-6">Cadastre e acompanhe seus fretes e tenha um relatório completo de todos os seus rendimentos.</p>
        
        <div className="space-y-6 mt-10">
          <FeatureItem 
            icon={<Truck className="h-6 w-6" />} 
            title="Gestão de Fretes" 
            description="Cadastre e acompanhe todos os seus fretes em um só lugar"
          />
          
          <FeatureItem 
            icon={<FileText className="h-6 w-6" />} 
            title="Ordens de Coleta" 
            description="Gere e compartilhe ordens de coleta profissionais"
          />
          
          <FeatureItem 
            icon={<Package className="h-6 w-6" />} 
            title="Recibos de Frete" 
            description="Emita recibos personalizados para seus clientes"
          />
          
          <FeatureItem 
            icon={<Route className="h-6 w-6" />} 
            title="Rotas e Destinos" 
            description="Organize suas rotas e destinos de forma eficiente"
          />
        </div>
      </div>
    </div>
  );
};

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="bg-white/20 p-3 rounded-full">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-freight-100">{description}</p>
      </div>
    </div>
  );
};
