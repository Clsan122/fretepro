import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { getCollectionOrderById, deleteCollectionOrder } from "@/utils/storage";
import { CollectionOrder } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ChevronLeft, FileText, Printer, Trash2, Edit, Save, Download, Share } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

  const handlePrint = () => {
    window.print();
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

  const handleShareViaWhatsApp = () => {
    const message = `*ORDEM DE COLETA*\n\n` +
      `📅 Data: ${createdAt}\n\n` +
      `*REMETENTE*\n${order?.sender}\n\n` +
      `*DESTINATÁRIO*\n${order?.recipient}\n\n` +
      `*ORIGEM*\n${order?.originCity} - ${order?.originState}\n\n` +
      `*DESTINO*\n${order?.destinationCity} - ${order?.destinationState}\n\n` +
      `*RECEBEDOR*\n${order?.receiver}\n` +
      `${order?.receiverAddress}\n\n` +
      `*DADOS DA CARGA*\n` +
      `Volumes: ${order?.volumes}\n` +
      `Peso: ${order?.weight} kg\n` +
      `Cubagem: ${order?.cubicMeasurement.toFixed(3)} m³\n` +
      `Valor: ${order?.merchandiseValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n\n` +
      `${order?.driverName ? `*MOTORISTA*\n${order.driverName}${order.licensePlate ? `\nPlaca: ${order.licensePlate}` : ''}\n\n` : ''}`;

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
        <div className="flex flex-wrap items-center justify-between mb-4 print:hidden">
          <div className="flex items-center mb-2 md:mb-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/collection-orders")}
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
            </Button>
            <h1 className="text-2xl font-bold">Ordem de Coleta</h1>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSavePDF}
            >
              <Download className="h-4 w-4 mr-1" /> Salvar PDF
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareViaWhatsApp}
            >
              <Share className="h-4 w-4 mr-1" /> Compartilhar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/collection-order/edit/${id}`)}
            >
              <Edit className="h-4 w-4 mr-1" /> Editar
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir ordem de coleta</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir esta ordem de coleta? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
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
          {order.companyLogo && (
            <div className="flex justify-center mb-4 print:mb-2">
              <img
                src={order.companyLogo}
                alt="Logo da empresa"
                className="h-16 print:h-14 object-contain"
              />
            </div>
          )}
          
          <div className="text-center mb-4 print:mb-2">
            <h2 className="text-2xl print:text-xl font-bold text-freight-700">ORDEM DE COLETA</h2>
            <p className="text-gray-500 text-sm print:text-xs">Data de criação: {createdAt}</p>
          </div>
          
          <Card className="mb-4 print:mb-2 card-compact border print:border-0 print:shadow-none">
            <CardHeader className="py-3 px-4 print:p-2 print:pb-0">
              <CardTitle className="text-lg print:text-sm">Dados do Remetente e Destinatário</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2 print:grid-cols-2 print-compact-grid py-2 px-4 print:p-2 print:pt-0 print-small-text">
              <div>
                <p className="font-semibold">Remetente / Exportador:</p>
                <p className="print-smaller-text">{order.sender}</p>
              </div>
              <div>
                <p className="font-semibold">Destinatário / Importador:</p>
                <p className="print-smaller-text">{order.recipient}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-4 print:mb-2 card-compact border print:border-0 print:shadow-none">
            <CardHeader className="py-3 px-4 print:p-2 print:pb-0">
              <CardTitle className="text-lg print:text-sm">Informações de Localização</CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-4 print:p-2 print:pt-0 print-small-text">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2 print:grid-cols-2 print-compact-grid mb-2 print:mb-1">
                <div>
                  <p className="font-semibold">Origem:</p>
                  <p className="print-smaller-text">{order.originCity} - {order.originState}</p>
                </div>
                <div>
                  <p className="font-semibold">Destino:</p>
                  <p className="print-smaller-text">{order.destinationCity} - {order.destinationState}</p>
                </div>
              </div>
              
              <Separator className="my-2 print:my-1" />
              
              <div className="space-y-2 print:space-y-1">
                <div>
                  <p className="font-semibold">Recebedor / Destinatário:</p>
                  <p className="print-smaller-text">{order.receiver || "Não informado"}</p>
                </div>
                
                <div>
                  <p className="font-semibold">Endereço do Destinatário:</p>
                  <p className="print-smaller-text">{order.receiverAddress || "Não informado"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-4 print:mb-2 card-compact border print:border-0 print:shadow-none">
            <CardHeader className="py-3 px-4 print:p-2 print:pb-0">
              <CardTitle className="text-lg print:text-sm">Dados da Carga</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:gap-2 print:grid-cols-4 print-compact-grid py-2 px-4 print:p-2 print:pt-0 print-small-text">
              <div>
                <p className="font-semibold">Volumes:</p>
                <p className="print-smaller-text">{order.volumes}</p>
              </div>
              <div>
                <p className="font-semibold">Peso (kg):</p>
                <p className="print-smaller-text">{order.weight}</p>
              </div>
              <div>
                <p className="font-semibold">Cubagem (m³):</p>
                <p className="print-smaller-text">{order.cubicMeasurement.toFixed(3)}</p>
              </div>
              <div>
                <p className="font-semibold">Valor (R$):</p>
                <p className="print-smaller-text">{order.merchandiseValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-4 print:mb-2 card-compact border print:border-0 print:shadow-none">
            <CardHeader className="py-3 px-4 print:p-2 print:pb-0">
              <CardTitle className="text-lg print:text-sm">Medidas</CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-4 print:p-2 print:pt-0 print-small-text">
              <div className="grid grid-cols-4 gap-2 font-semibold mb-1 print:text-xs">
                <div>Comprimento (cm)</div>
                <div>Largura (cm)</div>
                <div>Altura (cm)</div>
                <div>Quantidade</div>
              </div>
              
              {order.measurements.map((measurement, index) => (
                <div key={measurement.id} className="grid grid-cols-4 gap-2 py-1 border-b border-gray-100 print-smaller-text">
                  <div>{measurement.length}</div>
                  <div>{measurement.width}</div>
                  <div>{measurement.height}</div>
                  <div>{measurement.quantity}</div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {order.driverName && (
            <Card className="card-compact border print:border-0 print:shadow-none">
              <CardHeader className="py-3 px-4 print:p-2 print:pb-0">
                <CardTitle className="text-lg print:text-sm">Dados do Motorista</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2 print:grid-cols-2 print-compact-grid py-2 px-4 print:p-2 print:pt-0 print-small-text">
                <div>
                  <p className="font-semibold">Motorista:</p>
                  <p className="print-smaller-text">{order.driverName}</p>
                </div>
                {order.licensePlate && (
                  <div>
                    <p className="font-semibold">Placa do Veículo:</p>
                    <p className="print-smaller-text">{order.licensePlate}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4 print:mt-3 print:pt-2 print:grid-cols-2 print-small-text print:gap-2">
            <div>
              <p className="font-semibold mb-16 print:mb-8">Assinatura do Expedidor:</p>
              <div className="border-t border-gray-500 w-full"></div>
            </div>
            <div>
              <p className="font-semibold mb-16 print:mb-8">Assinatura do Motorista:</p>
              <div className="border-t border-gray-500 w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CollectionOrderView;
