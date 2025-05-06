
import React from "react";
import Layout from "@/components/Layout";
import QuotationForm from "@/components/quotation/QuotationForm";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { QuotationFormData } from "@/hooks/useQuotationForm";
import { saveCollectionOrder } from "@/utils/storage";
import { CollectionOrder } from "@/types";

const QuotationPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSaveQuotation = (data: QuotationFormData) => {
    // Aqui você pode implementar a lógica para salvar a cotação
    // Por enquanto, só mostraremos uma mensagem de sucesso
    toast({
      title: "Cotação salva",
      description: "Cotação salva com sucesso!",
    });
    
    // Navegar de volta para a lista de cotações (quando implementada)
    navigate("/quotations");
  };
  
  const handleConvertToOrder = (order: CollectionOrder) => {
    // Salvar a ordem de coleta gerada pela cotação
    saveCollectionOrder(order);
    
    toast({
      title: "Ordem de coleta criada",
      description: "Ordem de coleta criada com sucesso a partir da cotação!",
    });
    
    // Navegar para a visualização da ordem
    navigate(`/collection-orders/${order.id}`);
  };

  const handleCancel = () => {
    navigate("/quotations");
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Nova Cotação</h1>
        <QuotationForm 
          onSave={handleSaveQuotation}
          onCancel={handleCancel}
          onConvertToOrder={handleConvertToOrder}
        />
      </div>
    </Layout>
  );
};

export default QuotationPage;
