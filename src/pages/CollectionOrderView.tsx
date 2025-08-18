import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import SimpleCollectionOrderPdf from "@/components/collectionOrder/SimpleCollectionOrderPdf";
import { useAuth } from "@/context/AuthContext";
import { getCollectionOrderById } from "@/utils/storage";
import { CollectionOrder } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { toast } from "sonner";

const CollectionOrderView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<CollectionOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) {
        navigate("/collection-orders");
        return;
      }

      try {
        const foundOrder = await getCollectionOrderById(id);
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          toast.error("Ordem de coleta não encontrada");
          navigate("/collection-orders");
        }
      } catch (error) {
        console.error("Erro ao carregar ordem:", error);
        toast.error("Erro ao carregar ordem de coleta");
        navigate("/collection-orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/collection-orders")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Carregando...</h1>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/collection-orders")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Ordem não encontrada</h1>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/collection-orders")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              Ordem de Coleta #{order.orderNumber}
            </h1>
          </div>
          <Button
            onClick={() => navigate(`/collection-order/edit/${id}`)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
          <SimpleCollectionOrderPdf order={order} />
        </div>
      </div>
    </Layout>
  );
};

export default CollectionOrderView;
