
import React, { useRef } from "react";
import { Freight, Client, User, Driver } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Truck, Download, User as UserIcon, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ReceiptGeneratorProps {
  freight: Freight;
  clients: Client[];
  user: User;
  driver?: Driver;
}

export const PrintStyles = () => {
  return (
    <style type="text/css" media="print">
      {`
        @page {
          size: A4;
          margin: 10mm;
        }
        body {
          font-size: 12px;
          background-color: white !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .print-hidden {
          display: none !important;
        }
        .card-compact .card-header {
          padding: 12px;
        }
        .card-compact .card-content {
          padding: 12px;
        }
        
        /* Hides all elements except the print container */
        body > *:not(.print-container) {
          display: none !important;
        }
        
        header, nav, footer, .sidebar, .bottom-navigation {
          display: none !important;
        }
        
        #receipt-print {
          width: 100%;
          max-width: 100%;
          box-shadow: none !important;
          padding: 5mm !important;
          margin: 0 !important;
          background-color: white !important;
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
  );
};

const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({ freight, clients, user, driver }) => {
  const client = clients.find((c) => c.id === freight.clientId);
  const receiptRef = useRef<HTMLDivElement>(null);

  const getCargoTypeLabel = (value: string) => {
    const types = {
      general: "Carga Geral",
      dangerous: "Carga Perigosa",
      liquid: "Carga Líquida",
      sackCargo: "Sacaria",
      drum: "Tambor",
      pallet: "Pallet",
    };
    return types[value as keyof typeof types] || value;
  };

  const getVehicleTypeLabel = (value: string) => {
    const types = {
      fiorino: "Fiorino",
      van: "Van",
      vlc: "VLC (Iveco, Sprinter, Master - Baú)",
      threeQuarter: "3/4",
      toco: "Toco",
      truck: "Truck",
      trailer: "Carreta",
    };
    return types[value as keyof typeof types] || value;
  };

  const getPaymentTermLabel = (value: string | undefined) => {
    if (!value) return "Não informado";
    
    const terms = {
      upfront: "À vista",
      tenDays: "10 dias",
      fifteenDays: "15 dias",
      twentyDays: "20 dias",
      thirtyDays: "30 dias",
      custom: "A combinar",
    };
    return terms[value as keyof typeof terms] || value;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return "Data inválida";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadReceipt = async () => {
    if (!receiptRef.current) return;
    
    try {
      // Create a PDF with A4 dimensions (210mm x 297mm)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Get dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      // Adjust scale for better quality and fit
      const scale = 2;
      const canvas = await html2canvas(receiptRef.current, { 
        scale: scale,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Calculate dimensions to fit content properly on the A4 page
      const imgWidth = canvas.width / scale;
      const imgHeight = canvas.height / scale;
      
      // Calculate scaling to fit content on the page with margins
      const margin = 5; // Smaller margin to maximize space
      const availableWidth = pdfWidth - (margin * 2);
      
      // Calculate the aspect ratio to maintain proportions
      const ratio = availableWidth / imgWidth;
      
      // Add the image to the PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(
        imgData, 
        'PNG', 
        margin, 
        margin, 
        imgWidth * ratio, 
        imgHeight * ratio
      );
      
      // Save the PDF
      pdf.save(`recibo-frete-${freight.id.substring(0, 8)}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    }
  };

  return (
    <div className="p-2 md:p-4 print-container">
      <div className="flex justify-end mb-2 md:mb-4 print-hidden">
        <Button 
          onClick={handlePrint} 
          className="flex items-center mr-2"
          variant="outline"
        >
          <Printer className="mr-2 h-4 w-4" />
          Imprimir
        </Button>
        <Button onClick={downloadReceipt} className="flex items-center">
          <Download className="mr-2 h-4 w-4" />
          Salvar como PDF
        </Button>
      </div>
      
      <PrintStyles />
      
      <div 
        ref={receiptRef} 
        id="receipt-print"
        className="p-4 md:p-6 max-w-[210mm] mx-auto bg-white border border-gray-200 shadow-sm text-sm print:border-0 print:shadow-none"
        style={{ minHeight: '900px' }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-freight-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">Recibo de Frete</h1>
          </div>
          <div className="text-right text-xs">
            <p className="text-gray-500">Data de Emissão</p>
            <p className="font-medium">{format(new Date(), "dd/MM/yyyy", { locale: ptBR })}</p>
            <p className="text-gray-500 mt-1">Número do Frete</p>
            <p className="font-medium">#{freight.id.substring(0, 8).toUpperCase()}</p>
          </div>
        </div>

        {/* Dados do Cobrador */}
        <div className="border-t border-b border-gray-200 py-2 mb-3 text-xs">
          <h2 className="text-sm font-semibold mb-1 flex items-center">
            <UserIcon className="h-4 w-4 mr-1 text-freight-600" />
            Dados do Cobrador
          </h2>
          <div className="grid grid-cols-2 gap-1">
            <div>
              <p><span className="font-medium">Nome:</span> {user?.name || "N/A"}</p>
              <p><span className="font-medium">CPF:</span> {user?.cpf || "N/A"}</p>
              <p><span className="font-medium">Telefone:</span> {user?.phone || "N/A"}</p>
            </div>
            <div>
              <p><span className="font-medium">Email:</span> {user?.email || "N/A"}</p>
              <p><span className="font-medium">Cidade/UF:</span> {user?.city || "N/A"}/{user?.state || "N/A"}</p>
              <p><span className="font-medium">Data:</span> {formatDate(user?.createdAt || "")}</p>
            </div>
          </div>
        </div>

        {/* Dados do Motorista */}
        {driver && (
          <div className="border-b border-gray-200 py-2 mb-3 text-xs">
            <h2 className="text-sm font-semibold mb-1 flex items-center">
              <Truck className="h-4 w-4 mr-1 text-freight-600" />
              Dados do Motorista
            </h2>
            <div className="grid grid-cols-2 gap-1">
              <div>
                <p><span className="font-medium">Nome:</span> {driver.name}</p>
                <p><span className="font-medium">CPF:</span> {driver.cpf}</p>
              </div>
              <div>
                <p><span className="font-medium">Placa:</span> {driver.licensePlate}</p>
                <p><span className="font-medium">Veículo:</span> {getVehicleTypeLabel(driver.vehicleType)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Dados do Cliente */}
        <div className="border-b border-gray-200 py-2 mb-3 text-xs">
          <h2 className="text-sm font-semibold mb-1 flex items-center">
            <UserIcon className="h-4 w-4 mr-1 text-freight-600" />
            Dados do Cliente
          </h2>
          <div className="grid grid-cols-2 gap-1">
            <div>
              <p><span className="font-medium">Nome:</span> {client?.name || "Cliente não encontrado"}</p>
            </div>
            <div>
              <p><span className="font-medium">Cidade/UF:</span> {client?.city || "N/A"}/{client?.state || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Informações do Transporte */}
        <div className="border-b border-gray-200 py-2 mb-3 text-xs">
          <h2 className="text-sm font-semibold mb-1">Informações do Transporte</h2>
          <div className="grid grid-cols-2 gap-1">
            <div>
              <p><span className="font-medium">Origem:</span> {freight.originCity}/{freight.originState}</p>
              <p><span className="font-medium">Data de Saída:</span> {formatDate(freight.departureDate)}</p>
            </div>
            <div>
              <p><span className="font-medium">Destino:</span> {freight.destinationCity}/{freight.destinationState}</p>
              <p><span className="font-medium">Data de Chegada:</span> {formatDate(freight.arrivalDate)}</p>
            </div>
          </div>
        </div>

        {/* Detalhes da Carga */}
        <div className="border-b border-gray-200 py-2 mb-3 text-xs">
          <h2 className="text-sm font-semibold mb-1">Detalhes da Carga</h2>
          <div className="grid grid-cols-2 gap-1">
            <p><span className="font-medium">Tipo de Carga:</span> {getCargoTypeLabel(freight.cargoType)}</p>
            <p><span className="font-medium">Tipo de Veículo:</span> {getVehicleTypeLabel(freight.vehicleType)}</p>
            <p><span className="font-medium">Volumes:</span> {freight.volumes}</p>
            <p><span className="font-medium">Peso:</span> {freight.weight} kg</p>
            <p><span className="font-medium">Dimensões:</span> {freight.dimensions || "N/A"}</p>
          </div>
        </div>

        {/* Dados de Pagamento */}
        <div className="border-b border-gray-200 py-2 mb-3 text-xs">
          <h2 className="text-sm font-semibold mb-1">Dados de Pagamento</h2>
          <div className="grid grid-cols-2 gap-1">
            <p><span className="font-medium">Chave PIX:</span> {freight.pixKey || "Não informado"}</p>
            <p><span className="font-medium">Prazo:</span> {getPaymentTermLabel(freight.paymentTerm)}</p>
          </div>
        </div>

        {/* Composição do Valor */}
        <div className="mb-3 border-b border-gray-200 py-2 text-xs">
          <h2 className="text-sm font-semibold mb-1">Composição do Valor</h2>
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-1">Valor do Frete</td>
                <td className="py-1 text-right">R$ {freight.freightValue.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1">Diária</td>
                <td className="py-1 text-right">R$ {freight.dailyRate.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1">Outros Custos</td>
                <td className="py-1 text-right">R$ {freight.otherCosts.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1">Pedágio</td>
                <td className="py-1 text-right">R$ {freight.tollCosts.toFixed(2)}</td>
              </tr>
              <tr className="font-bold">
                <td className="py-1">Total</td>
                <td className="py-1 text-right">R$ {freight.totalValue.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Comprovante de Entrega */}
        {freight.proofOfDeliveryImage && (
          <div className="mb-3 text-xs">
            <h2 className="text-sm font-semibold mb-1">Comprovante de Entrega</h2>
            <div className="border rounded-md p-1 max-w-[120px] mx-auto">
              <img 
                src={freight.proofOfDeliveryImage} 
                alt="Comprovante de entrega" 
                className="max-h-32 mx-auto"
              />
            </div>
          </div>
        )}

        {/* Assinatura e Nota */}
        <div className="mt-4 pt-2 border-t border-gray-200 text-xs">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">Nota:</p>
              <p className="text-xs text-gray-600">Este documento serve como comprovante de prestação de serviço de transporte.</p>
            </div>
            <div className="text-right">
              <div className="h-10 border-b border-gray-400 w-32"></div>
              <p className="text-xs mt-1">Assinatura</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptGenerator;
