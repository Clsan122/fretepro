
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getFreightById } from "@/utils/storage";
import { Freight } from "@/types";
import MultiFreightReceiptGenerator from "@/components/MultiFreightReceiptGenerator";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MultiFreightReceipt: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [freights, setFreights] = useState<Freight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const ids = searchParams.get('ids');
    if (!ids) {
      toast({
        title: "Seleção não encontrada",
        description: "Nenhum frete selecionado para gerar o recibo múltiplo.",
        variant: "destructive"
      });
      // Redirect back to selection page
      navigate('/freight/selection');
      return;
    }
    
    const freightIds = ids.split(',');
    const loadedFreights: Freight[] = [];
    
    freightIds.forEach(id => {
      const freight = getFreightById(id);
      if (freight && freight.userId === user.id) {
        loadedFreights.push(freight);
      }
    });
    
    if (loadedFreights.length === 0) {
      toast({
        title: "Nenhum frete encontrado",
        description: "Os fretes selecionados não foram encontrados.",
        variant: "destructive"
      });
      navigate('/freight/selection');
      return;
    }
    
    // Group by client for better presentation
    const sortedFreights = loadedFreights.sort((a, b) => {
      // First group by client
      if (a.clientId !== b.clientId) {
        return a.clientId.localeCompare(b.clientId);
      }
      // Then sort by date if same client
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    setFreights(sortedFreights);
    setLoading(false);
  }, [searchParams, user, navigate, toast]);

  return (
    <Layout>
      <div className="container mx-auto py-6 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/freight/selection')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Recibo Múltiplo</h1>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <p>Carregando fretes...</p>
          </div>
        ) : freights.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
            <MultiFreightReceiptGenerator freights={freights} />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="mb-4">Nenhum frete selecionado para gerar o recibo múltiplo.</p>
            <Button onClick={() => navigate('/freight/selection')}>
              Selecionar Fretes
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MultiFreightReceipt;
