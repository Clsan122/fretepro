
import React from 'react';
import { QuotationData } from "../types";

interface InfoSectionsProps {
  quotation: QuotationData;
}

export const InfoSections: React.FC<InfoSectionsProps> = ({ quotation }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
      <div>
        <h2 className="text-sm font-semibold mb-1 text-freight-800 border-b border-freight-100 pb-1">Forma de Pagamento</h2>
        <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm text-xs h-[90%]">
          <p className="text-freight-700">
            À vista via PIX ou transferência bancária. Outras formas de pagamento podem ser negociadas.
          </p>
        </div>
      </div>
      
      <div>
        <h2 className="text-sm font-semibold mb-1 text-freight-800 border-b border-freight-100 pb-1">Observações</h2>
        <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm h-[90%]">
          <ul className="list-disc pl-4 space-y-0 text-freight-700 text-xs">
            <li>Este orçamento inclui seguro de carga conforme valor declarado da mercadoria.</li>
            <li>O prazo de entrega pode variar de acordo com condições climáticas e de tráfego.</li>
            {quotation.notes && (
              <li className="whitespace-pre-wrap">{quotation.notes}</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
