
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { getCollectionOrderById, deleteCollectionOrder } from "@/utils/storage";
import { CollectionOrder } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ChevronLeft, FileText, Printer, Trash2, Edit } from "lucide-react";
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
      scale: 2,
      useCORS: true,
      logging: false
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
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
      <div className="p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between mb-6">
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
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-1" /> Imprimir
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
        
        <div id="collection-order-print" className="bg-white rounded-lg p-6 shadow-md">
          {order.companyLogo && (
            <div className="flex justify-center mb-6">
              <img
                src={order.companyLogo}
                alt="Logo da empresa"
                className="h-20 object-contain"
              />
            </div>
          )}
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-freight-700">ORDEM DE COLETA</h2>
            <p className="text-gray-500">Data de criação: {createdAt}</p>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Dados do Remetente e Destinatário</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Remetente / Exportador:</p>
                <p>{order.sender}</p>
              </div>
              <div>
                <p className="font-semibold">Destinatário / Importador:</p>
                <p>{order.recipient}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Informações de Localização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-semibold">Origem:</p>
                  <p>{order.originCity} - {order.originState}</p>
                </div>
                <div>
                  <p className="font-semibold">Destino:</p>
                  <p>{order.destinationCity} - {order.destinationState}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <p className="font-semibold">Recebedor / Destinatário:</p>
                <p>{order.receiver || "Não informado"}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Dados da Carga</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="font-semibold">Volumes:</p>
                <p>{order.volumes}</p>
              </div>
              <div>
                <p className="font-semibold">Peso (kg):</p>
                <p>{order.weight}</p>
              </div>
              <div>
                <p className="font-semibold">Cubagem (m³):</p>
                <p>{order.cubicMeasurement.toFixed(3)}</p>
              </div>
              <div>
                <p className="font-semibold">Valor da Mercadoria (R$):</p>
                <p>{order.merchandiseValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Medidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2 font-semibold mb-2">
                <div>Comprimento (cm)</div>
                <div>Largura (cm)</div>
                <div>Altura (cm)</div>
                <div>Quantidade</div>
              </div>
              
              {order.measurements.map((measurement, index) => (
                <div key={measurement.id} className="grid grid-cols-4 gap-2 py-2 border-b border-gray-100">
                  <div>{measurement.length}</div>
                  <div>{measurement.width}</div>
                  <div>{measurement.height}</div>
                  <div>{measurement.quantity}</div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {order.driverName && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados do Motorista</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Motorista:</p>
                  <p>{order.driverName}</p>
                </div>
                {order.licensePlate && (
                  <div>
                    <p className="font-semibold">Placa do Veículo:</p>
                    <p>{order.licensePlate}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CollectionOrderView;
