
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface OrderHeaderProps {
  companyLogo?: string;
  createdAt: string;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({
  companyLogo,
  createdAt,
}) => {
  return (
    <>
      {companyLogo && (
        <div className="flex justify-center mb-4 print:mb-2">
          <img
            src={companyLogo}
            alt="Logo da empresa"
            className="h-16 print:h-14 object-contain"
          />
        </div>
      )}
      
      <div className="text-center mb-4 print:mb-2">
        <h2 className="text-2xl print:text-xl font-bold text-freight-700">ORDEM DE COLETA</h2>
        <p className="text-gray-500 text-sm print:text-xs">Data de criação: {createdAt}</p>
      </div>
    </>
  );
};
