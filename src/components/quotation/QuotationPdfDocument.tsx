
import React from "react";
import { QuotationData } from "./types";
import { formatCurrency } from "@/utils/formatters";
import { PrintPreviewStyles } from "./PrintPreviewStyles";

interface QuotationPdfDocumentProps {
  quotation: QuotationData;
}

export const QuotationPdfDocument: React.FC<QuotationPdfDocumentProps> = ({ quotation }) => {
  return (
    <div id="quotation-pdf" className="bg-white p-6 max-w-3xl mx-auto font-sans">
      <PrintPreviewStyles />
      
      {/* Cabeçalho com logo e informações da empresa */}
      <div className="flex justify-between items-start mb-3 border-b pb-2 print-tight-margins">
        <div>
          <h1 className="text-xl font-bold text-freight-800">Cotação de Frete</h1>
          <p className="text-sm text-freight-600">Nº {quotation.orderNumber}</p>
          <p className="text-sm text-freight-600">Data: {new Date(quotation.createdAt).toLocaleDateString('pt-BR')}</p>
        </div>
        
        <div className="flex flex-col items-end">
          {quotation.creatorLogo && (
            <div className="w-20 mb-1">
              <img 
                src={quotation.creatorLogo} 
                alt="Logo da Transportadora" 
                className="max-h-14 object-contain" 
              />
            </div>
          )}
          <p className="font-semibold text-freight-800 text-sm">{quotation.creatorName}</p>
        </div>
      </div>
      
      {/* Informações de origem e destino */}
      <div className="grid grid-cols-2 gap-2 mb-2 bg-freight-50 p-2 rounded-lg print-tight-margins">
        <div>
          <h2 className="text-xs font-semibold mb-0 text-freight-800">Origem</h2>
          <p className="text-freight-700 font-medium text-xs">{quotation.originCity} / {quotation.originState}</p>
        </div>
        <div>
          <h2 className="text-xs font-semibold mb-0 text-freight-800">Destino</h2>
          <p className="text-freight-700 font-medium text-xs">{quotation.destinationCity} / {quotation.destinationState}</p>
        </div>
      </div>
      
      {/* Detalhes da carga */}
      <div className="mb-2 print-tight-margins">
        <h2 className="text-xs font-semibold mb-1 text-freight-800 border-b border-freight-200 pb-1">Detalhes da Carga</h2>
        <div className="bg-white border border-freight-200 rounded-lg overflow-hidden print-compact">
          <table className="w-full text-xs">
            <tbody>
              <tr className="border-b border-freight-200 bg-freight-50">
                <td className="py-0 px-2 font-medium text-freight-700">Volumes:</td>
                <td className="py-0 px-2 text-freight-800">{quotation.volumes}</td>
                <td className="py-0 px-2 font-medium text-freight-700">Peso:</td>
                <td className="py-0 px-2 text-freight-800">{quotation.weight} kg</td>
              </tr>
              <tr className="border-b border-freight-200">
                <td className="py-0 px-2 font-medium text-freight-700">Tipo de Carga:</td>
                <td className="py-0 px-2 text-freight-800">
                  {quotation.cargoType === "general" ? "Carga Geral" : 
                   quotation.cargoType === "fragile" ? "Carga Frágil" : 
                   quotation.cargoType === "perishable" ? "Perecíveis" : 
                   quotation.cargoType === "dangerous" ? "Carga Perigosa" : 
                   quotation.cargoType}
                </td>
                <td className="py-0 px-2 font-medium text-freight-700">Veículo:</td>
                <td className="py-0 px-2 text-freight-800">{quotation.vehicleType || "A definir"}</td>
              </tr>
              <tr>
                <td className="py-0 px-2 font-medium text-freight-700">Valor da Mercadoria:</td>
                <td className="py-0 px-2 text-freight-800" colSpan={3}>
                  {formatCurrency(quotation.merchandiseValue)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {quotation.measurements && quotation.measurements.length > 0 && (
          <div className="mt-1">
            <h3 className="text-xs font-medium mb-0 text-freight-700">Dimensões:</h3>
            <div className="overflow-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-freight-100">
                    <th className="py-0 px-2 text-left text-xs">Comp. (cm)</th>
                    <th className="py-0 px-2 text-left text-xs">Larg. (cm)</th>
                    <th className="py-0 px-2 text-left text-xs">Alt. (cm)</th>
                    <th className="py-0 px-2 text-left text-xs">Qtd</th>
                  </tr>
                </thead>
                <tbody>
                  {quotation.measurements.map((m, idx) => (
                    <tr key={m.id || idx} className={idx % 2 === 0 ? "bg-white" : "bg-freight-50"}>
                      <td className="py-0 px-2 text-xs">{m.length}</td>
                      <td className="py-0 px-2 text-xs">{m.width}</td>
                      <td className="py-0 px-2 text-xs">{m.height}</td>
                      <td className="py-0 px-2 text-xs">{m.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {/* Composição do Frete */}
      <div className="mb-2 print-tight-margins">
        <h2 className="text-xs font-semibold mb-1 text-freight-800 border-b border-freight-200 pb-1">Composição do Frete</h2>
        <div className="bg-white border border-freight-200 rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <tbody>
              <tr className="border-b border-freight-200">
                <td className="py-0 px-2 font-medium text-freight-700">Valor do Frete:</td>
                <td className="py-0 px-2 text-freight-800 text-right">{formatCurrency(quotation.freightValue)}</td>
              </tr>
              <tr className="border-b border-freight-200 bg-freight-50">
                <td className="py-0 px-2 font-medium text-freight-700">Pedágio:</td>
                <td className="py-0 px-2 text-freight-800 text-right">{formatCurrency(quotation.tollValue)}</td>
              </tr>
              <tr className="border-b border-freight-200">
                <td className="py-0 px-2 font-medium text-freight-700">
                  Seguro ({quotation.insuranceRate}%):
                </td>
                <td className="py-0 px-2 text-freight-800 text-right">{formatCurrency(quotation.insuranceValue)}</td>
              </tr>
              <tr className="border-b border-freight-200 bg-freight-50">
                <td className="py-0 px-2 font-medium text-freight-700">Outros Custos:</td>
                <td className="py-0 px-2 text-freight-800 text-right">{formatCurrency(quotation.otherCosts)}</td>
              </tr>
              <tr className="bg-freight-700 text-white">
                <td className="py-1 px-2 font-bold">VALOR TOTAL:</td>
                <td className="py-1 px-2 font-bold text-right">{formatCurrency(quotation.totalValue)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Observações */}
      {quotation.notes && (
        <div className="mb-2 bg-freight-50 p-2 rounded-lg print-tight-margins">
          <h2 className="text-xs font-semibold mb-0 text-freight-800">Observações</h2>
          <p className="text-freight-700 whitespace-pre-wrap text-xs">{quotation.notes}</p>
        </div>
      )}
      
      {/* Rodapé */}
      <div className="mt-2 pt-1 border-t border-freight-200 text-center text-xs text-freight-500">
        <p>Esta cotação é válida por 7 dias a partir da data de emissão.</p>
      </div>
    </div>
  );
};
