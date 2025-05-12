
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
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchOrder() {
      if (id) {
        try {
          const collectionOrder = await getCollectionOrderById(id);
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
        } catch (error) {
          console.error("Erro ao buscar ordem de coleta:", error);
          toast({
            title: "Erro",
            description: "Erro ao buscar ordem de coleta",
            variant: "destructive"
          });
          navigate("/collection-orders");
        } finally {
          setLoading(false);
        }
      }
    }
    
    fetchOrder();
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

  if (loading) {
    return (
      <Layout>
        <div className="p-4 md:p-6 safe-area-inset">
          <h1 className="text-2xl font-bold">Carregando...</h1>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="p-4 md:p-6 safe-area-inset">
          <h1 className="text-2xl font-bold">Ordem não encontrada</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-6 safe-area-inset">
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
