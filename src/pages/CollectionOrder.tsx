
import React from "react";
import Layout from "@/components/Layout";
import CollectionOrderForm from "@/components/CollectionOrderForm";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CollectionOrder } from "@/types";
import { saveCollectionOrder } from "@/utils/storage";

const CollectionOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSaveOrder = async (order: CollectionOrder) => {
    await saveCollectionOrder(order);
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
      <div className="p-4 md:p-6 safe-area-inset">
        <h1 className="text-2xl font-bold mb-6">Nova Ordem de Coleta</h1>
        <CollectionOrderForm 
          onSave={handleSaveOrder} 
          onCancel={handleCancel}
        />
      </div>
    </Layout>
  );
};

export default CollectionOrderPage;
