import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getFreightsByUserId } from "@/utils/storage";
import { Freight } from "@/types";
import { ArrowLeft, Receipt, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/utils/formatters";

const SimpleFreightSelection: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedFreights, setSelectedFreights] = useState<Set<string>>(new Set());
  const [simpleFreights, setSimpleFreights] = useState<Freight[]>([]);

  const isSimpleFreight = (freight: Freight): boolean => {
    // Considera frete simples se tem valores de composição e campos básicos opcionais
    return freight.freightValue > 0 || 
           freight.dailyRate > 0 || 
           freight.otherCosts > 0 || 
           freight.tollCosts > 0 ||
           !freight.clientId || 
           freight.clientId === "unknown-client";
  };

  useEffect(() => {
    if (user) {
      const userFreights = getFreightsByUserId(user.id);
      const simple = userFreights.filter(isSimpleFreight);
      setSimpleFreights(simple);
    }
  }, [user]);

  const handleToggleFreight = (freightId: string) => {
    const newSelected = new Set(selectedFreights);
    if (newSelected.has(freightId)) {
      newSelected.delete(freightId);
    } else {
      newSelected.add(freightId);
    }
    setSelectedFreights(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedFreights.size === simpleFreights.length) {
      setSelectedFreights(new Set());
    } else {
      setSelectedFreights(new Set(simpleFreights.map(f => f.id)));
    }
  };

  const handleGenerateReceipt = () => {
    if (selectedFreights.size === 0) {
      toast({
        title: "Seleção necessária",
        description: "Selecione pelo menos um frete para gerar o recibo.",
        variant: "destructive"
      });
      return;
    }

    const ids = Array.from(selectedFreights).join(',');
    navigate(`/simple-freight-receipt?ids=${ids}`);
  };

  const selectedTotal = Array.from(selectedFreights)
    .map(id => simpleFreights.find(f => f.id === id))
    .filter(Boolean)
    .reduce((sum, freight) => sum + (freight?.totalValue || 0), 0);

  return (
    <Layout>
      <div className="container mx-auto py-6 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/freights')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Selecionar Fretes Simples</h1>
          </div>
        </div>

        {simpleFreights.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Nenhum frete simples encontrado</CardTitle>
              <CardDescription>
                Cadastre fretes simples para poder gerar recibos múltiplos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/freights')}>
                Voltar para Fretes
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={handleSelectAll}
                  className="gap-2"
                >
                  {selectedFreights.size === simpleFreights.length ? (
                    <>
                      <Minus className="h-4 w-4" />
                      Desmarcar Todos
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Selecionar Todos
                    </>
                  )}
                </Button>
                <div className="text-sm text-muted-foreground">
                  {selectedFreights.size} de {simpleFreights.length} selecionados
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {selectedFreights.size > 0 && (
                  <div className="text-lg font-bold">
                    Total: {formatCurrency(selectedTotal)}
                  </div>
                )}
                <Button 
                  onClick={handleGenerateReceipt}
                  disabled={selectedFreights.size === 0}
                  className="gap-2"
                >
                  <Receipt className="h-4 w-4" />
                  Gerar Recibo ({selectedFreights.size})
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {simpleFreights.map((freight) => (
                <Card 
                  key={freight.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedFreights.has(freight.id) 
                      ? 'bg-primary/5 border-primary' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleToggleFreight(freight.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox 
                        checked={selectedFreights.has(freight.id)}
                        onChange={() => handleToggleFreight(freight.id)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                          <div className="font-semibold">
                            {format(parseISO(freight.departureDate), "dd/MM/yyyy", { locale: ptBR })}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Data do Serviço
                          </div>
                        </div>
                        
                        <div>
                          <div className="font-medium">
                            {freight.requesterName || "Não informado"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Solicitante
                          </div>
                        </div>
                        
                        <div>
                          <div className="font-medium">
                            {freight.originCity || "N/A"} → {freight.destinationCity || "N/A"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Rota
                          </div>
                        </div>
                        
                        <div>
                          <div className="font-medium">
                            {freight.driverName || "N/A"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Motorista
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {formatCurrency(freight.totalValue)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Valor Total
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default SimpleFreightSelection;