
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const QuotationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulação de carregamento de cotações
  useEffect(() => {
    // Aqui seria a lógica para carregar cotações do armazenamento
    // Por enquanto, vamos mostrar uma cotação de exemplo
    setTimeout(() => {
      setQuotations([
        {
          id: "example-1",
          clientName: "Cliente Exemplo",
          origin: "São Paulo, SP",
          destination: "Rio de Janeiro, RJ",
          date: new Date().toLocaleDateString(),
          value: "R$ 1.250,00"
        }
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleNewQuotation = () => {
    navigate("/quotation");
  };

  const handleViewQuotation = (quotation: any) => {
    // Passa os dados da cotação para a visualização
    navigate("/quotation/view", { state: { quotation } });
  };

  return (
    <Layout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Cotações</h1>
          <Button onClick={handleNewQuotation} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Nova Cotação
          </Button>
        </div>

        <div className="bg-background rounded-lg p-4 shadow">
          {isLoading ? (
            <p className="text-center text-gray-500 py-8">Carregando cotações...</p>
          ) : quotations.length > 0 ? (
            <div className="grid gap-4">
              {quotations.map((quotation) => (
                <Card key={quotation.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{quotation.clientName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {quotation.origin} → {quotation.destination}
                        </p>
                        <p className="text-sm">{quotation.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{quotation.value}</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => handleViewQuotation(quotation)}
                        >
                          <FileText className="h-4 w-4 mr-1" /> Visualizar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Ainda não há cotações salvas.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default QuotationsPage;
