
import React from "react";

interface OrderHeaderProps {
  companyLogo?: string;
  createdAt: string;
  clientName?: string;
  clientLogo?: string;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({
  clientLogo,
  createdAt,
  clientName,
}) => {
  return (
    <div className="mb-3 print:mb-2">
      {clientLogo && (
        <div className="flex justify-center mb-2">
          <img
            src={clientLogo}
            alt="Logo do cliente"
            className="h-12 print:h-10 object-contain"
          />
        </div>
      )}
      
      <div className="text-center">
        <h2 className="text-xl print:text-lg font-bold text-freight-700">ORDEM DE COLETA</h2>
        <p className="text-gray-500 text-xs">Data: {createdAt}</p>
        {clientName && <p className="font-medium text-xs">Solicitante: {clientName}</p>}
      </div>
    </div>
  );
};
