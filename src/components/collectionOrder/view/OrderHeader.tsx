
import React from 'react';

interface OrderHeaderProps {
  createdAt: string;
  issuer: any;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({ createdAt, issuer }) => {
  return (
    <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          ORDEM DE COLETA
        </h1>
        <div className="text-sm text-gray-600">
          <p>Data: {createdAt}</p>
          {issuer && (
            <div className="mt-2">
              <p>Emissor: {issuer.name || 'N/A'}</p>
              {issuer.cpf && <p>CPF: {issuer.cpf}</p>}
              {issuer.cnpj && <p>CNPJ: {issuer.cnpj}</p>}
            </div>
          )}
        </div>
      </div>
      
      {issuer?.logo && (
        <div className="company-logo">
          <img 
            src={issuer.logo} 
            alt="Logo da empresa" 
            className="h-16 w-auto object-contain"
          />
        </div>
      )}
    </div>
  );
};
