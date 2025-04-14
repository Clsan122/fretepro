
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { getCollectionOrderById, deleteCollectionOrder } from "@/utils/storage";
import { CollectionOrder } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Import the new components
import { CollectionOrderHeader } from "@/components/collectionOrder/CollectionOrderHeader";
import { CollectionOrderDocument } from "@/components/collectionOrder/CollectionOrderDocument";
import { PrintStyles } from "@/components/collectionOrder/PrintStyles";
import { usePDFGenerator } from "@/components/collectionOrder/PDFGenerator";

const CollectionOrderView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<CollectionOrder | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { generatePDF } = usePDFGenerator();
  
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

  const handlePrint = () => {
    window.print();
  };

  const handleSavePDF = () => {
    if (id) {
      generatePDF({
        elementId: 'collection-order-print',
        fileName: `ordem-coleta-${id}.pdf`
      });
    }
  };
  
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
              <span className="mr-1">←</span> Voltar
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
        <CollectionOrderHeader
          id={id || ''}
          handleDelete={handleDelete}
          handlePrint={handlePrint}
          handleSavePDF={handleSavePDF}
        />
        
        <PrintStyles />
        
        <CollectionOrderDocument 
          order={order} 
          createdAt={createdAt}
        />
      </div>
    </Layout>
  );
};

export default CollectionOrderView;
