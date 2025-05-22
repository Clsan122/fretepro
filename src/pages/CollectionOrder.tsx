
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import CollectionOrderForm from "@/components/CollectionOrderForm";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CollectionOrder, QuotationMeasurement } from "@/types";
import { saveCollectionOrder } from "@/utils/storage";
import { generateOrderNumber, orderExists } from "@/utils/orderNumber";

const CollectionOrderPage: React.FC = () => {
  const navigate = useNavigate();
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
          description: "Os dados da cotação foram importados para a ordem de coleta"
        });
      } catch (error) {
        console.error("Erro ao processar dados da cotação:", error);
      }
    }
  }, []);

  const handleSaveOrder = async (order: CollectionOrder) => {
    try {
      // Gerar um novo número de ordem apenas se não for um update
      if (!order.id || order.id.trim() === "") {
        let orderNumber;
        let attempts = 0;
        const maxAttempts = 10;
        
        // Tentar encontrar um número de ordem único
        do {
          orderNumber = generateOrderNumber();
          attempts++;
        } while (orderExists(orderNumber) && attempts < maxAttempts);
        
        if (attempts >= maxAttempts) {
          toast.error("Não foi possível gerar um número de ordem único. Tente novamente mais tarde.");
          return;
        }
        
        order.orderNumber = orderNumber;
      }
      
      await saveCollectionOrder(order);
      
      toast.success("Ordem de coleta cadastrada com sucesso!");
      navigate("/collection-orders");
    } catch (error) {
      console.error("Erro ao salvar ordem de coleta:", error);
      toast.error("Houve um problema ao salvar a ordem de coleta");
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
    measurements: Array.isArray(quotationData.measurements) 
      ? quotationData.measurements.map((m: QuotationMeasurement) => ({
          id: m.id,
          length: m.length,
          width: m.width,
          height: m.height,
          quantity: m.quantity
        })) 
      : []
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
