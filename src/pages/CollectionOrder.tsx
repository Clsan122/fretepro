
import React from "react";
import Layout from "@/components/Layout";
import CollectionOrderForm from "@/components/CollectionOrderForm";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CollectionOrder } from "@/types";
import { saveCollectionOrder } from "@/utils/storage";

const CollectionOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Check if we have data for editing or conversion from quotation
  const prefillData = location.state?.prefillData as CollectionOrder | undefined;

  const handleSaveOrder = (order: CollectionOrder) => {
    try {
      saveCollectionOrder(order);
      toast({
        title: "Ordem de coleta cadastrada",
        description: "A ordem de coleta foi cadastrada com sucesso!",
      });
      navigate("/collection-orders");
    } catch (error) {
      console.error("Erro ao salvar ordem de coleta:", error);
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro ao salvar a ordem de coleta.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate("/collection-orders");
  };

  return (
    <Layout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-4">
          {prefillData ? "Editar Ordem de Coleta" : "Nova Ordem de Coleta"}
        </h1>
        <CollectionOrderForm 
          onSave={handleSaveOrder} 
          onCancel={handleCancel}
          orderToEdit={prefillData}
        />
      </div>
    </Layout>
  );
};

export default CollectionOrderPage;
