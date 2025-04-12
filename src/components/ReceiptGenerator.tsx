
import React, { useRef } from "react";
import { Freight, Client, User, Driver } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Truck, Download, User as UserIcon } from "lucide-react";
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

  const getBodyTypeLabel = (value: string) => {
    const types = {
      open: "Aberto",
      closed: "Fechado (Baú)",
      sider: "Fechado (Sider)",
      van: "Furgão",
      utility: "Utilitário",
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
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
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
      const margin = 10; // 10mm margin
      const availableWidth = pdfWidth - (margin * 2);
      const availableHeight = pdfHeight - (margin * 2);
      
      let ratio = Math.min(
        availableWidth / imgWidth, 
        availableHeight / imgHeight
      );
      
      // If the content is too small, don't scale it up too much
      ratio = Math.min(ratio, 1.2);
      
      // Calculate centered position
      const x = margin + (availableWidth - (imgWidth * ratio)) / 2;
      const y = margin;
      
      // Add the image to the PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(
        imgData, 
        'PNG', 
        x, 
        y, 
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
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <Button onClick={downloadReceipt} className="flex items-center">
          <Download className="mr-2 h-4 w-4" />
          Salvar como PDF
        </Button>
      </div>
      
      <div 
        ref={receiptRef} 
        className="p-8 max-w-[210mm] mx-auto bg-white border border-gray-200 shadow-sm"
        style={{ minHeight: '900px' }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Truck className="h-10 w-10 text-freight-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">Recibo de Frete</h1>
          </div>
          <div className="text-right">
            <p className="text-gray-500">Data de Emissão</p>
            <p className="font-medium">{format(new Date(), "dd/MM/yyyy", { locale: ptBR })}</p>
            <p className="text-gray-500 mt-1">Número do Frete</p>
            <p className="font-medium">#{freight.id.substring(0, 8).toUpperCase()}</p>
          </div>
        </div>

        {/* Dados do Cobrador */}
        <div className="border-t border-b border-gray-200 py-4 mb-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-freight-600" />
            Dados do Cobrador
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Nome:</span> {user?.name || "N/A"}</p>
              <p><span className="font-medium">CPF:</span> {user?.cpf || "N/A"}</p>
              <p><span className="font-medium">Telefone:</span> {user?.phone || "N/A"}</p>
              <p><span className="font-medium">Email:</span> {user?.email || "N/A"}</p>
            </div>
            <div>
              <p><span className="font-medium">Endereço:</span> {user?.address || "N/A"}</p>
              <p><span className="font-medium">Cidade/Estado:</span> {user?.city || "N/A"}/{user?.state || "N/A"}</p>
              <p><span className="font-medium">CEP:</span> {user?.zipCode || "N/A"}</p>
              <p><span className="font-medium">Data de Registro:</span> {formatDate(user?.createdAt || "")}</p>
            </div>
          </div>
        </div>

        {/* Dados do Motorista */}
        {driver && (
          <div className="border-b border-gray-200 py-4 mb-6">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-freight-600" />
              Dados do Motorista
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Nome:</span> {driver.name}</p>
                <p><span className="font-medium">CPF:</span> {driver.cpf}</p>
                <p><span className="font-medium">Data de Cadastro:</span> {formatDate(driver.createdAt)}</p>
              </div>
              <div>
                <p><span className="font-medium">Placa do Veículo:</span> {driver.licensePlate}</p>
                {driver.trailerPlate && (
                  <p><span className="font-medium">Placa do Reboque:</span> {driver.trailerPlate}</p>
                )}
                <p><span className="font-medium">Tipo de Veículo:</span> {getVehicleTypeLabel(driver.vehicleType)}</p>
                <p><span className="font-medium">Tipo de Carroceria:</span> {getBodyTypeLabel(driver.bodyType)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Dados do Cliente */}
        <div className="border-b border-gray-200 py-4 mb-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-freight-600" />
            Dados do Cliente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Nome:</span> {client?.name || "Cliente não encontrado"}</p>
              <p><span className="font-medium">Cidade:</span> {client?.city || "N/A"}</p>
            </div>
            <div>
              <p><span className="font-medium">Estado:</span> {client?.state || "N/A"}</p>
              <p><span className="font-medium">Data de Cadastro:</span> {formatDate(client?.createdAt || "")}</p>
            </div>
          </div>
        </div>

        {/* Informações do Transporte */}
        <div className="border-b border-gray-200 py-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Informações do Transporte</h2>
          <div className="grid grid-cols-2 gap-4">
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
        <div className="border-b border-gray-200 py-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Detalhes da Carga</h2>
          <div className="grid grid-cols-2 gap-4">
            <p><span className="font-medium">Tipo de Carga:</span> {getCargoTypeLabel(freight.cargoType)}</p>
            <p><span className="font-medium">Tipo de Veículo:</span> {getVehicleTypeLabel(freight.vehicleType)}</p>
            <p><span className="font-medium">Volumes:</span> {freight.volumes}</p>
            <p><span className="font-medium">Peso:</span> {freight.weight} kg</p>
            <p><span className="font-medium">Dimensões:</span> {freight.dimensions || "N/A"}</p>
            <p><span className="font-medium">Cubagem:</span> {freight.cubicMeasurement} m³</p>
          </div>
        </div>

        {/* Dados de Pagamento */}
        <div className="border-b border-gray-200 py-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Dados de Pagamento</h2>
          <div className="grid grid-cols-2 gap-4">
            <p><span className="font-medium">Chave PIX:</span> {freight.pixKey || "Não informado"}</p>
            <p><span className="font-medium">Prazo de Pagamento:</span> {getPaymentTermLabel(freight.paymentTerm)}</p>
            <p><span className="font-medium">Data de Registro:</span> {formatDate(freight.createdAt)}</p>
          </div>
        </div>

        {/* Composição do Valor */}
        <div className="mb-8 border-b border-gray-200 py-4">
          <h2 className="text-lg font-semibold mb-2">Composição do Valor</h2>
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2">Valor do Frete</td>
                <td className="py-2 text-right">R$ {freight.freightValue.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2">Diária</td>
                <td className="py-2 text-right">R$ {freight.dailyRate.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2">Outros Custos</td>
                <td className="py-2 text-right">R$ {freight.otherCosts.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2">Pedágio</td>
                <td className="py-2 text-right">R$ {freight.tollCosts.toFixed(2)}</td>
              </tr>
              <tr className="font-bold">
                <td className="py-2">Total</td>
                <td className="py-2 text-right">R$ {freight.totalValue.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Comprovante de Entrega */}
        {freight.proofOfDeliveryImage && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Comprovante de Entrega</h2>
            <div className="border rounded-md p-2 max-w-sm mx-auto">
              <img 
                src={freight.proofOfDeliveryImage} 
                alt="Comprovante de entrega" 
                className="max-h-64 mx-auto"
              />
            </div>
          </div>
        )}

        {/* Assinatura e Nota */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">Nota:</p>
              <p className="text-sm text-gray-600">Este documento serve como comprovante de prestação de serviço de transporte.</p>
            </div>
            <div className="text-right">
              <div className="h-16 border-b border-gray-400 w-48"></div>
              <p className="text-sm mt-1">Assinatura</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptGenerator;
