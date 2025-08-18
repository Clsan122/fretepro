import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import SimpleCollectionOrderForm from "@/components/collectionOrder/SimpleCollectionOrderForm";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CollectionOrder } from "@/types";
import { saveCollectionOrder } from "@/utils/storage";
const CollectionOrderPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSaveOrder = async (order: CollectionOrder) => {
    try {
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
  return (
    <Layout>
      <div className="p-4 md:p-6 safe-area-inset">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Nova Ordem de Coleta
        </h1>
        <SimpleCollectionOrderForm 
          onSave={handleSaveOrder} 
          onCancel={handleCancel} 
        />
      </div>
    </Layout>
  );
};
export default CollectionOrderPage;