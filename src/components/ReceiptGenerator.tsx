
import React, { useRef, useState } from "react";
import { Freight, Client, User, Driver } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Receipt, Download, User as UserIcon, Truck, Share2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReceiptGeneratorProps {
  freight: Freight;
  clients: Client[];
  user: User;
  driver?: Driver;
}

const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({ freight, clients, user, driver }) => {
  const client = clients.find((c) => c.id === freight.clientId);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return "Data inválida";
    }
  };

  const generatePDF = async (): Promise<Blob> => {
    if (!receiptRef.current) throw new Error("Elemento de recibo não encontrado");
    
    setIsGenerating(true);
    
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5', // Mantido em A5 para ser mais compacto
      });
      
      const scale = 2;
      const canvas = await html2canvas(receiptRef.current, { 
        scale: scale,
        useCORS: true,
        logging: false,
        allowTaint: true,
      });
      
      const imgWidth = canvas.width / scale;
      const imgHeight = canvas.height / scale;
      const ratio = pdf.internal.pageSize.getWidth() / imgWidth;
      
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        0,
        imgWidth * ratio,
        imgHeight * ratio
      );
      
      return pdf.output('blob');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReceipt = async () => {
    toast({
      title: "Gerando PDF",
      description: "Aguarde enquanto preparamos o recibo..."
    });
    
    try {
      const pdfBlob = await generatePDF();
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recibo-frete-${freight.id.substring(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Recibo gerado",
        description: "O PDF foi baixado com sucesso."
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF",
        variant: "destructive"
      });
    }
  };
  
  const shareReceipt = async () => {
    toast({
      title: "Gerando PDF",
      description: "Aguarde enquanto preparamos o recibo para compartilhamento..."
    });
    
    try {
      const pdfBlob = await generatePDF();
      const file = new File([pdfBlob], `recibo-frete-${freight.id.substring(0, 8)}.pdf`, { type: 'application/pdf' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Recibo de Frete - ${client?.name || 'Cliente'}`,
          text: `Recibo de frete para transporte de ${freight.originCity}/${freight.originState} para ${freight.destinationCity}/${freight.destinationState}.`,
        });
        
        toast({
          title: "Sucesso",
          description: "Recibo compartilhado com sucesso!"
        });
      } else {
        // Fallback para navegadores que não suportam Web Share API
        downloadReceipt();
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      toast({
        title: "Erro",
        description: "Não foi possível compartilhar o recibo",
        variant: "destructive"
      });
    }
  };
  
  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="p-2 max-w-md mx-auto print:p-0">
      <div className="flex flex-wrap justify-between gap-2 mb-4 print:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center justify-center gap-2">
              <Share2 className="h-4 w-4" />
              Compartilhar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={shareReceipt}>
              <Share2 className="h-4 w-4 mr-2" /> Compartilhar PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={downloadReceipt}>
              <Download className="h-4 w-4 mr-2" /> Baixar PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={printReceipt}>
              <Printer className="h-4 w-4 mr-2" /> Imprimir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <style type="text/css" media="print">
        {`
          @page {
            size: A5;
            margin: 5mm;
          }
          body {
            font-size: 10px;
            background-color: white !important;
          }
          
          header, nav, footer, .bottom-navigation, button {
            display: none !important;
          }
        `}
      </style>
      
      <div 
        ref={receiptRef} 
        className={`bg-white border rounded-lg shadow-sm p-3 text-xs ${isGenerating ? 'opacity-0 absolute' : ''}`}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b pb-1 mb-1">
          <div className="flex items-center gap-1">
            <Receipt className="h-4 w-4 text-freight-600" />
            <h1 className="font-bold text-xs">Recibo de Frete #{freight.id.substring(0, 8).toUpperCase()}</h1>
          </div>
          <div className="text-right">
            <p className="text-gray-600 text-[10px]">{formatDate(new Date().toISOString())}</p>
          </div>
        </div>

        {/* Dados Cliente e Motorista */}
        <div className="grid grid-cols-2 gap-1 mb-1 border-b pb-1 text-[10px]">
          <div>
            <p className="font-semibold flex items-center gap-1">
              <UserIcon className="h-3 w-3" />
              Cliente
            </p>
            <p>{client?.name || "N/A"}</p>
            <p>{client?.city}/{client?.state}</p>
          </div>
          {driver && (
            <div>
              <p className="font-semibold flex items-center gap-1">
                <Truck className="h-3 w-3" />
                Motorista
              </p>
              <p>{driver.name}</p>
              <p>{driver.licensePlate}</p>
            </div>
          )}
        </div>

        {/* Rota */}
        <div className="border-b pb-1 mb-1 text-[10px]">
          <div className="grid grid-cols-2 gap-1">
            <div>
              <p className="font-semibold">Origem:</p>
              <p>{freight.originCity}/{freight.originState}</p>
              <p className="text-gray-600">{formatDate(freight.departureDate)}</p>
            </div>
            <div>
              <p className="font-semibold">Destino:</p>
              <p>{freight.destinationCity}/{freight.destinationState}</p>
              <p className="text-gray-600">{formatDate(freight.arrivalDate)}</p>
            </div>
          </div>
        </div>

        {/* Valores */}
        <div className="space-y-0.5 text-[10px]">
          <div className="flex justify-between">
            <span>Frete</span>
            <span>{formatCurrency(freight.freightValue)}</span>
          </div>
          <div className="flex justify-between">
            <span>Diária</span>
            <span>{formatCurrency(freight.dailyRate)}</span>
          </div>
          <div className="flex justify-between">
            <span>Outros</span>
            <span>{formatCurrency(freight.otherCosts)}</span>
          </div>
          <div className="flex justify-between">
            <span>Pedágio</span>
            <span>{formatCurrency(freight.tollCosts)}</span>
          </div>
          <div className="flex justify-between font-bold pt-0.5 border-t">
            <span>Total</span>
            <span>{formatCurrency(freight.totalValue)}</span>
          </div>
        </div>
        
        {/* Pagamento */}
        {freight.pixKey && (
          <div className="mt-1 pt-1 border-t text-[9px]">
            <p className="font-semibold">Chave PIX:</p>
            <p className="break-all">{freight.pixKey}</p>
          </div>
        )}

        {/* Comprovante */}
        {freight.proofOfDeliveryImage && (
          <div className="mt-1 pt-1 border-t">
            <p className="font-semibold mb-0.5 text-[10px]">Comprovante de Entrega</p>
            <img 
              src={freight.proofOfDeliveryImage} 
              alt="Comprovante" 
              className="max-h-16 mx-auto"
            />
          </div>
        )}

        {/* Rodapé */}
        <div className="mt-2 pt-1 border-t flex justify-between items-center text-[8px] text-gray-500">
          <p className="max-w-[70%]">Este documento serve como comprovante de prestação de serviço de transporte.</p>
          <div className="text-right min-w-[80px]">
            <div className="border-b border-gray-400 h-6"></div>
            <p>Assinatura</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptGenerator;
