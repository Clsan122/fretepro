
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
  
  // Verificar se temos dados preenchidos da cotação
  const prefillData = location.state?.prefillData as CollectionOrder | undefined;

  const handleSaveOrder = (order: CollectionOrder) => {
    saveCollectionOrder(order);
    toast({
      title: "Ordem de coleta cadastrada",
      description: "A ordem de coleta foi cadastrada com sucesso!",
    });
    navigate("/collection-orders");
  };

  const handleCancel = () => {
    navigate("/collection-orders");
  };

  return (
    <Layout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-4">
          {prefillData ? "Criar Ordem de Coleta a partir de Cotação" : "Nova Ordem de Coleta"}
        </h1>
        <CollectionOrderForm 
          onSave={handleSaveOrder} 
          onCancel={handleCancel}
        />
      </div>
    </Layout>
  );
};

export default CollectionOrderPage;
