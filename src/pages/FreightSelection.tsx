
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { getFreightsByUserId, getClientById } from "@/utils/storage";
import { Freight, Client } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { ArrowLeft, FileText } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

const FreightSelection: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [freights, setFreights] = useState<Freight[]>([]);
  const [selectedFreights, setSelectedFreights] = useState<string[]>([]);
  const [clientsMap, setClientsMap] = useState<Record<string, Client>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      const userFreights = getFreightsByUserId(user.id);
      
      // Create clients map for faster lookup
      const clients: Record<string, Client> = {};
      userFreights.forEach(freight => {
        if (freight.clientId && !clients[freight.clientId]) {
          const client = getClientById(freight.clientId);
          if (client) {
            clients[freight.clientId] = client;
          }
        }
      });
      
      setClientsMap(clients);
      setFreights(userFreights);
      setLoading(false);
    }
  }, [user]);

  const handleCheckboxChange = (freightId: string) => {
    setSelectedFreights(prev => {
      if (prev.includes(freightId)) {
        return prev.filter(id => id !== freightId);
      } else {
        return [...prev, freightId];
      }
    });
  };

  const handleSelectByClient = (clientId: string) => {
    const clientFreights = freights
      .filter(freight => freight.clientId === clientId)
      .map(freight => freight.id);
    
    // Check if all client freights are already selected
    const allSelected = clientFreights.every(id => selectedFreights.includes(id));
    
    if (allSelected) {
      // If all are selected, unselect them
      setSelectedFreights(prev => prev.filter(id => !clientFreights.includes(id)));
    } else {
      // Add any unselected freights
      setSelectedFreights(prev => {
        const newSelection = [...prev];
        clientFreights.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  const handleSelectAll = () => {
    if (selectedFreights.length === freights.length) {
      // If all are selected, unselect all
      setSelectedFreights([]);
    } else {
      // Select all
      setSelectedFreights(freights.map(freight => freight.id));
    }
  };

  const handleGenerateMultipleReceipt = () => {
    if (selectedFreights.length === 0) {
      toast({
        title: "Nenhum frete selecionado",
        description: "Selecione pelo menos um frete para gerar o recibo múltiplo.",
        variant: "destructive"
      });
      return;
    }

    // Navigate to the multiple receipt page with the selected freight IDs
    navigate(`/multi-freight/receipt?ids=${selectedFreights.join(',')}`);
  };

  // Group freights by client for better organization
  const freightsByClient: Record<string, Freight[]> = {};
  freights.forEach(freight => {
    const clientId = freight.clientId;
    if (!freightsByClient[clientId]) {
      freightsByClient[clientId] = [];
    }
    freightsByClient[clientId].push(freight);
  });

  return (
    <Layout>
      <div className="container mx-auto py-6 pb-20">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate('/freights')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold tracking-tight">Selecionar Fretes para Recibo</h1>
            </div>
            
            <Button 
              onClick={handleGenerateMultipleReceipt} 
              disabled={selectedFreights.length === 0}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Gerar Recibo Múltiplo ({selectedFreights.length})
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <p>Carregando fretes...</p>
          </div>
        ) : freights.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Nenhum frete encontrado.</p>
            <Button 
              onClick={() => navigate('/freights')} 
              variant="outline"
              className="mt-4"
            >
              Voltar para a lista de fretes
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-muted p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="select-all" 
                  checked={selectedFreights.length === freights.length && freights.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  Selecionar todos os fretes
                </label>
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedFreights.length} de {freights.length} fretes selecionados
              </div>
            </div>

            {Object.entries(freightsByClient).map(([clientId, clientFreights]) => {
              const client = clientsMap[clientId];
              return (
                <div key={clientId} className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                  <div className="p-4 border-b flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`client-${clientId}`} 
                        checked={clientFreights.every(f => selectedFreights.includes(f.id))}
                        onCheckedChange={() => handleSelectByClient(clientId)}
                      />
                      <label htmlFor={`client-${clientId}`} className="text-lg font-medium">
                        {client?.name || "Cliente não encontrado"}
                      </label>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {clientFreights.filter(f => selectedFreights.includes(f.id)).length} de {clientFreights.length} selecionados
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]"></TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Origem/Destino</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientFreights.map((freight) => (
                          <TableRow 
                            key={freight.id} 
                            className={selectedFreights.includes(freight.id) ? "bg-primary/5" : ""}
                          >
                            <TableCell>
                              <Checkbox 
                                checked={selectedFreights.includes(freight.id)}
                                onCheckedChange={() => handleCheckboxChange(freight.id)}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {format(parseISO(freight.createdAt), "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell>
                              {freight.originCity}/{freight.originState} → {freight.destinationCity}/{freight.destinationState}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(freight.totalValue)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              );
            })}
            
            <div className="flex justify-end pb-10">
              <Button 
                onClick={handleGenerateMultipleReceipt} 
                disabled={selectedFreights.length === 0}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                Gerar Recibo Múltiplo ({selectedFreights.length})
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FreightSelection;
