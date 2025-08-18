
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SimpleCollectionOrderForm from "@/components/collectionOrder/SimpleCollectionOrderForm";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { CollectionOrder } from "@/types";
import { getCollectionOrderById, saveCollectionOrder } from "@/utils/storage";

const CollectionOrderEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<CollectionOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrder() {
      if (id) {
        try {
          const collectionOrder = await getCollectionOrderById(id);
          if (collectionOrder) {
            // Ensure measurements is always an array
            if (!Array.isArray(collectionOrder.measurements)) {
              collectionOrder.measurements = [];
            }
            setOrder(collectionOrder);
          } else {
            toast.error("Ordem de coleta não encontrada");
            navigate("/collection-orders");
          }
        } catch (error) {
          console.error("Erro ao buscar ordem de coleta:", error);
          toast.error("Erro ao buscar ordem de coleta");
          navigate("/collection-orders");
        } finally {
          setLoading(false);
        }
      }
    }
    
    fetchOrder();
  }, [id, navigate]);

  const handleSaveOrder = async (updatedOrder: CollectionOrder) => {
    if (!id) {
      toast.error("ID da ordem não encontrado");
      return;
    }
    
    try {
      setSaving(true);
      
      // Garantir que preservamos o ID original e não criamos duplicata
      const orderToSave = {
        ...updatedOrder,
        id: id, // Usar sempre o ID original
        orderNumber: order?.orderNumber || updatedOrder.orderNumber, // Preservar número original
        createdAt: order?.createdAt || updatedOrder.createdAt, // Preservar data de criação original
        updatedAt: new Date().toISOString(), // Atualizar data de modificação
        syncVersion: (order?.syncVersion || 1) + 1 // Incrementar versão para sincronização
      };
      
      console.log("Salvando ordem com ID:", orderToSave.id);
      
      // Salvar usando a função que atualiza no lugar da original
      await saveCollectionOrder(orderToSave);
      
      toast.success("Ordem de coleta atualizada com sucesso!");
      navigate("/collection-orders");
    } catch (error) {
      console.error("Erro ao salvar ordem de coleta:", error);
      toast.error("Falha ao atualizar a ordem de coleta");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/collection-orders");
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-4 md:p-6 safe-area-inset">
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-t-freight-600 border-freight-200 rounded-full animate-spin"></div>
            <span className="ml-2 text-freight-600">Carregando...</span>
          </div>
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
        <SimpleCollectionOrderForm 
          onSave={handleSaveOrder} 
          onCancel={handleCancel}
          orderToEdit={order}
          isSaving={saving}
        />
      </div>
    </Layout>
  );
};

export default CollectionOrderEdit;
