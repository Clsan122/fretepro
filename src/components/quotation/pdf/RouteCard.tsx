
import React from 'react';
import { QuotationData } from "../types";

interface RouteCardProps {
  quotation: QuotationData;
}

export const RouteCard: React.FC<RouteCardProps> = ({ quotation }) => {
  return (
    <div className="mb-3">
      <h2 className="text-sm font-semibold mb-1 text-freight-800 border-b border-freight-100 pb-1">Rota</h2>
      <div className="flex flex-col sm:flex-row bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex-1 p-2 bg-gradient-to-br from-freight-50 to-freight-100">
          <p className="font-medium text-freight-700 mb-0 text-xs">Origem</p>
          <p className="text-freight-800 text-sm font-semibold">{quotation.originCity}</p>
          <p className="text-freight-700 text-xs">{quotation.originState}</p>
        </div>
        <div className="w-6 flex items-center justify-center bg-freight-50 py-1">
          <div className="w-4 h-4 text-freight-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
        <div className="flex-1 p-2 bg-gradient-to-br from-freight-50 to-freight-100">
          <p className="font-medium text-freight-700 mb-0 text-xs">Destino</p>
          <p className="text-freight-800 text-sm font-semibold">{quotation.destinationCity}</p>
          <p className="text-freight-700 text-xs">{quotation.destinationState}</p>
        </div>
      </div>
    </div>
  );
};
