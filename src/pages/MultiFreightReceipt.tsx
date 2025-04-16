
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getFreightById } from "@/utils/storage";
import { Freight } from "@/types";
import Layout from "@/components/Layout";
import MultiFreightReceiptGenerator from "@/components/MultiFreightReceiptGenerator";
import { useToast } from "@/components/ui/use-toast";

const MultiFreightReceipt: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [freights, setFreights] = useState<Freight[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const idsParam = searchParams.get("ids");
    if (!idsParam) {
      toast({
        title: "Erro",
        description: "Nenhum frete selecionado para o recibo.",
        variant: "destructive",
      });
      return;
    }

    const ids = idsParam.split(",");
    const freightsList = ids
      .map(id => getFreightById(id))
      .filter(freight => freight !== null) as Freight[];

    if (freightsList.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhum frete válido encontrado para os IDs fornecidos.",
        variant: "destructive",
      });
      return;
    }

    setFreights(freightsList);
  }, [searchParams, toast]);

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Recibo de Múltiplos Fretes</h1>
        
        {freights.length > 0 ? (
          <MultiFreightReceiptGenerator freights={freights} />
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p>Carregando fretes...</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MultiFreightReceipt;
