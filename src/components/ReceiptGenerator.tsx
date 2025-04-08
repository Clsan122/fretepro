import React, { useRef } from "react";
import { Freight, Client } from "@/types";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import { getClientsByUserId } from "@/utils/storage";
import { format } from "date-fns";
import { Truck, Printer } from "lucide-react";

interface ReceiptGeneratorProps {
  freight: Freight;
  clients: Client[];
}

const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({ freight, clients }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const client = clients.find((c) => c.id === freight.clientId);

  const handlePrint = useReactToPrint({
    documentTitle: `Recibo de Frete - ${client?.name || "Cliente"}`,
    onAfterPrint: () => console.log("Printed successfully"),
    documentTitle: `Recibo de Frete - ${client?.name || "Cliente"}`,
    onAfterPrint: () => console.log("Printed successfully"),
    content: () => componentRef.current,
  });

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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch {
      return "Data inválida";
    }
  };

  return (
    <div>
      <Button 
        onClick={() => handlePrint()}
        className="mb-4 flex items-center"
      >
        <Printer className="mr-2 h-4 w-4" />
        Imprimir Recibo
      </Button>

      <div className="hidden">
        <div ref={componentRef} className="p-8 max-w-4xl mx-auto bg-white">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Truck className="h-10 w-10 text-freight-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-800">Recibo de Frete</h1>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Data de Emissão</p>
              <p className="font-medium">{format(new Date(), "dd/MM/yyyy")}</p>
            </div>
          </div>

          <div className="border-t border-b border-gray-200 py-4 mb-6">
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
    </div>
  );
};

export default ReceiptGenerator;
