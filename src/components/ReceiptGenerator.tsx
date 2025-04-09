
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
      const canvas = await html2canvas(receiptRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`recibo-frete-${freight.id}.pdf`);
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
      
      <div ref={receiptRef} className="p-8 max-w-4xl mx-auto bg-white">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Truck className="h-10 w-10 text-freight-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">Recibo de Frete</h1>
          </div>
          <div className="text-right">
            <p className="text-gray-500">Data de Emissão</p>
            <p className="font-medium">{format(new Date(), "dd/MM/yyyy", { locale: ptBR })}</p>
          </div>
        </div>

        {/* Dados do Cobrador/Motorista */}
        <div className="border-t border-b border-gray-200 py-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Dados do Cobrador</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Nome:</span> {user?.name || "N/A"}</p>
              <p><span className="font-medium">CPF:</span> {user?.cpf || "N/A"}</p>
              <p><span className="font-medium">Telefone:</span> {user?.phone || "N/A"}</p>
            </div>
            <div>
              <p><span className="font-medium">Endereço:</span> {user?.address || "N/A"}</p>
              <p><span className="font-medium">Cidade/Estado:</span> {user?.city || "N/A"}/{user?.state || "N/A"}</p>
              <p><span className="font-medium">CEP:</span> {user?.zipCode || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Dados do Motorista */}
        {driver && (
          <div className="border-b border-gray-200 py-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">Dados do Motorista</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Nome:</span> {driver.name}</p>
                <p><span className="font-medium">CPF:</span> {driver.cpf}</p>
              </div>
              <div>
                <p><span className="font-medium">Placa:</span> {driver.licensePlate} {driver.trailerPlate && `/ ${driver.trailerPlate}`}</p>
                <p><span className="font-medium">Tipo de Veículo:</span> {getVehicleTypeLabel(driver.vehicleType)}</p>
                <p><span className="font-medium">Tipo de Carroceria:</span> {getBodyTypeLabel(driver.bodyType)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="border-b border-gray-200 py-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Dados do Cliente</h2>
          <p><span className="font-medium">Nome:</span> {client?.name || "Cliente não encontrado"}</p>
          <p><span className="font-medium">Localização:</span> {client?.city || "N/A"} - {client?.state || "N/A"}</p>
        </div>

        <div className="mb-6">
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

        <div className="mb-6">
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
        {(freight.pixKey || freight.paymentTerm) && (
          <div className="mb-6 border-t border-gray-200 pt-4">
            <h2 className="text-lg font-semibold mb-2">Dados de Pagamento</h2>
            <div className="grid grid-cols-2 gap-4">
              {freight.pixKey && (
                <p><span className="font-medium">Chave PIX:</span> {freight.pixKey}</p>
              )}
              {freight.paymentTerm && (
                <p><span className="font-medium">Prazo de Pagamento:</span> {getPaymentTermLabel(freight.paymentTerm)}</p>
              )}
            </div>
          </div>
        )}

        <div className="mb-8">
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
