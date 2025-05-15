
import React from "react";
import { QuotationData } from "./types";
import { formatCurrency } from "@/utils/formatters";
import { PrintPreviewStyles } from "./PrintPreviewStyles";

interface QuotationPdfDocumentProps {
  quotation: QuotationData;
}

// Função auxiliar para traduzir o tipo de veículo
const getVehicleTypeInPortuguese = (vehicleType: string): string => {
  const vehicleTypes: Record<string, string> = {
    "van": "Van de Carga",
    "utility": "Utilitário Pequeno",
    "truck_small": "Caminhão 3/4",
    "truck_medium": "Caminhão Toco",
    "truck_large": "Caminhão Truck",
    "truck_extra": "Caminhão Bitruck",
    "trailer": "Carreta Simples",
    "trailer_extended": "Carreta Estendida",
    "trailer_refrigerated": "Carreta Refrigerada"
  };
  
  return vehicleTypes[vehicleType] || vehicleType;
};

export const QuotationPdfDocument: React.FC<QuotationPdfDocumentProps> = ({ quotation }) => {
  return (
    <div id="quotation-pdf" className="bg-white p-4 max-w-3xl mx-auto font-sans">
      <PrintPreviewStyles />
      
      {/* Cabeçalho com logo e informações da empresa */}
      <div className="flex justify-between items-start mb-4 border-b pb-2 print-tight-margins no-break">
        <div>
          <h1 className="text-lg font-bold text-freight-800">Cotação de Frete</h1>
          <p className="text-sm text-freight-600">Nº {quotation.orderNumber}</p>
          <p className="text-sm text-freight-600">Data: {new Date(quotation.createdAt).toLocaleDateString('pt-BR')}</p>
        </div>
        
        <div className="flex flex-col items-end">
          {quotation.creatorLogo && (
            <div className="w-20 mb-2">
              <img 
                src={quotation.creatorLogo} 
                alt="Logo da Transportadora" 
                className="max-h-16 object-contain" 
              />
            </div>
          )}
          <p className="font-semibold text-freight-800 text-sm">{quotation.creatorName}</p>
        </div>
      </div>
      
      {/* Informações de origem e destino */}
      <div className="grid grid-cols-2 gap-4 mb-4 bg-freight-50 p-3 rounded-md print-tight-margins no-break">
        <div>
          <h2 className="text-base font-semibold mb-1 text-freight-800">Origem</h2>
          <p className="text-freight-700 text-sm">{quotation.originCity} / {quotation.originState}</p>
        </div>
        <div>
          <h2 className="text-base font-semibold mb-1 text-freight-800">Destino</h2>
          <p className="text-freight-700 text-sm">{quotation.destinationCity} / {quotation.destinationState}</p>
        </div>
      </div>
      
      {/* Detalhes da carga */}
      <div className="mb-4 print-tight-margins no-break">
        <h2 className="text-base font-semibold mb-2 text-freight-800 border-b border-freight-200 pb-1">Detalhes da Carga</h2>
        <div className="bg-white border border-freight-200 rounded-md overflow-hidden print-compact">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-freight-200 bg-freight-50">
                <td className="py-2 px-3 font-medium text-freight-700" style={{ width: "25%" }}>Volumes:</td>
                <td className="py-2 px-3 text-freight-800" style={{ width: "25%" }}>{quotation.volumes}</td>
                <td className="py-2 px-3 font-medium text-freight-700" style={{ width: "25%" }}>Peso:</td>
                <td className="py-2 px-3 text-freight-800" style={{ width: "25%" }}>{quotation.weight} kg</td>
              </tr>
              <tr className="border-b border-freight-200">
                <td className="py-2 px-3 font-medium text-freight-700">Tipo de Carga:</td>
                <td className="py-2 px-3 text-freight-800">
                  {quotation.cargoType === "general" ? "Carga Geral" : 
                   quotation.cargoType === "fragile" ? "Carga Frágil" : 
                   quotation.cargoType === "perishable" ? "Perecíveis" : 
                   quotation.cargoType === "dangerous" ? "Carga Perigosa" : 
                   quotation.cargoType}
                </td>
                <td className="py-2 px-3 font-medium text-freight-700">Veículo:</td>
                <td className="py-2 px-3 text-freight-800">{getVehicleTypeInPortuguese(quotation.vehicleType) || "A definir"}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-freight-700">Valor da Mercadoria:</td>
                <td className="py-2 px-3 text-freight-800" colSpan={3}>
                  {formatCurrency(quotation.merchandiseValue)}
                </td>
              </tr>
              {quotation.measurements && quotation.measurements.length > 0 && (
                <tr className="border-t border-freight-200">
                  <td className="py-2 px-3 font-medium text-freight-700">Dimensões:</td>
                  <td className="py-2 px-3 text-freight-800" colSpan={3}>
                    <div className="space-y-1">
                      {quotation.measurements.map((measurement, index) => (
                        <div key={measurement.id} className="text-xs">
                          {index + 1}. {measurement.length} x {measurement.width} x {measurement.height} cm
                          {measurement.quantity > 1 ? ` (${measurement.quantity} volumes)` : ''}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Composição do Frete */}
      <div className="mb-4 print-tight-margins no-break">
        <h2 className="text-base font-semibold mb-2 text-freight-800 border-b border-freight-200 pb-1">Composição do Frete</h2>
        <div className="bg-white border border-freight-200 rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-freight-200">
                <td className="py-2 px-3 font-medium text-freight-700" style={{ width: "70%" }}>Valor do Frete:</td>
                <td className="py-2 px-3 text-freight-800 text-right" style={{ width: "30%" }}>{formatCurrency(quotation.freightValue)}</td>
              </tr>
              <tr className="border-b border-freight-200 bg-freight-50">
                <td className="py-2 px-3 font-medium text-freight-700">Pedágio:</td>
                <td className="py-2 px-3 text-freight-800 text-right">{formatCurrency(quotation.tollValue)}</td>
              </tr>
              <tr className="border-b border-freight-200">
                <td className="py-2 px-3 font-medium text-freight-700">
                  Seguro ({quotation.insuranceRate}%):
                </td>
                <td className="py-2 px-3 text-freight-800 text-right">{formatCurrency(quotation.insuranceValue)}</td>
              </tr>
              <tr className="border-b border-freight-200 bg-freight-50">
                <td className="py-2 px-3 font-medium text-freight-700">Outros Custos:</td>
                <td className="py-2 px-3 text-freight-800 text-right">{formatCurrency(quotation.otherCosts)}</td>
              </tr>
              <tr className="bg-freight-700 text-white">
                <td className="py-2 px-3 font-bold text-base">VALOR TOTAL:</td>
                <td className="py-2 px-3 font-bold text-right text-base">{formatCurrency(quotation.totalValue)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Observações */}
      {quotation.notes && (
        <div className="mb-4 bg-freight-50 p-3 rounded-md print-tight-margins no-break">
          <h2 className="text-base font-semibold mb-1 text-freight-800">Observações</h2>
          <p className="text-freight-700 whitespace-pre-wrap text-sm">{quotation.notes}</p>
        </div>
      )}
      
      {/* Rodapé */}
      <div className="mt-6 pt-2 border-t border-freight-200 text-center text-sm text-freight-500">
        <p>Esta cotação é válida por 7 dias a partir da data de emissão.</p>
      </div>
    </div>
  );
};
