
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import CollectionOrderForm from "@/components/CollectionOrderForm";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CollectionOrder, QuotationMeasurement } from "@/types";
import { saveCollectionOrder } from "@/utils/storage";

const CollectionOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quotationData, setQuotationData] = useState<any>(null);

  useEffect(() => {
    // Verificar se há dados de cotação no localStorage
    const quotationString = localStorage.getItem('quotationForCollectionOrder');
    if (quotationString) {
      try {
        const data = JSON.parse(quotationString);
        setQuotationData(data);
        // Limpar dados após carregá-los
        localStorage.removeItem('quotationForCollectionOrder');
        
        toast({
          title: "Dados importados",
          description: "Os dados da cotação foram importados para a ordem de coleta"
        });
      } catch (error) {
        console.error("Erro ao processar dados da cotação:", error);
      }
    }
  }, [toast]);

  const handleSaveOrder = async (order: CollectionOrder) => {
    try {
      // Verificar se já existe uma ordem com este ID (caso de edição)
      // Se for edição, mantemos o ID original
      await saveCollectionOrder(order);
      
      toast({
        title: "Ordem de coleta cadastrada",
        description: "A ordem de coleta foi cadastrada com sucesso!"
      });
      navigate("/collection-orders");
    } catch (error) {
      console.error("Erro ao salvar ordem de coleta:", error);
      toast({
        title: "Erro",
        description: "Houve um problema ao salvar a ordem de coleta",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    navigate("/collection-orders");
  };

  // Converter dados da cotação para o formato esperado pela ordem de coleta
  const initialOrderData = quotationData ? {
    sender: quotationData.creatorName || "",
    senderAddress: "",
    originCity: quotationData.originCity || "",
    originState: quotationData.originState || "",
    destinationCity: quotationData.destinationCity || "",
    destinationState: quotationData.destinationState || "",
    recipient: "",
    recipientAddress: "",
    volumes: quotationData.volumes || 0,
    weight: quotationData.weight || 0,
    merchandiseValue: quotationData.merchandiseValue || 0,
    measurements: quotationData.measurements?.map((m: QuotationMeasurement) => ({
      id: m.id,
      length: m.length,
      width: m.width,
      height: m.height,
      quantity: m.quantity
    })) || []
  } : undefined;

  return (
    <Layout>
      <div className="p-4 md:p-6 safe-area-inset">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {quotationData ? "Nova Ordem de Coleta (de Cotação)" : "Nova Ordem de Coleta"}
        </h1>
        <CollectionOrderForm 
          onSave={handleSaveOrder} 
          onCancel={handleCancel} 
          initialData={initialOrderData}
        />
      </div>
    </Layout>
  );
};

export default CollectionOrderPage;
