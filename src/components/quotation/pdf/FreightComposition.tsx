
import React from 'react';
import { QuotationData } from "../types";
import { formatCurrency } from "@/utils/formatters";

interface FreightCompositionProps {
  quotation: QuotationData;
}

export const FreightComposition: React.FC<FreightCompositionProps> = ({ quotation }) => {
  return (
    <div className="mb-3">
      <h2 className="text-sm font-semibold mb-1 text-freight-800 border-b border-freight-100 pb-1">Composição do Frete</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-xs">
          <tbody>
            <tr className="border-b border-gray-200 hover:bg-freight-50 transition-colors">
              <td className="py-1 px-2 font-medium text-freight-800 w-2/3">Valor do Frete:</td>
              <td className="py-1 px-2 text-right text-freight-700 w-1/3 font-medium">{formatCurrency(quotation.freightValue)}</td>
            </tr>
            <tr className="border-b border-gray-200 bg-freight-50 hover:bg-freight-100 transition-colors">
              <td className="py-1 px-2 font-medium text-freight-800">Pedágio:</td>
              <td className="py-1 px-2 text-right text-freight-700 font-medium">{formatCurrency(quotation.tollValue)}</td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-freight-50 transition-colors">
              <td className="py-1 px-2 font-medium text-freight-800">
                Seguro ({quotation.insuranceRate}%):
              </td>
              <td className="py-1 px-2 text-right text-freight-700 font-medium">{formatCurrency(quotation.insuranceValue)}</td>
            </tr>
            <tr className="border-b border-gray-200 bg-freight-50 hover:bg-freight-100 transition-colors">
              <td className="py-1 px-2 font-medium text-freight-800">Outros Custos:</td>
              <td className="py-1 px-2 text-right text-freight-700 font-medium">{formatCurrency(quotation.otherCosts)}</td>
            </tr>
            <tr className="bg-freight-700 text-white">
              <td className="py-1 px-2 font-bold text-sm">VALOR TOTAL:</td>
              <td className="py-1 px-2 font-bold text-right text-sm">{formatCurrency(quotation.totalValue)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
