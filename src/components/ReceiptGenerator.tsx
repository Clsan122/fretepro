
import React, { useRef } from "react";
import { Freight, Client, User, Driver } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Receipt, Download, User as UserIcon, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ReceiptGeneratorProps {
  freight: Freight;
  clients: Client[];
  user: User;
  driver?: Driver;
}

const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({ freight, clients, user, driver }) => {
  const client = clients.find((c) => c.id === freight.clientId);
  const receiptRef = useRef<HTMLDivElement>(null);

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

  const downloadReceipt = async () => {
    if (!receiptRef.current) return;
    
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5', // Changed to A5 for more compact size
      });
      
      const scale = 2;
      const canvas = await html2canvas(receiptRef.current, { 
        scale: scale,
        useCORS: true,
        logging: false,
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
      
      pdf.save(`recibo-frete-${freight.id.substring(0, 8)}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    }
  };

  return (
    <div className="p-2 max-w-2xl mx-auto">
      <Button onClick={downloadReceipt} className="w-full mb-4 flex items-center justify-center gap-2">
        <Download className="h-4 w-4" />
        Baixar PDF
      </Button>
      
      <div 
        ref={receiptRef} 
        className="bg-white border rounded-lg shadow-sm p-4 text-xs"
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b pb-2 mb-2">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-freight-600" />
            <h1 className="font-bold">Recibo de Frete #{freight.id.substring(0, 8).toUpperCase()}</h1>
          </div>
          <div className="text-right">
            <p className="text-gray-600">{formatDate(new Date().toISOString())}</p>
          </div>
        </div>

        {/* Dados Cliente e Motorista */}
        <div className="grid grid-cols-2 gap-2 mb-2 border-b pb-2">
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
        <div className="border-b pb-2 mb-2">
          <div className="grid grid-cols-2 gap-2">
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
        <div className="space-y-1">
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
          <div className="flex justify-between font-bold pt-1 border-t">
            <span>Total</span>
            <span>{formatCurrency(freight.totalValue)}</span>
          </div>
        </div>
        
        {/* Pagamento */}
        {freight.pixKey && (
          <div className="mt-2 pt-2 border-t text-xs">
            <p className="font-semibold">Chave PIX:</p>
            <p className="break-all">{freight.pixKey}</p>
          </div>
        )}

        {/* Comprovante */}
        {freight.proofOfDeliveryImage && (
          <div className="mt-2 pt-2 border-t">
            <p className="font-semibold mb-1">Comprovante de Entrega</p>
            <img 
              src={freight.proofOfDeliveryImage} 
              alt="Comprovante" 
              className="max-h-24 mx-auto"
            />
          </div>
        )}

        {/* Rodapé */}
        <div className="mt-4 pt-2 border-t flex justify-between items-center text-[10px] text-gray-500">
          <p>Este documento serve como comprovante de prestação de serviço de transporte.</p>
          <div className="text-right min-w-[80px]">
            <div className="border-b border-gray-400 h-8"></div>
            <p>Assinatura</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptGenerator;
