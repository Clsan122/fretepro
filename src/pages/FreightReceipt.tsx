
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getFreightById, getClientById, getDriverById } from "@/utils/storage";
import { useAuth } from "@/context/AuthContext";
import { Freight, Client, Driver } from "@/types";
import Layout from "@/components/Layout";
import ReceiptGenerator from "@/components/ReceiptGenerator";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const FreightReceipt: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [freight, setFreight] = useState<Freight | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const idsParam = searchParams.get("ids");
    if (!idsParam) {
      toast({
        title: "Erro",
        description: "Nenhum frete selecionado para o recibo.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const freightId = idsParam.split(",")[0]; // Pegamos apenas o primeiro ID
    const freightData = getFreightById(freightId);

    if (!freightData) {
      toast({
        title: "Erro",
        description: "Frete não encontrado.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Buscar dados do cliente
    const clientData = getClientById(freightData.clientId);
    if (clientData) {
      setClients([clientData]);
    }

    // Buscar dados do motorista, se existir
    if (freightData.driverId) {
      const driverData = getDriverById(freightData.driverId);
      if (driverData) {
        setDriver(driverData);
      }
    }

    setFreight(freightData);
    setLoading(false);
  }, [searchParams, user, toast]);

  return (
    <Layout>
      <div className="container mx-auto py-4 px-2 md:px-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl md:text-2xl font-bold">Recibo de Frete</h1>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p>Carregando dados do frete...</p>
          </div>
        ) : freight && user ? (
          <ReceiptGenerator 
            freight={freight} 
            clients={clients} 
            user={user} 
            driver={driver || undefined} 
          />
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p>Não foi possível gerar o recibo. Verifique se o frete existe.</p>
            <Button 
              onClick={() => navigate("/freights")}
              variant="outline"
              className="mt-4"
            >
              Voltar para Fretes
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FreightReceipt;
