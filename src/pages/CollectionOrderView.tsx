
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getCollectionOrderById, deleteCollectionOrder, getUserById, getClientById } from "@/utils/storage";
import { CollectionOrder, User, Client } from "@/types";
import { OrderHeader } from "@/components/collectionOrder/view/OrderHeader";
import { OrderContent } from "@/components/collectionOrder/view/OrderContent";
import { ActionButtons } from "@/components/collectionOrder/view/ActionButtons";
import { PrintStyles } from "@/components/collectionOrder/view/PrintStyles";
import { useCollectionOrderPdf } from "@/hooks/useCollectionOrderPdf";
import { File, Trash2, Edit } from "lucide-react";

const CollectionOrderView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<CollectionOrder | null>(null);
  const [issuer, setIssuer] = useState<User | Client | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isGenerating, handleDownload, handleShare, handlePrint } = useCollectionOrderPdf(order, id);

  useEffect(() => {
    if (id) {
      const orderData = getCollectionOrderById(id);
      if (orderData) {
        setOrder(orderData);
        
        // Fetch issuer information (user or client)
        if (orderData.issuerId) {
          // First try to get as user (my company)
          const userIssuer = getUserById(orderData.issuerId);
          if (userIssuer) {
            setIssuer(userIssuer);
          } else {
            // Then try to get as client
            const clientIssuer = getClientById(orderData.issuerId);
            if (clientIssuer) {
              setIssuer(clientIssuer);
            }
          }
        }
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

  const handleDelete = () => {
    if (!id) return;
    
    deleteCollectionOrder(id);
    toast({
      title: "Ordem de coleta excluída",
      description: "A ordem de coleta foi excluída com sucesso"
    });
    navigate("/collection-orders");
  };

  const handleEdit = () => {
    navigate(`/collection-order/${id}/edit`);
  };

  if (!order) {
    return (
      <Layout>
        <div className="p-4 md:p-6 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Carregando...</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Print Styles */}
      <PrintStyles />
      
      <div className="p-4 md:p-6 space-y-4">
        {/* Print version (hidden in normal view) */}
        <div id="collection-order-print" className="hidden print:block">
          <OrderHeader
            createdAt={order.createdAt}
            orderNumber={order.orderNumber}
            issuer={issuer}
          />
          <OrderContent order={order} />
        </div>
        
        {/* Screen version */}
        <div className="print:hidden">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Ordem de Coleta #{order.orderNumber}</h1>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="destructive" 
                size="icon"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-4 sm:p-6">
              <OrderHeader
                createdAt={order.createdAt}
                orderNumber={order.orderNumber}
                issuer={issuer}
              />
              <OrderContent order={order} />
            </div>
          </div>
          
          <ActionButtons
            isGenerating={isGenerating}
            onDownload={handleDownload}
            onShare={handleShare}
            onPrint={handlePrint}
          />
        </div>
      </div>
    </Layout>
  );
};

export default CollectionOrderView;
