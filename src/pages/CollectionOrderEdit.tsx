
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import CollectionOrderForm from "@/components/CollectionOrderForm";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { CollectionOrder } from "@/types";
import { getCollectionOrderById, saveCollectionOrder } from "@/utils/storage";

const CollectionOrderEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<CollectionOrder | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      const collectionOrder = getCollectionOrderById(id);
      if (collectionOrder) {
        setOrder(collectionOrder);
      } else {
        toast({
          title: "Erro",
          description: "Ordem de coleta não encontrada",
          variant: "destructive"
        });
        navigate("/collection-orders");
      }
    }
  }, [id, navigate, toast]);

  const handleSaveOrder = (updatedOrder: CollectionOrder) => {
    saveCollectionOrder(updatedOrder);
    toast({
      title: "Ordem de coleta atualizada",
      description: "A ordem de coleta foi atualizada com sucesso!",
    });
    navigate(`/collection-order/${updatedOrder.id}`);
  };

  const handleCancel = () => {
    navigate(`/collection-order/${id}`);
  };

  if (!order) {
    return (
      <Layout>
        <div className="p-4 md:p-6">
          <h1 className="text-2xl font-bold">Carregando...</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Editar Ordem de Coleta</h1>
        <CollectionOrderForm 
          onSave={handleSaveOrder} 
          onCancel={handleCancel}
          orderToEdit={order}
        />
      </div>
    </Layout>
  );
};

export default CollectionOrderEdit;
