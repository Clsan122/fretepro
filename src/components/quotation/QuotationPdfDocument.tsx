
import React from "react";
import { QuotationData } from "./types";
import { formatCurrency } from "@/utils/formatters";

interface QuotationPdfDocumentProps {
  quotation: QuotationData;
}

export const QuotationPdfDocument: React.FC<QuotationPdfDocumentProps> = ({ quotation }) => {
  return (
    <div id="quotation-pdf" className="bg-white p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cotação de Frete</h1>
          <p className="text-gray-600">Nº {quotation.orderNumber}</p>
          <p className="text-gray-600">Data: {new Date(quotation.createdAt).toLocaleDateString('pt-BR')}</p>
        </div>
        
        {quotation.creatorLogo && (
          <div className="w-32">
            <img 
              src={quotation.creatorLogo} 
              alt="Logo" 
              className="max-h-20 object-contain" 
            />
          </div>
        )}
      </div>
      
      <div className="border-t border-b border-gray-200 py-4 mb-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Dados do Emissor</h2>
        <p className="text-gray-700">{quotation.creatorName}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Origem</h2>
          <p className="text-gray-700">{quotation.originCity} / {quotation.originState}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Destino</h2>
          <p className="text-gray-700">{quotation.destinationCity} / {quotation.destinationState}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Detalhes da Carga</h2>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-medium text-gray-600">Volumes:</td>
              <td className="py-2 text-gray-700">{quotation.volumes}</td>
              <td className="py-2 font-medium text-gray-600">Peso:</td>
              <td className="py-2 text-gray-700">{quotation.weight} kg</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-medium text-gray-600">Tipo de Carga:</td>
              <td className="py-2 text-gray-700">{quotation.cargoType}</td>
              <td className="py-2 font-medium text-gray-600">Veículo:</td>
              <td className="py-2 text-gray-700">{quotation.vehicleType || "Não especificado"}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-medium text-gray-600">Valor da Mercadoria:</td>
              <td className="py-2 text-gray-700" colSpan={3}>
                {formatCurrency(quotation.merchandiseValue)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Composição do Frete</h2>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-medium text-gray-600">Valor do Frete:</td>
              <td className="py-2 text-gray-700">{formatCurrency(quotation.freightValue)}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-medium text-gray-600">Pedágio:</td>
              <td className="py-2 text-gray-700">{formatCurrency(quotation.tollValue)}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-medium text-gray-600">
                Seguro ({quotation.insuranceRate}%):
              </td>
              <td className="py-2 text-gray-700">{formatCurrency(quotation.insuranceValue)}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-medium text-gray-600">Outros Custos:</td>
              <td className="py-2 text-gray-700">{formatCurrency(quotation.otherCosts)}</td>
            </tr>
            <tr>
              <td className="py-2 font-bold text-gray-800">TOTAL:</td>
              <td className="py-2 font-bold text-gray-800">{formatCurrency(quotation.totalValue)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {quotation.notes && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Observações</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{quotation.notes}</p>
        </div>
      )}
      
      <div className="mt-16 text-center text-sm text-gray-500">
        <p>Esta cotação é válida por 7 dias a partir da data de emissão.</p>
        <p className="mt-2">
          Status: {quotation.status === "closed" ? "Fechada" : "Aberta"}
        </p>
      </div>
    </div>
  );
};
