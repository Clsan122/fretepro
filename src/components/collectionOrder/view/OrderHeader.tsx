
import React from "react";

interface OrderHeaderProps {
  companyLogo?: string;
  createdAt: string;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({
  companyLogo,
  createdAt,
}) => {
  return (
    <div className="mb-3 print:mb-2">
      {companyLogo && (
        <div className="flex justify-center mb-2">
          <img
            src={companyLogo}
            alt="Logo da empresa"
            className="h-12 print:h-10 object-contain"
          />
        </div>
      )}
      
      <div className="text-center">
        <h2 className="text-xl print:text-lg font-bold text-freight-700">ORDEM DE COLETA</h2>
        <p className="text-gray-500 text-xs">Data: {createdAt}</p>
      </div>
    </div>
  );
};
