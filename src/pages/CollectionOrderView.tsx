import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { getCollectionOrderById, deleteCollectionOrder } from "@/utils/storage";
import { CollectionOrder } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { ActionButtons } from "@/components/collectionOrder/view/ActionButtons";
import { OrderHeader } from "@/components/collectionOrder/view/OrderHeader";
import { OrderContent } from "@/components/collectionOrder/view/OrderContent";
import { PrintStyles } from "@/components/collectionOrder/view/PrintStyles";
import { useCollectionOrderPdf } from "@/hooks/useCollectionOrderPdf";

const CollectionOrderView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<CollectionOrder | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  const { isGenerating, handleShare, handleDownload, handlePrint } = useCollectionOrderPdf(order, id);

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

  const handleDelete = () => {
    if (id) {
      deleteCollectionOrder(id);
      toast({
        title: "Ordem de coleta excluída",
        description: "A ordem de coleta foi excluída com sucesso!"
      });
      navigate("/collection-orders");
    }
  };

  if (!order) {
    return (
      <Layout>
        <div className="p-4 md:p-6">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/collection-orders")}
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
            </Button>
            <h1 className="text-2xl font-bold">Carregando...</h1>
          </div>
        </div>
      </Layout>
    );
  }

  const createdAt = new Date(order.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <Layout>
      <div className="p-4 md:p-6 print-container">
        <ActionButtons
          id={id}
          onDelete={handleDelete}
          onShare={handleShare}
          onDownload={handleDownload}
          onPrint={handlePrint}
        />
        
        <PrintStyles />
        
        <div 
          id="collection-order-print" 
          ref={printRef}
          className={`bg-white rounded-lg p-6 shadow-md print:shadow-none print:p-0 print:m-0 ${isGenerating ? 'opacity-0 absolute' : ''}`}
        >
          <OrderHeader
            companyLogo={order.companyLogo}
            createdAt={createdAt}
          />
          
          <OrderContent order={order} />
        </div>
      </div>
    </Layout>
  );
};

export default CollectionOrderView;
