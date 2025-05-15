
import React from "react";
import { QuotationData } from "./types";
import { formatCurrency } from "@/utils/formatters";
import { PrintPreviewStyles } from "./PrintPreviewStyles";

interface QuotationPdfDocumentProps {
  quotation: QuotationData;
}

export const QuotationPdfDocument: React.FC<QuotationPdfDocumentProps> = ({ quotation }) => {
  return (
    <div id="quotation-pdf" className="bg-white p-1 max-w-3xl mx-auto font-sans">
      <PrintPreviewStyles />
      
      {/* Cabeçalho com logo e informações da empresa */}
      <div className="flex justify-between items-start mb-0.5 border-b pb-0.5 print-tight-margins no-break">
        <div>
          <h1 className="text-xs font-bold text-freight-800">Cotação de Frete</h1>
          <p className="text-[6px] text-freight-600">Nº {quotation.orderNumber}</p>
          <p className="text-[6px] text-freight-600">Data: {new Date(quotation.createdAt).toLocaleDateString('pt-BR')}</p>
        </div>
        
        <div className="flex flex-col items-end">
          {quotation.creatorLogo && (
            <div className="w-10 mb-0.5">
              <img 
                src={quotation.creatorLogo} 
                alt="Logo da Transportadora" 
                className="max-h-6 object-contain" 
              />
            </div>
          )}
          <p className="font-semibold text-freight-800 text-[6px]">{quotation.creatorName}</p>
        </div>
      </div>
      
      {/* Informações de origem e destino */}
      <div className="grid grid-cols-2 gap-0.5 mb-0.5 bg-freight-50 p-0.5 rounded-sm print-tight-margins no-break">
        <div>
          <h2 className="text-[6px] font-semibold mb-0 text-freight-800">Origem</h2>
          <p className="text-freight-700 text-[6px]">{quotation.originCity} / {quotation.originState}</p>
        </div>
        <div>
          <h2 className="text-[6px] font-semibold mb-0 text-freight-800">Destino</h2>
          <p className="text-freight-700 text-[6px]">{quotation.destinationCity} / {quotation.destinationState}</p>
        </div>
      </div>
      
      {/* Detalhes da carga */}
      <div className="mb-0.5 print-tight-margins no-break">
        <h2 className="text-[6px] font-semibold mb-0 text-freight-800 border-b border-freight-200 pb-0">Detalhes da Carga</h2>
        <div className="bg-white border border-freight-200 rounded-sm overflow-hidden print-compact">
          <table className="w-full text-[6px]">
            <tbody>
              <tr className="border-b border-freight-200 bg-freight-50">
                <td className="py-0 px-0.5 font-medium text-freight-700" style={{ width: "25%" }}>Volumes:</td>
                <td className="py-0 px-0.5 text-freight-800" style={{ width: "25%" }}>{quotation.volumes}</td>
                <td className="py-0 px-0.5 font-medium text-freight-700" style={{ width: "25%" }}>Peso:</td>
                <td className="py-0 px-0.5 text-freight-800" style={{ width: "25%" }}>{quotation.weight} kg</td>
              </tr>
              <tr className="border-b border-freight-200">
                <td className="py-0 px-0.5 font-medium text-freight-700">Tipo de Carga:</td>
                <td className="py-0 px-0.5 text-freight-800">
                  {quotation.cargoType === "general" ? "Carga Geral" : 
                   quotation.cargoType === "fragile" ? "Carga Frágil" : 
                   quotation.cargoType === "perishable" ? "Perecíveis" : 
                   quotation.cargoType === "dangerous" ? "Carga Perigosa" : 
                   quotation.cargoType}
                </td>
                <td className="py-0 px-0.5 font-medium text-freight-700">Veículo:</td>
                <td className="py-0 px-0.5 text-freight-800">{quotation.vehicleType || "A definir"}</td>
              </tr>
              <tr>
                <td className="py-0 px-0.5 font-medium text-freight-700">Valor da Mercadoria:</td>
                <td className="py-0 px-0.5 text-freight-800" colSpan={3}>
                  {formatCurrency(quotation.merchandiseValue)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {quotation.measurements && quotation.measurements.length > 0 && (
          <div className="mt-0.5 no-break">
            <h3 className="text-[6px] font-medium mb-0 text-freight-700">Dimensões:</h3>
            <div className="overflow-auto">
              <table className="w-full text-[6px] border-collapse">
                <thead>
                  <tr className="bg-freight-100">
                    <th className="py-0 px-0.5 text-left text-[5px]" style={{ width: "25%" }}>Comp. (cm)</th>
                    <th className="py-0 px-0.5 text-left text-[5px]" style={{ width: "25%" }}>Larg. (cm)</th>
                    <th className="py-0 px-0.5 text-left text-[5px]" style={{ width: "25%" }}>Alt. (cm)</th>
                    <th className="py-0 px-0.5 text-left text-[5px]" style={{ width: "25%" }}>Qtd</th>
                  </tr>
                </thead>
                <tbody>
                  {quotation.measurements.map((m, idx) => (
                    <tr key={m.id || idx} className={idx % 2 === 0 ? "bg-white" : "bg-freight-50"}>
                      <td className="py-0 px-0.5 text-[5px]">{m.length}</td>
                      <td className="py-0 px-0.5 text-[5px]">{m.width}</td>
                      <td className="py-0 px-0.5 text-[5px]">{m.height}</td>
                      <td className="py-0 px-0.5 text-[5px]">{m.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {/* Composição do Frete */}
      <div className="mb-0.5 print-tight-margins no-break">
        <h2 className="text-[6px] font-semibold mb-0 text-freight-800 border-b border-freight-200 pb-0">Composição do Frete</h2>
        <div className="bg-white border border-freight-200 rounded-sm overflow-hidden">
          <table className="w-full text-[6px]">
            <tbody>
              <tr className="border-b border-freight-200">
                <td className="py-0 px-0.5 font-medium text-freight-700" style={{ width: "70%" }}>Valor do Frete:</td>
                <td className="py-0 px-0.5 text-freight-800 text-right" style={{ width: "30%" }}>{formatCurrency(quotation.freightValue)}</td>
              </tr>
              <tr className="border-b border-freight-200 bg-freight-50">
                <td className="py-0 px-0.5 font-medium text-freight-700">Pedágio:</td>
                <td className="py-0 px-0.5 text-freight-800 text-right">{formatCurrency(quotation.tollValue)}</td>
              </tr>
              <tr className="border-b border-freight-200">
                <td className="py-0 px-0.5 font-medium text-freight-700">
                  Seguro ({quotation.insuranceRate}%):
                </td>
                <td className="py-0 px-0.5 text-freight-800 text-right">{formatCurrency(quotation.insuranceValue)}</td>
              </tr>
              <tr className="border-b border-freight-200 bg-freight-50">
                <td className="py-0 px-0.5 font-medium text-freight-700">Outros Custos:</td>
                <td className="py-0 px-0.5 text-freight-800 text-right">{formatCurrency(quotation.otherCosts)}</td>
              </tr>
              <tr className="bg-freight-700 text-white">
                <td className="py-0 px-0.5 font-bold text-[6px]">VALOR TOTAL:</td>
                <td className="py-0 px-0.5 font-bold text-right text-[6px]">{formatCurrency(quotation.totalValue)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Observações */}
      {quotation.notes && (
        <div className="mb-0.5 bg-freight-50 p-0.5 rounded-sm print-tight-margins no-break">
          <h2 className="text-[6px] font-semibold mb-0 text-freight-800">Observações</h2>
          <p className="text-freight-700 whitespace-pre-wrap text-[5px]">{quotation.notes}</p>
        </div>
      )}
      
      {/* Rodapé */}
      <div className="mt-0.5 pt-0.5 border-t border-freight-200 text-center text-[5px] text-freight-500">
        <p>Esta cotação é válida por 7 dias a partir da data de emissão.</p>
      </div>
    </div>
  );
};
