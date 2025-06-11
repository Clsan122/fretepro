
import React from 'react';
import { CollectionOrderFormData } from '../schema';

interface OrderHeaderProps {
  data: CollectionOrderFormData;
  companyLogo?: string;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({ data, companyLogo }) => {
  return (
    <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          ORDEM DE COLETA
        </h1>
        <div className="text-sm text-gray-600">
          <p>Ordem Nº: {data.orderNumber || 'N/A'}</p>
          <p>Data: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
      
      {companyLogo && (
        <div className="company-logo">
          <img 
            src={companyLogo} 
            alt="Logo da empresa" 
            className="h-16 w-auto object-contain"
          />
        </div>
      )}
    </div>
  );
};
