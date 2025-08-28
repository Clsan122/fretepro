import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getFreightById } from "@/utils/storage";
import { Freight } from "@/types";
import SimpleFreightReceiptGenerator from "@/components/MultiFreightReceiptGenerator";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SimpleFreightReceipt: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [freights, setFreights] = useState<Freight[]>([]);
  const [loading, setLoading] = useState(true);

  const isSimpleFreight = (freight: Freight): boolean => {
    // Considera qualquer frete válido como frete simples para recibo múltiplo
    return freight.totalValue > 0;
  };

  useEffect(() => {
    console.log('=== DEBUG SimpleFreightReceipt ===');
    console.log('User:', user?.id);
    console.log('SearchParams:', searchParams.toString());
    
    if (!user) {
      console.log('User não encontrado, redirecionando...');
      return;  
    }
    
    const ids = searchParams.get('ids');
    console.log('IDs from searchParams:', ids);
    
    if (!ids) {
      console.log('Nenhum ID encontrado nos searchParams');
      toast({
        title: "Seleção não encontrada",
        description: "Nenhum frete selecionado para gerar o recibo múltiplo.",
        variant: "destructive"
      });
      navigate('/simple-freight/selection');
      return;
    }
    
    const freightIds = ids.split(',');
    console.log('FreightIds array:', freightIds);
    
    const loadedFreights: Freight[] = [];
    
    freightIds.forEach(id => {
      const freight = getFreightById(id);
      console.log(`Freight ${id}:`, freight);
      
      if (freight && freight.userId === user.id && isSimpleFreight(freight)) {
        loadedFreights.push(freight);
      } else {
        console.log(`Freight ${id} rejeitado:`, {
          exists: !!freight,
          correctUser: freight?.userId === user.id,
          isSimple: freight ? isSimpleFreight(freight) : false
        });
      }
    });
    
    console.log('Loaded freights:', loadedFreights);
    
    if (loadedFreights.length === 0) {
      console.log('Nenhum frete simples carregado');
      toast({
        title: "Nenhum frete simples encontrado",
        description: "Os fretes selecionados não foram encontrados ou não são fretes simples.",
        variant: "destructive"
      });
      navigate('/simple-freight/selection');
      return;
    }
    
    // Ordenar por data
    const sortedFreights = loadedFreights.sort((a, b) => {
      return new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime();
    });
    
    console.log('Sorted freights:', sortedFreights);
    
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
              onClick={() => navigate('/simple-freight/selection')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Recibo Múltiplo - Fretes Simples</h1>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <p>Carregando fretes...</p>
          </div>
        ) : freights.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
            <SimpleFreightReceiptGenerator freights={freights} />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="mb-4">Nenhum frete simples selecionado para gerar o recibo múltiplo.</p>
            <Button onClick={() => navigate('/simple-freight/selection')}>
              Selecionar Fretes Simples
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SimpleFreightReceipt;