import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { getCollectionOrderById, deleteCollectionOrder } from "@/utils/storage";
import { CollectionOrder } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ActionButtons } from "@/components/collectionOrder/view/ActionButtons";
import { OrderHeader } from "@/components/collectionOrder/view/OrderHeader";
import { OrderContent } from "@/components/collectionOrder/view/OrderContent";

const CollectionOrderView: React.FC = () => {
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

  const handleSavePDF = () => {
    const printElement = document.getElementById('collection-order-print');
    
    if (!printElement) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Gerando PDF",
      description: "Aguarde enquanto geramos o PDF..."
    });
    
    html2canvas(printElement, {
      scale: 1.5,
      useCORS: true,
      logging: false,
      windowWidth: 800,
      windowHeight: 1200
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`ordem-coleta-${id}.pdf`);
      
      toast({
        title: "PDF gerado",
        description: "O PDF foi gerado com sucesso!"
      });
    });
  };

  const handleShareViaWhatsApp = () => {
    if (!order) return;
    
    const createdAt = new Date(order.createdAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const message = `*ORDEM DE COLETA*\n\n` +
      `📅 Data: ${createdAt}\n\n` +
      `*REMETENTE*\n${order.sender}\n\n` +
      `*DESTINATÁRIO*\n${order.recipient}\n\n` +
      `*ORIGEM*\n${order.originCity} - ${order.originState}\n\n` +
      `*DESTINO*\n${order.destinationCity} - ${order.destinationState}\n\n` +
      `*RECEBEDOR*\n${order.receiver}\n` +
      `${order.receiverAddress}\n\n` +
      `*DADOS DA CARGA*\n` +
      `Volumes: ${order.volumes}\n` +
      `Peso: ${order.weight} kg\n` +
      `Cubagem: ${order.cubicMeasurement.toFixed(3)} m³\n` +
      `Valor: ${order.merchandiseValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n\n` +
      `${order.driverName ? `*MOTORISTA*\n${order.driverName}${order.licensePlate ? `\nPlaca: ${order.licensePlate}` : ''}\n\n` : ''}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
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
          onSavePDF={handleSavePDF}
          onShare={handleShareViaWhatsApp}
        />
        
        <style type="text/css" media="print">
          {`
            @page {
              size: A4;
              margin: 10mm;
            }
            body {
              font-size: 12px;
              background-color: white !important;
            }
            .card-compact .card-header {
              padding: 12px;
            }
            .card-compact .card-content {
              padding: 12px;
            }
            .print-no-margin {
              margin: 0 !important;
            }
            .print-small-text {
              font-size: 11px !important;
            }
            .print-smaller-text {
              font-size: 10px !important;
            }
            .print-compact-grid {
              gap: 8px !important;
            }
            .print-hidden {
              display: none !important;
            }
            
            body > *:not(.print-container) {
              display: none !important;
            }
            
            header, nav, footer, .sidebar, .bottom-navigation {
              display: none !important;
            }
            
            .print-container {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              padding: 0 !important;
              margin: 0 !important;
            }
            
            #collection-order-print {
              width: 100%;
              max-width: 100%;
              box-shadow: none !important;
              padding: 5mm !important;
              margin: 0 !important;
            }
            
            .layout-main {
              padding: 0 !important;
              background: none !important;
            }
            
            #root > div > div:not(.print-container) {
              display: none !important;
            }
            
            #root {
              padding: 0 !important;
              margin: 0 !important;
              background: white !important;
            }
          `}
        </style>
        
        <div id="collection-order-print" className="bg-white rounded-lg p-6 shadow-md print:shadow-none print:p-0 print:m-0">
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
